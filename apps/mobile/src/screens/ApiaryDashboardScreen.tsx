import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Apiary, Hive } from '@tbh-beekeeper/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { supabase } from '../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'ApiaryDashboard'>;

const HiveCard = ({ hive, onPress, onDelete, onEdit }: { hive: Hive, onPress: () => void, onDelete: () => void, onEdit: () => void }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
        <View style={styles.cardHeader}>
            <Text style={styles.hiveName}>{hive.name}</Text>
            <View style={[styles.statusBadge, hive.is_active ? styles.activeBadge : styles.archivedBadge]}>
                <Text style={styles.statusText}>{hive.is_active ? 'Active' : 'Archived'}</Text>
            </View>
        </View>
        <Text style={styles.cardDetail}>{hive.bar_count} bars</Text>
        <View style={styles.cardActions}>
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
                <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
                <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
            </TouchableOpacity>
        </View>
    </TouchableOpacity>
);

const ApiaryDashboardScreen = ({ navigation, route }: Props) => {
    const { apiaryId } = route.params;
    const [apiary, setApiary] = useState<Apiary | null>(null);
    const [hives, setHives] = useState<Hive[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const { data: apiaryData } = await supabase.from('apiaries').select('*').eq('id', apiaryId).single();
        if (apiaryData) setApiary(apiaryData);

        const { data: hiveData } = await supabase.from('hives').select('*').eq('apiary_id', apiaryId).order('created_at', { ascending: false });
        setHives(hiveData || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const unsubscribe = navigation.addListener('focus', fetchData);
        return unsubscribe;
    }, [navigation, apiaryId]);

    const handleHivePress = (hive: Hive) => {
        navigation.navigate('HiveDetails', { hiveId: hive.id });
    };

    const handleDeleteHive = (hive: Hive) => {
        Alert.alert(
            "Delete Hive",
            `Are you sure you want to delete ${hive.name}? This will delete all related data.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Manual cascade delete since Supabase FK might not cascade automatically depending on config
                            await supabase.from('inspections').delete().eq('hive_id', hive.id);
                            await supabase.from('interventions').delete().eq('hive_id', hive.id);
                            await supabase.from('tasks').delete().eq('hive_id', hive.id);
                            await supabase.from('hive_snapshots').delete().eq('hive_id', hive.id);

                            const { error } = await supabase.from('hives').delete().eq('id', hive.id);
                            if (error) throw error;

                            fetchData();
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete hive");
                            console.error(error);
                        }
                    }
                }
            ]
        );
    };

    const handleAddHive = () => {
        // TODO: Implement Hive Creation
        Alert.alert("Coming Soon", "Hive creation will be implemented shortly.");
    };

    const handleEditHive = (hive: Hive) => {
        // TODO: Implement Hive Edit
        Alert.alert("Coming Soon", "Hive editing will be implemented shortly.");
    };

    if (loading && !apiary) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#E67E22" />
            </View>
        );
    }

    if (!apiary) return <View style={styles.centerContainer}><Text>Apiary not found</Text></View>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.apiaryName}>{apiary.name}</Text>
                <Text style={styles.apiaryZip}>{apiary.zip_code}</Text>
            </View>

            <TouchableOpacity style={styles.fab} onPress={handleAddHive}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>

            <FlatList
                data={hives}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <HiveCard
                        hive={item}
                        onPress={() => handleHivePress(item)}
                        onDelete={() => handleDeleteHive(item)}
                        onEdit={() => handleEditHive(item)}
                    />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No hives in this apiary.</Text>
                        <Text style={styles.emptySubText}>Tap + to add one.</Text>
                    </View>
                }
            />
        </View>
    );
};

export default ApiaryDashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    apiaryName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A3C28',
    },
    apiaryZip: {
        fontSize: 14,
        color: '#8B4513',
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    hiveName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A3C28',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    activeBadge: {
        backgroundColor: '#D1F2EB',
    },
    archivedBadge: {
        backgroundColor: '#F2F3F4',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#117864',
    },
    cardDetail: {
        color: '#666',
        fontSize: 14,
        marginBottom: 12,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
    },
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: '#F0F0F0',
    },
    deleteButton: {
        backgroundColor: '#FADBD8',
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#555',
    },
    deleteText: {
        color: '#C0392B',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 18,
        color: '#888',
        marginBottom: 8,
    },
    emptySubText: {
        fontSize: 14,
        color: '#AAA',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#E67E22',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    fabText: {
        fontSize: 32,
        color: '#FFF',
        marginTop: -4,
    },
});
