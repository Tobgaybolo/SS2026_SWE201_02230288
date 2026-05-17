// The base URL for the login API
// We use reqres.in which is a free fake API for testing login flows
const AUTH_URL = "https://reqres.in/api";

// This variable holds the token after the user logs in.
// It stays in memory while the app is running.
// Valid test credentials: email: eve.holt@reqres.in | password: cityslicka
let authToken: string | null = null;

// Logs the user in by sending their email and password to the server.
// If successful, the server sends back a token which we store in authToken.
export async function login(email: string, password: string): Promise<string> {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  // If the credentials are wrong, the server responds with status 400
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Login failed. Check your credentials.");
  }

  const data = await response.json();
  // The server responds with: { "token": "QpwL5tke4Pnpja7X" }

  authToken = data.token; // Save the token so we can use it in future requests
  return data.token;
}

// Returns the currently stored token, or null if the user is not logged in
export function getToken(): string | null {
  return authToken;
}

// Clears the stored token — effectively logs the user out
export function logout(): void {
  authToken = null;
}

// Returns true if the user is currently logged in (has a token)
export function isAuthenticated(): boolean {
  return authToken !== null;
}
