import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { Task, Hive } from '@tbh-beekeeper/shared';
import { supabase } from '../lib/supabase';
import { DetailModal } from './DetailModal';

const TaskItem = ({ task, onPress, onToggle }: { task: Task, onPress: () => void, onToggle: () => void }) => {
    const isCompleted = task.status === 'completed';
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <TouchableOpacity style={styles.checkbox} onPress={onToggle}>
                <Text style={styles.checkboxText}>{isCompleted ? '✓' : ''}</Text>
            </TouchableOpacity>
            <View style={styles.content}>
                <Text style={[styles.title, isCompleted && styles.completedTitle]}>{task.title}</Text>
                {task.due_date && <Text style={styles.due}>Due: {new Date(task.due_date).toLocaleDateString()}</Text>}
            </View>
        </TouchableOpacity>
    );
};

export const TaskList = ({ hive, refreshKey }: { hive: Hive, refreshKey?: number }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('hive_id', hive.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks:', error);
            Alert.alert('Error', 'Failed to load tasks');
        } else {
            // Client-side sort if needed for specific logic not in SQL
            // or just use SQL order.
            // Putting completed items at bottom could be good UX, but simple order by created_at is fine for now.
            setTasks(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchTasks();
    }, [hive.id, refreshKey]);

    const handleToggle = async (task: Task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        const completedAt = newStatus === 'completed' ? new Date().toISOString() : null;

        // Optimistic update
        const updatedTask = { ...task, status: newStatus, completed_at: completedAt };
        setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));

        const { error } = await supabase
            .from('tasks')
            .update({ status: newStatus, completed_at: completedAt })
            .eq('id', task.id);

        if (error) {
            console.error('Error toggling task:', error);
            Alert.alert('Error', 'Failed to update task');
            fetchTasks(); // Revert
        }
    };

    return (
        <>
            <FlatList
                data={tasks}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TaskItem
                        task={item}
                        onPress={() => setSelectedTask(item)}
                        onToggle={() => handleToggle(item)}
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>{loading ? 'Loading...' : 'No tasks.'}</Text>}
            />

            {selectedTask && (
                <DetailModal
                    visible={!!selectedTask}
                    onClose={() => setSelectedTask(null)}
                    title="Task Details"
                >
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status:</Text>
                        <Text style={[styles.detailValue, { fontWeight: 'bold', color: selectedTask.status === 'completed' ? 'green' : '#E67E22' }]}>
                            {selectedTask.status === 'completed' ? 'Completed' : 'Pending'}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Title:</Text>
                        <Text style={styles.detailValue}>{selectedTask.title}</Text>
                    </View>
                    {selectedTask.due_date && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Due Date:</Text>
                            <Text style={styles.detailValue}>{new Date(selectedTask.due_date).toLocaleDateString()}</Text>
                        </View>
                    )}
                    <Text style={styles.sectionHeader}>Description</Text>
                    <View style={styles.notesContainer}>
                        <Text style={styles.fullNotes}>{selectedTask.description || 'No description.'}</Text>
                    </View>
                </DetailModal>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#EEE',
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#E67E22',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxText: {
        color: '#E67E22',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        color: '#333',
    },
    completedTitle: {
        textDecorationLine: 'line-through',
        color: '#AAA',
    },
    due: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        color: '#999',
        fontStyle: 'italic',
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    detailLabel: {
        fontWeight: 'bold',
        color: '#555',
        marginRight: 8,
        fontSize: 14,
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
        flex: 1,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A3C28',
        marginTop: 10,
        marginBottom: 6,
    },
    notesContainer: {
        backgroundColor: '#F5F5F5',
        padding: 12,
        borderRadius: 8,
    },
    fullNotes: {
        fontSize: 15,
        color: '#333',
        lineHeight: 22,
    },
});
