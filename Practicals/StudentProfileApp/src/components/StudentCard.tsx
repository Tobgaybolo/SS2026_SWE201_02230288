import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Student } from "../types/Student";

// Describes the props (inputs) this component accepts
interface StudentCardProps {
  student: Student; // The student data to display on the card
  onEdit: (student: Student) => void; // Called when the user taps "Edit"
  onDelete: (id: string) => void; // Called when the user confirms "Delete"
  onPress: (student: Student) => void; // Called when the user taps the card
}

const StudentCard = ({
  student,
  onEdit,
  onDelete,
  onPress,
}: StudentCardProps) => {
  // Shows a confirmation popup before deleting.
  // This prevents the user from accidentally deleting a student.
  function handleDelete() {
    Alert.alert(
      "Delete Student",
      `Are you sure you want to delete ${student.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onDelete(student.id),
        },
      ],
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(student)}>
      <Image source={{ uri: student.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.department}>{student.department}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => onEdit(student)}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A1A1A",
  },
  rollNo: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  department: {
    fontSize: 13,
    color: "#555",
    marginTop: 2,
  },
  year: {
    fontSize: 12,
    color: "#4A90D9",
    marginTop: 2,
  },
  actions: {
    justifyContent: "center",
    gap: 6,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#4A90D9",
  },
  deleteButton: {
    backgroundColor: "#D32F2F",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default StudentCard;
