import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Student, CreateStudentInput } from "../types/Student";

// Describes the props (inputs) this component accepts
interface StudentFormProps {
  // If a student is passed in, the form will be in "Edit" mode with their data pre-filled.
  // If nothing is passed, the form will be in "Add New Student" mode with empty fields.
  initialData?: Student | null;

  // Function called when the user submits the form with valid data
  onSubmit: (data: CreateStudentInput) => void;

  // Function called when the user presses Cancel
  onCancel: () => void;

  // When true, the submit button shows a spinner and is disabled
  loading: boolean;
}

const StudentForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: StudentFormProps) => {
  // One state variable per input field
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [year, setYear] = useState("");

  // Stores validation error messages for each field (e.g. { name: "Name is required" })
  const [errors, setErrors] = useState<{ [field: string]: string }>({});

  // If a student is passed in for editing, fill the form fields with their current data.
  // This runs once when the component opens (or when initialData changes).
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRollNo(initialData.rollNo);
      setDepartment(initialData.department);
      setEmail(initialData.email);
      setYear(String(initialData.year));
    }
  }, [initialData]);

  // Checks all fields and returns true if everything is valid.
  // If any field is invalid, it stores an error message to show under that field.
  function validate(): boolean {
    const newErrors: { [field: string]: string } = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!rollNo.trim()) newErrors.rollNo = "Roll number is required";
    if (!department.trim()) newErrors.department = "Department is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!year.trim()) {
      newErrors.year = "Year is required";
    } else if (isNaN(Number(year)) || Number(year) < 1 || Number(year) > 7) {
      newErrors.year = "Year must be between 1 and 7";
    }

    setErrors(newErrors);

    // If there are no error messages, all fields are valid
    return Object.keys(newErrors).length === 0;
  }

  // Called when the user presses the submit button.
  // Validates the form first — if valid, sends the data to the parent component.
  function handleSubmit() {
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      rollNo: rollNo.trim(),
      department: department.trim(),
      email: email.trim().toLowerCase(),
      year: Number(year),
      avatar: initialData?.avatar || "https://i.pravatar.cc/150",
    });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>
          {initialData ? "Edit Student" : "Add New Student"}
        </Text>

        {/* Name Field */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Abebe Kebede"
          autoCapitalize="words"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {/* Roll Number Field */}
        <Text style={styles.label}>Roll Number</Text>
        <TextInput
          style={[styles.input, errors.rollNo && styles.inputError]}
          value={rollNo}
          onChangeText={setRollNo}
          placeholder="e.g., BEse/2001/14"
          autoCapitalize="characters"
        />
        {errors.rollNo && <Text style={styles.errorText}>{errors.rollNo}</Text>}

        {/* Department Field */}
        <Text style={styles.label}>Department</Text>
        <TextInput
          style={[styles.input, errors.department && styles.inputError]}
          value={department}
          onChangeText={setDepartment}
          placeholder="e.g., Software Engineering"
        />
        {errors.department && (
          <Text style={styles.errorText}>{errors.department}</Text>
        )}

        {/* Email Field */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={email}
          onChangeText={setEmail}
          placeholder="e.g., abebe@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Year Field */}
        <Text style={styles.label}>Academic Year</Text>
        <TextInput
          style={[styles.input, errors.year && styles.inputError]}
          value={year}
          onChangeText={setYear}
          placeholder="e.g., 2"
          keyboardType="numeric"
          maxLength={1}
        />
        {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}

        {/* Action Buttons */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitButtonText}>
              {initialData ? "Update Student" : "Add Student"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1A1A",
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#1A1A1A",
  },
  inputError: {
    borderColor: "#D32F2F",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#4A90D9",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#888",
    fontSize: 16,
  },
});

export default StudentForm;
