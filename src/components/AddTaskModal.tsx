import React, { useState } from 'react';
import {
    Modal, View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
    visible: boolean;
    onClose: () => void;
    onAdd: (title: string, description: string) => void;
};

export default function AddTaskModal({ visible, onClose, onAdd }: Props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleAdd = () => {
        if (!title.trim()) return;
        onAdd(title.trim(), description.trim());
        setTitle('');
        setDescription('');
        onClose();
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <View style={styles.sheet}>
                    <View style={styles.handle} />
                    <Text style={styles.sheetTitle}>New Task</Text>

                    <Text style={styles.label}>Title *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="What needs to be done?"
                        placeholderTextColor="#888"
                        value={title}
                        onChangeText={setTitle}
                        autoFocus
                    />

                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.multiline]}
                        placeholder="Add details (optional)"
                        placeholderTextColor="#888"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />

                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.addBtn, !title.trim() && styles.addBtnDisabled]}
                            onPress={handleAdd}
                            disabled={!title.trim()}
                        >
                            <LinearGradient
                                colors={['#6C63FF', '#3B82F6']}
                                style={styles.addGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.addText}>Add Task</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
    sheet: {
        backgroundColor: '#1A1A2E', borderTopLeftRadius: 28,
        borderTopRightRadius: 28, padding: 24, paddingBottom: 48,
    },
    handle: {
        width: 40, height: 4, borderRadius: 2,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'center', marginBottom: 20,
    },
    sheetTitle: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 20 },
    label: { color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: '600', marginBottom: 6 },
    input: {
        backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12,
        padding: 14, color: '#fff', fontSize: 15,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', marginBottom: 16,
    },
    multiline: { minHeight: 80 },
    btnRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
    cancelBtn: {
        flex: 1, padding: 16, borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center',
    },
    cancelText: { color: 'rgba(255,255,255,0.6)', fontWeight: '600', fontSize: 16 },
    addBtn: { flex: 2, borderRadius: 14, overflow: 'hidden' },
    addBtnDisabled: { opacity: 0.4 },
    addGradient: { padding: 16, alignItems: 'center' },
    addText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});