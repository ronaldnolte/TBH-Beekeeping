import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { Intervention, Hive } from '@tbh-beekeeper/shared';
import { supabase } from '../lib/supabase';
import { DetailModal } from './DetailModal';

const InterventionItem = ({ intervention, onPress }: { intervention: Intervention, onPress: () => void }) => {
    const date = new Date(intervention.timestamp);
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.type}>{intervention.type.replace(/_/g, ' ')}</Text>
                <Text style={styles.date}>{date.toLocaleDateString()}</Text>
            </View>
            {intervention.description ? (
                <Text style={styles.notes} numberOfLines={2}>{intervention.description}</Text>
            ) : null}
        </TouchableOpacity>
    );
};

export const InterventionList = ({ hive, refreshKey }: { hive: Hive, refreshKey?: number }) => {
    const [interventions, setInterventions] = useState<Intervention[]>([]);
    const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchInterventions = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('interventions')
            .select('*')
            .eq('hive_id', hive.id)
            .order('timestamp', { ascending: false });

        if (error) {
            console.error('Error fetching interventions:', error);
            Alert.alert('Error', 'Failed to load interventions');
        } else {
            setInterventions(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInterventions();
    }, [hive.id, refreshKey]);

    return (
        <>
            <FlatList
                data={interventions}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <InterventionItem intervention={item} onPress={() => setSelectedIntervention(item)} />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>{loading ? 'Loading...' : 'No interventions recorded.'}</Text>}
            />

            {selectedIntervention && (
                <DetailModal
                    visible={!!selectedIntervention}
                    onClose={() => setSelectedIntervention(null)}
                    title="Intervention Details"
                >
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Type:</Text>
                        <Text style={styles.detailValue}>{selectedIntervention.type.replace(/_/g, ' ')}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date:</Text>
                        <Text style={styles.detailValue}>{new Date(selectedIntervention.timestamp).toLocaleString()}</Text>
                    </View>
                    <Text style={styles.sectionHeader}>Notes</Text>
                    <View style={styles.notesContainer}>
                        <Text style={styles.fullNotes}>{selectedIntervention.description || 'No notes.'}</Text>
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    type: {
        fontWeight: 'bold',
        color: '#4A3C28',
        textTransform: 'capitalize',
        fontSize: 16,
    },
    date: {
        color: '#888',
        fontSize: 12,
    },
    notes: {
        color: '#666',
        fontSize: 14,
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
        textTransform: 'capitalize',
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
