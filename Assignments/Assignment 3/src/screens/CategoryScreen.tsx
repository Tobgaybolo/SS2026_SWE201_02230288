import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useAppContext } from '../store/AppContext';
import { createCategory, deleteCategory } from '../api/categoriesApi';
import { validateTextField } from '../utils/validators';

// Preset colors for category selection
const PRESET_COLORS = [
  '#6366f1', '#ef4444', '#10b981', '#f59e0b',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
  '#f97316', '#84cc16',
];

const CategoryScreen = () => {
  const { state, dispatch } = useAppContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openModal = () => {
    setName('');
    setSelectedColor(PRESET_COLORS[0]);
    setNameError(null);
    setModalVisible(true);
  };

  const handleCreate = async () => {
    // Validate name field
    const error = validateTextField(name, 'Category name', 2, 30);
    if (error) {
      setNameError(error);
      return;
    }

    setSubmitting(true);
    try {
      const created = await createCategory({ name, color: selectedColor });
      dispatch({ type: 'ADD_CATEGORY', payload: created });
      setModalVisible(false);
    } catch (err) {
      Alert.alert(
        'Error',
        err instanceof Error ? err.message : 'Failed to create category.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string, catName: string) => {
    Alert.alert(
      'Delete Category',
      `Delete "${catName}"? Tasks using this category will become uncategorized.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingId(id);
            try {
              await deleteCategory(id);
              dispatch({
                type: 'SET_CATEGORIES',
                payload: state.categories.filter((c) => c.id !== id),
              });
            } catch (err) {
              Alert.alert(
                'Error',
                err instanceof Error ? err.message : 'Failed to delete.'
              );
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  // Count how many tasks use each category
  const getTaskCount = (categoryId: string): number =>
    state.tasks.filter((t) => t.categoryId === categoryId).length;

  const renderCategory = ({ item }: { item: typeof state.categories[0] }) => (
    <View style={styles.categoryCard}>
      {/* Color dot + name */}
      <View style={styles.categoryLeft}>
        <View style={[styles.colorDot, { backgroundColor: item.color }]} />
        <View>
          <Text style={styles.categoryName}>{item.name}</Text>
          <Text style={styles.taskCount}>
            {getTaskCount(item.id)} task{getTaskCount(item.id) !== 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Delete button */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item.id, item.name)}
        disabled={deletingId === item.id}
      >
        {deletingId === item.id ? (
          <ActivityIndicator size="small" color="#ef4444" />
        ) : (
          <Text style={styles.deleteBtnText}>🗑️</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🏷️</Text>
      <Text style={styles.emptyTitle}>No categories yet</Text>
      <Text style={styles.emptySubtitle}>
        Tap + to create your first category
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header count */}
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>
          {state.categories.length} categor
          {state.categories.length !== 1 ? 'ies' : 'y'}
        </Text>
        <TouchableOpacity style={styles.addBtn} onPress={openModal}>
          <Text style={styles.addBtnText}>+ New Category</Text>
        </TouchableOpacity>
      </View>

      {/* Category list */}
      <FlatList
        data={state.categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          state.categories.length === 0
            ? styles.flatListEmpty
            : styles.flatList
        }
      />

      {/* Create category modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Category</Text>

            {/* Name input */}
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, nameError ? styles.inputError : null]}
              placeholder="e.g. Work, Personal, Health"
              placeholderTextColor="#9ca3af"
              value={name}
              onChangeText={(v) => {
                setName(v);
                if (nameError) setNameError(null);
              }}
              maxLength={30}
              autoFocus
            />
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}

            {/* Color picker */}
            <Text style={styles.label}>Color</Text>
            <View style={styles.colorGrid}>
              {PRESET_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color ? styles.colorOptionSelected : null,
                  ]}
                  onPress={() => setSelectedColor(color)}
                >
                  {selectedColor === color ? (
                    <Text style={styles.colorCheck}>✓</Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>

            {/* Preview */}
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Preview:</Text>
              <View
                style={[
                  styles.previewBadge,
                  { backgroundColor: selectedColor + '22' },
                ]}
              >
                <View
                  style={[
                    styles.previewDot,
                    { backgroundColor: selectedColor },
                  ]}
                />
                <Text
                  style={[styles.previewText, { color: selectedColor }]}
                >
                  {name || 'Category name'}
                </Text>
              </View>
            </View>

            {/* Modal buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                disabled={submitting}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.createBtn,
                  submitting ? styles.btnDisabled : null,
                ]}
                onPress={handleCreate}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.createBtnText}>Create</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerText: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  addBtn: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  flatList: { padding: 16, gap: 10 },
  flatListEmpty: { flex: 1 },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  colorDot: { width: 20, height: 20, borderRadius: 10 },
  categoryName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  taskCount: { fontSize: 12, color: '#9ca3af', marginTop: 2 },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: { fontSize: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyEmoji: { fontSize: 56, marginBottom: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#374151' },
  emptySubtitle: { fontSize: 14, color: '#9ca3af' },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  inputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 4 },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: '#111827',
  },
  colorCheck: { color: '#fff', fontWeight: '800', fontSize: 16 },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  previewLabel: { fontSize: 13, color: '#6b7280', fontWeight: '600' },
  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  previewDot: { width: 8, height: 8, borderRadius: 4 },
  previewText: { fontSize: 13, fontWeight: '600' },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelBtnText: { color: '#6b7280', fontWeight: '600', fontSize: 15 },
  createBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  createBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  btnDisabled: { opacity: 0.6 },
});

export default CategoryScreen;