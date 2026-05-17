import { Student, CreateStudentInput } from "../types/Student";
import { getToken } from "../utils/auth";

// The base URL for all API requests
// Replace this with the URL from your own MockAPI.io project
const BASE_URL = "https://69ecd736af4ff533142b7203.mockapi.io";

// Builds the headers sent with every request.
// Always includes Content-Type, and adds the auth token if the user is logged in.
function getHeaders(): { [key: string]: string } {
  const headers: { [key: string]: string } = {
    "Content-Type": "application/json",
  };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// A helper that sends an HTTP request and returns the result as a JavaScript object.
// If the server returns an error status, it throws an Error so the caller can catch it.
async function sendRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: getHeaders(),
  });

  // If the server responded with an error (e.g. 404 Not Found, 500 Server Error)
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  // Parse and return the JSON body from the response
  return response.json();
}

// Get the full list of students from the server
export async function getAllStudents(): Promise<Student[]> {
  return sendRequest<Student[]>(`${BASE_URL}/students`);
}

// Get a single student by their unique ID
export async function getStudentById(id: string): Promise<Student> {
  return sendRequest<Student>(`${BASE_URL}/students/${id}`);
}

// Create a new student on the server
export async function createStudent(
  studentData: CreateStudentInput,
): Promise<Student> {
  return sendRequest<Student>(`${BASE_URL}/students`, {
    method: "POST",
    body: JSON.stringify(studentData),
  });
}

// Update an existing student's data on the server
export async function updateStudent(
  id: string,
  studentData: CreateStudentInput,
): Promise<Student> {
  return sendRequest<Student>(`${BASE_URL}/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(studentData),
  });
}

// Delete a student from the server
export async function deleteStudent(id: string): Promise<void> {
  await sendRequest(`${BASE_URL}/students/${id}`, {
    method: "DELETE",
  });
}
