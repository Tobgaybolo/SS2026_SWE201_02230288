// Describes the shape of a student object used throughout the app
export interface Student {
  id: string; // Unique ID assigned by the server (e.g. "1", "2")
  name: string; // Full name (e.g. "Abebe Kebede")
  rollNo: string; // University roll number (e.g. "023045346")
  department: string; // Department name (e.g. "Computing Technologies Department")
  email: string; // Student's email address
  year: number; // Current academic year (1, 2, 3, or 4)
  avatar: string; // URL to the student's profile picture
}

// Used when creating a new student.
// Same as Student but without 'id' — the server generates the id automatically.
export type CreateStudentInput = Omit<Student, "id">;
