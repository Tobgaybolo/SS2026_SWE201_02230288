// AnimatedTodoList.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import Animated, {
  FadeInLeft,
  FadeOutRight,
  Layout,
} from 'react-native-reanimated';

interface Todo {
  id: number;
  text: string;
}

const AnimatedTodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Learn React Native' },
    { id: 2, text: 'Study Animations' },
    { id: 3, text: 'Build a project' },
  ]);
  const [input, setInput] = useState('');
  const [nextId, setNextId] = useState(4);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos((prev) => [...prev, { id: nextId, text: input }]);
    setNextId((prev) => prev + 1);
    setInput('');
  };

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Tasks</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Add a task..."
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {todos.map((todo) => (
        <Animated.View
          key={todo.id}
          entering={FadeInLeft.duration(400).springify()} // Slides in when added
          exiting={FadeOutRight.duration(300)}             // Slides out when removed
          layout={Layout.springify()}                     // Remaining items shift smoothly
          style={styles.todoItem}
        >
          <Text style={styles.todoText}>{todo.text}</Text>
          <TouchableOpacity onPress={() => removeTodo(todo.id)}>
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 50 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20, color: '#1A1A2E' },
  inputRow: { flexDirection: 'row', marginBottom: 16, gap: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    height: 46,
  },
  addButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: { color: '#FFF', fontSize: 24, fontWeight: '300' },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  todoText: { fontSize: 15, color: '#333', flex: 1 },
  deleteText: { fontSize: 16, color: '#FF4A6E', fontWeight: '600', paddingLeft: 10 },
});

export default AnimatedTodoList;
