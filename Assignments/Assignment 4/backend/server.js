// Simple Express backend that stores Expo push tokens and triggers remote
// push notifications through the Expo Push API (expo-server-sdk).
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Expo } = require('expo-server-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const expo = new Expo();
const PORT = process.env.PORT || 3000;

// Simple shared-secret used to protect the send endpoints. Set it in .env.
const API_KEY = process.env.API_KEY || 'dev-secret-key';

// In-memory mapping of device/user identifier -> Expo push token.
// (For a real app this would be a database.)
const deviceTokens = new Map(); // deviceId -> { token, platform, updatedAt }

// Middleware: require a matching API key for protected endpoints.
function requireApiKey(req, res, next) {
  const key = req.header('x-api-key');
  if (key !== API_KEY) {
    return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  next();
}

// --- Registration (called by the app) --------------------------------------
// Stores the mapping of device -> Expo push token.
app.post('/register', (req, res) => {
  const { token, deviceId, platform } = req.body || {};

  if (!Expo.isExpoPushToken(token)) {
    return res.status(400).json({ error: 'Invalid Expo push token' });
  }

  const id = deviceId || token; // fall back to token as the key
  deviceTokens.set(id, { token, platform: platform || 'unknown', updatedAt: Date.now() });
  console.log(`Registered device "${id}" (${deviceTokens.size} total)`);

  res.json({ message: 'Token registered', deviceCount: deviceTokens.size });
});

// Helper: send a batch of messages and return the Expo tickets.
async function sendMessages(messages) {
  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];
  for (const chunk of chunks) {
    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    tickets.push(...ticketChunk);
  }
  return tickets;
}

// --- Broadcast to all registered devices (protected) ------------------------
app.post('/notify', requireApiKey, async (req, res) => {
  const { title, message, data } = req.body || {};
  if (!title || !message) {
    return res.status(400).json({ error: 'title and message are required' });
  }

  const messages = [...deviceTokens.values()].map(({ token }) => ({
    to: token,
    sound: 'default',
    title,
    body: message,
    data: data || {},
    channelId: 'reminders',
  }));

  if (messages.length === 0) {
    return res.status(404).json({ error: 'No registered devices' });
  }

  try {
    const tickets = await sendMessages(messages);
    res.json({ success: true, sent: messages.length, tickets });
  } catch (error) {
    console.error('Push error:', error);
    res.status(500).json({ success: false, error: 'Failed to send' });
  }
});

// --- Send to a single device (protected) ------------------------------------
app.post('/notify/:deviceId', requireApiKey, async (req, res) => {
  const { deviceId } = req.params;
  const { title, message, data } = req.body || {};
  const entry = deviceTokens.get(deviceId);

  if (!entry) {
    return res.status(404).json({ error: 'Device not found' });
  }
  if (!title || !message) {
    return res.status(400).json({ error: 'title and message are required' });
  }

  try {
    const tickets = await sendMessages([
      {
        to: entry.token,
        sound: 'default',
        title,
        body: message,
        data: data || {},
        channelId: 'reminders',
      },
    ]);
    res.json({ success: true, tickets });
  } catch (error) {
    console.error('Push error:', error);
    res.status(500).json({ success: false, error: 'Failed to send' });
  }
});

// --- Diagnostics ------------------------------------------------------------
app.get('/tokens', (_req, res) => {
  res.json({
    count: deviceTokens.size,
    devices: [...deviceTokens.keys()],
  });
});

app.get('/', (_req, res) => res.send('TaskReminderPro push backend is running.'));

app.listen(PORT, () => {
  console.log(`Server running on http://172.20.10.6:${PORT}`);
});
