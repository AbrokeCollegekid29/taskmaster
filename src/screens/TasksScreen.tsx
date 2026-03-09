import React, { useEffect, useState, useCallback } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, StyleSheet,
    ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import { supabase, Task } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import TaskItem from '../components/TaskItem';
import AddTaskModal from '../components/AddTaskModal';

export default function TasksScreen() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');

    const fetchTasks = useCallback(async () => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) Alert.alert('Error', error.message);
        else setTasks(data || []);
        setLoading(false);
        setRefreshing(false);
    }, []);

    useEffect(() => {
        fetchTasks();

        // Real-time updates
        const channel = supabase
            .channel('tasks-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'tasks',
                filter: `user_id=eq.${user?.id}`,
            }, fetchTasks)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, [fetchTasks]);

    const addTask = async (title: string, description: string) => {
        const { error } = await supabase.from('tasks').insert({
            title,
            description: description || null,
            user_id: user?.id,
        });
        if (error) Alert.alert('Error', error.message);
        else fetchTasks();
    };

    const toggleTask = async (id: string, currentCompleted: boolean) => {
        const { error } = await supabase
            .from('tasks')
            .update({ is_completed: !currentCompleted, updated_at: new Date().toISOString() })
            .eq('id', id);
        if (error) Alert.alert('Error', error.message);
        else setTasks(prev => prev.map(t => t.id === id ? { ...t, is_completed: !currentCompleted } : t));
    };

    const deleteTask = async (id: string) => {
        const { error } = await supabase.from('tasks').delete().eq('id', id);
        if (error) Alert.alert('Error', error.message);
        else setTasks(prev => prev.filter(t => t.id !== id));
    };

    const editTask = async (id: string, title: string, description: string) => {
        const { error } = await supabase
            .from('tasks')
            .update({ title, description: description || null, updated_at: new Date().toISOString() })
            .eq('id', id);
        if (error) Alert.alert('Error', error.message);
        else setTasks(prev => prev.map(t => t.id === id ? { ...t, title, description } : t));
    };

    const filteredTasks = tasks.filter(t => {
        if (filter === 'active') return !t.is_completed;
        if (filter === 'done') return t.is_completed;
        return true;
    });

    const completedCount = tasks.filter(t => t.is_completed).length;

    return (
        <View style={[styles.container, { backgroundColor: '#0F0F23' }]}>

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>My Tasks</Text>
                    <Text style={styles.stats}>{completedCount}/{tasks.length} completed</Text>
                </View>
                <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                    <View style={[styles.addGradient, { backgroundColor: '#6C63FF' }]}>
                        <Text style={styles.addIcon}>+</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            {tasks.length > 0 && (
                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${(completedCount / tasks.length) * 100}%` }]} />
                    </View>
                </View>
            )}

            {/* Filter Tabs */}
            <View style={styles.filterRow}>
                {(['all', 'active', 'done'] as const).map(f => (
                    <TouchableOpacity
                        key={f}
                        style={[styles.filterTab, filter === f && styles.filterTabActive]}
                        onPress={() => setFilter(f)}
                    >
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Task List */}
            {loading ? (
                <ActivityIndicator color="#6C63FF" size="large" style={{ marginTop: 60 }} />
            ) : (
                <FlatList
                    data={filteredTasks}
                    keyExtractor={t => t.id}
                    renderItem={({ item }) => (
                        <TaskItem
                            task={item}
                            onToggle={toggleTask}
                            onDelete={deleteTask}
                            onEdit={editTask}
                        />
                    )}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => { setRefreshing(true); fetchTasks(); }}
                            tintColor="#6C63FF"
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyIcon}>📋</Text>
                            <Text style={styles.emptyText}>No tasks yet</Text>
                            <Text style={styles.emptySubtext}>Tap + to add your first task</Text>
                        </View>
                    }
                />
            )}

            <AddTaskModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAdd={addTask}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
    },
    greeting: { color: '#fff', fontSize: 26, fontWeight: '800' },
    stats: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 2 },
    addBtn: { borderRadius: 18, overflow: 'hidden' },
    addGradient: { width: 52, height: 52, alignItems: 'center', justifyContent: 'center', borderRadius: 18 },
    addIcon: { color: '#fff', fontSize: 32, fontWeight: '300', lineHeight: 36 },
    progressContainer: { paddingHorizontal: 20, marginBottom: 16 },
    progressBar: { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2 },
    progressFill: { height: 4, backgroundColor: '#6C63FF', borderRadius: 2 },
    filterRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16, gap: 8 },
    filterTab: {
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    filterTabActive: { backgroundColor: '#6C63FF' },
    filterText: { color: 'rgba(255,255,255,0.5)', fontWeight: '600', fontSize: 14 },
    filterTextActive: { color: '#fff' },
    list: { paddingHorizontal: 20, paddingBottom: 100 },
    empty: { alignItems: 'center', marginTop: 80 },
    emptyIcon: { fontSize: 56, marginBottom: 16 },
    emptyText: { color: '#fff', fontSize: 20, fontWeight: '700' },
    emptySubtext: { color: 'rgba(255,255,255,0.4)', marginTop: 6 },
});