import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Alert,
} from 'react-native';
import { Task } from '../lib/supabase';

type Props = {
    task: Task;
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
    onEdit: (id: string, title: string, description: string) => void;
};

export default function TaskItem({ task, onToggle, onDelete, onEdit }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDesc, setEditDesc] = useState(task.description || '');

    const handleSave = () => {
        if (!editTitle.trim()) return Alert.alert('Error', 'Title cannot be empty');
        onEdit(task.id, editTitle.trim(), editDesc.trim());
        setIsEditing(false);
    };

    const handleDelete = () => {
        Alert.alert('Delete Task', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => onDelete(task.id) },
        ]);
    };

    return (
        <View style={[styles.card, task.is_completed && styles.cardCompleted]}>
            {isEditing ? (
                /* ── Edit Mode ── */
                <View>
                    <TextInput
                        style={styles.editTitleInput}
                        value={editTitle}
                        onChangeText={setEditTitle}
                        placeholder="Task title"
                        placeholderTextColor="#888"
                        autoFocus
                    />
                    <TextInput
                        style={styles.editDescInput}
                        value={editDesc}
                        onChangeText={setEditDesc}
                        placeholder="Description (optional)"
                        placeholderTextColor="#888"
                        multiline
                    />
                    <View style={styles.editActions}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => {
                                setEditTitle(task.title);
                                setEditDesc(task.description || '');
                                setIsEditing(false);
                            }}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveText}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                /* ── View Mode ── */
                <View style={styles.taskRow}>
                    {/* Checkbox */}
                    <TouchableOpacity
                        style={styles.checkboxArea}
                        onPress={() => onToggle(task.id, task.is_completed)}
                    >
                        <View style={[styles.checkbox, task.is_completed && styles.checkboxChecked]}>
                            {task.is_completed && <Text style={styles.checkMark}>✓</Text>}
                        </View>
                    </TouchableOpacity>

                    {/* Text */}
                    <View style={styles.content}>
                        <Text style={[styles.title, task.is_completed && styles.titleStrikeout]} numberOfLines={2}>
                            {task.title}
                        </Text>
                        {task.description ? (
                            <Text style={[styles.description, task.is_completed && styles.descStrikeout]} numberOfLines={2}>
                                {task.description}
                            </Text>
                        ) : null}
                    </View>

                    {/* Buttons */}
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => setIsEditing(true)}>
                            <Text style={styles.actionIcon}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={handleDelete}>
                            <Text style={styles.actionIcon}>🗑️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 16, padding: 16, marginBottom: 12,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    cardCompleted: {
        opacity: 0.6,
        borderColor: 'rgba(108,99,255,0.3)',
    },
    taskRow: { flexDirection: 'row', alignItems: 'center' },
    checkboxArea: { marginRight: 12 },
    checkbox: {
        width: 26, height: 26, borderRadius: 8,
        borderWidth: 2, borderColor: '#6C63FF',
        alignItems: 'center', justifyContent: 'center',
    },
    checkboxChecked: { backgroundColor: '#6C63FF' },
    checkMark: { color: '#fff', fontSize: 14, fontWeight: '800' },
    content: { flex: 1 },
    title: { color: '#fff', fontSize: 15, fontWeight: '600' },
    titleStrikeout: { textDecorationLine: 'line-through', color: 'rgba(255,255,255,0.4)' },
    description: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 3 },
    descStrikeout: { textDecorationLine: 'line-through' },
    actions: { flexDirection: 'row', gap: 4, marginLeft: 8 },
    actionBtn: { padding: 6 },
    actionIcon: { fontSize: 16 },
    editTitleInput: {
        backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10,
        padding: 10, color: '#fff', fontSize: 15, marginBottom: 8,
        borderWidth: 1, borderColor: 'rgba(108,99,255,0.5)',
    },
    editDescInput: {
        backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 10,
        padding: 10, color: '#fff', fontSize: 13, marginBottom: 12,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', minHeight: 60,
        textAlignVertical: 'top',
    },
    editActions: { flexDirection: 'row', gap: 10 },
    cancelBtn: {
        flex: 1, padding: 10, borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center',
    },
    cancelText: { color: 'rgba(255,255,255,0.6)', fontWeight: '600' },
    saveBtn: {
        flex: 1, padding: 10, borderRadius: 10,
        backgroundColor: '#6C63FF', alignItems: 'center',
    },
    saveText: { color: '#fff', fontWeight: '700' },
});