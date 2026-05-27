// Simple data shape describing a contact stored in the app.
// - `id`: unique identifier for list keys and deletion
// - `name`, `phone`, `email`: basic contact fields displayed in the UI
export type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
};