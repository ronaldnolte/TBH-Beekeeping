import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { Inspection, Hive } from '@tbh-beekeeper/shared';
import { supabase } from '../lib/supabase';
import { DetailModal } from './DetailModal';

const inspectionColorMap = (status: string) => {
    if (!status) return '#DDD';
    const lower = status.toLowerCase();
    if (['seen', 'eggs', 'eggs_present', 'capped_brood'].some(s => lower.includes(s))) return '#D1F2EB'; // Green
    if (['no_queen', 'queen_cells'].some(s => lower.includes(s))) return '#FADBD8'; // Red
    return '#FCF3CF'; // Yellow
};

const InspectionItem = ({ inspection, onPress }: { inspection: Inspection, onPress: () => void }) => {
    const date = new Date(inspection.timestamp);

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.row}>
                <View>
                    <Text style={styles.date}>{date.toLocaleDateString()}</Text>
                    <Text style={styles.time}>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <View style={[styles.pill, { backgroundColor: inspectionColorMap(inspection.queen_status) }]}>
                    <Text style={styles.pillText}>{inspection.queen_status ? inspection.queen_status.replace(/_/g, ' ') : 'Unknown'}</Text>
                </View>
            </View>
            {inspection.observations ? (
                <Text style={styles.previewText} numberOfLines={2}>
                    {inspection.observations}
                </Text>
            ) : null}
        </TouchableOpacity>
    );
};

export const InspectionList = ({ hive, refreshKey }: { hive: Hive, refreshKey?: number }) => {
    const [inspections, setInspections] = useState<Inspection[]>([]);
    const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchInspections = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('inspections')
            .select('*')
            .eq('hive_id', hive.id)
            .order('timestamp', { ascending: false });

        if (error) {
            console.error('Error fetching inspections:', error);
            Alert.alert('Error', 'Failed to load inspections');
        } else {
            setInspections(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInspections();
    }, [hive.id, refreshKey]);

    const closeModal = () => setSelectedInspection(null);

    return (
        <>
            <FlatList
                data={inspections}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <InspectionItem
                        inspection={item}
                        onPress={() => setSelectedInspection(item)}
                    />
                )}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>{loading ? 'Loading...' : 'No inspections recorded.'}</Text>}
            />

            {selectedInspection && (
                <DetailModal
                    visible={!!selectedInspection}
                    onClose={closeModal}
                    title="Inspection Details"
                >
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date:</Text>
                        <Text style={styles.detailValue}>
                            {new Date(selectedInspection.timestamp).toLocaleString()}
                        </Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Queen Status:</Text>
                        <Text style={styles.detailValue}>
                            {selectedInspection.queen_status?.replace(/_/g, ' ') || 'Unknown'}
                        </Text>
                    </View>

                    <View style={styles.grid}>
                        <View style={styles.gridItem}>
                            <Text style={styles.detailLabel}>Temperament</Text>
                            <Text style={styles.gridValue}>{selectedInspection.temperament || '-'}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.detailLabel}>Brood</Text>
                            <Text style={styles.gridValue}>{selectedInspection.brood_pattern || '-'}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.detailLabel}>Honey</Text>
                            <Text style={styles.gridValue}>{selectedInspection.honey_stores || '-'}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.detailLabel}>Pollen</Text>
                            <Text style={styles.gridValue}>{selectedInspection.pollen_stores || '-'}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.detailLabel}>Population</Text>
                            <Text style={styles.gridValue}>{selectedInspection.population_strength || '-'}</Text>
                        </View>
                        <View style={styles.gridItem}>
                            <Text style={styles.detailLabel}>Weather</Text>
                            <Text style={styles.gridValue}>
                                {selectedInspection.weather
                                    ? `${Math.round(selectedInspection.weather.tempF)}°F ${selectedInspection.weather.condition}`
                                    : '-'}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.sectionHeader}>Observations</Text>
                    <View style={styles.observationsContainer}>
                        <Text style={styles.observationsText}>
                            {selectedInspection.observations || 'No notes recorded.'}
                        </Text>
                    </View>
                </DetailModal>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    date: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    time: {
        fontSize: 12,
        color: '#888',
    },
    pill: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        backgroundColor: '#F0F0F0',
    },
    pillText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#444',
        textTransform: 'capitalize',
    },
    previewText: {
        fontSize: 13,
        color: '#666',
        fontStyle: 'italic',
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        color: '#999',
        fontStyle: 'italic',
    },
    // Detail Styles
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
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
        backgroundColor: '#FAFAFA',
        padding: 10,
        borderRadius: 8,
    },
    gridItem: {
        width: '45%',
    },
    gridValue: {
        color: '#333',
        fontSize: 14,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4A3C28',
        marginTop: 10,
        marginBottom: 6,
    },
    observationsContainer: {
        backgroundColor: '#FFFBE6',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#F9E79F',
    },
    observationsText: {
        fontSize: 15,
        color: '#4A3C28',
        lineHeight: 22,
    },
});
