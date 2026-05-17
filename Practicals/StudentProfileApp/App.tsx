import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Modal,
  RefreshControl,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import StudentCard from "./src/components/StudentCard";
import StudentForm from "./src/components/StudentForm";
import {
  getAllStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentById,
} from "./src/api/studentApi";
import { Student, CreateStudentInput } from "./src/types/Student";

export default function HomeScreen() {
  // The list of students shown on screen
  const [students, setStudents] = useState<Student[]>([]);

  // True while loading students for the first time
  const [loading, setLoading] = useState<boolean>(true);

  // True while the user is pulling down to refresh
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // True while a form is being submitted (create or update)
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Holds an error message if something goes wrong
  const [error, setError] = useState<string | null>(null);

  // Controls whether the Add / Edit form modal is visible
  const [showForm, setShowForm] = useState<boolean>(false);

  // The student currently being edited — null means we are adding a new one
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Load students automatically when the screen first opens
  useEffect(() => {
    loadStudents();
  }, []);

  // Fetches all students from the server and saves them in state
  async function loadStudents() {
    try {
      setError(null);
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      setError("Failed to load students. Please try again.");
    } finally {
      // Always stop the loading spinner when the request finishes
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Called when the user pulls down on the list to refresh
  function onRefresh() {
    setRefreshing(true);
    loadStudents();
  }

  // Sends the new student data to the server and adds them to the list
  async function handleCreate(data: CreateStudentInput) {
    try {
      setSubmitting(true);
      const newStudent = await createStudent(data);

      // Put the new student at the top of the list
      setStudents([newStudent, ...students]);
      setShowForm(false);
      Alert.alert("Success", `${newStudent.name} has been added.`);
    } catch (err) {
      Alert.alert("Error", "Failed to create student. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Sends the updated data to the server and refreshes the list
  async function handleUpdate(data: CreateStudentInput) {
    // Do nothing if there is no student selected for editing
    if (!editingStudent) return;

    try {
      setSubmitting(true);
      const updatedStudent = await updateStudent(editingStudent.id, data);

      // Go through the list and swap the old student with the updated one
      const updatedList = students.map((student) =>
        student.id === updatedStudent.id ? updatedStudent : student,
      );
      setStudents(updatedList);
      setEditingStudent(null);
      setShowForm(false);
      Alert.alert(
        "Success",
        `${updatedStudent.name}'s profile has been updated.`,
      );
    } catch (err) {
      Alert.alert("Error", "Failed to update student. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Deletes the student from the server and removes them from the list
  async function handleDelete(id: string) {
    try {
      await deleteStudent(id);

      // Keep everyone except the deleted student
      const updatedList = students.filter((student) => student.id !== id);
      setStudents(updatedList);
      Alert.alert("Deleted", "Student has been removed.");
    } catch (err) {
      Alert.alert("Error", "Failed to delete student. Please try again.");
    }
  }

  // Fetches fresh details for a student and shows them in a popup
  async function handleViewDetails(student: Student) {
    try {
      const freshData = await getStudentById(student.id);
      Alert.alert(
        freshData.name,
        `Roll No: ${freshData.rollNo}\nDepartment: ${freshData.department}\nEmail: ${freshData.email}\nYear: ${freshData.year}`,
      );
    } catch (err) {
      Alert.alert("Error", "Failed to load student details.");
    }
  }

  // Opens the form pre-filled with the selected student's data
  function handleEdit(student: Student) {
    setEditingStudent(student);
    setShowForm(true);
  }

  // Closes the form and clears any student that was being edited
  function handleCancel() {
    setShowForm(false);
    setEditingStudent(null);
  }

  // Show a loading spinner while the first data fetch is running
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90D9" />
        <Text style={styles.loadingText}>Loading students...</Text>
      </View>
    );
  }

  if (error && students.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadStudents}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Student Profiles</Text>
          <Text style={styles.headerSubtitle}>{students.length} students</Text>
        </View>

        {/* Student List */}
        <FlatList
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StudentCard
              student={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPress={handleViewDetails}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No students found.</Text>
              <Text style={styles.emptySubtext}>
                Tap "+" to add the first student.
              </Text>
            </View>
          }
        />

        {/* Floating Action Button — Add New Student */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => {
            setEditingStudent(null);
            setShowForm(true);
          }}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        {/* Modal for Create/Edit Form */}
        <Modal
          visible={showForm}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <StudentForm
            initialData={editingStudent}
            onSubmit={editingStudent ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            loading={submitting}
          />
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: "#F5F5F5",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 80,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#4A90D9",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#AAA",
    marginTop: 6,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#4A90D9",
    justifyContent: "center",
    alignItems: "center",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    // Shadow for Android
    elevation: 8,
  },
  fabText: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: -2,
  },
});
