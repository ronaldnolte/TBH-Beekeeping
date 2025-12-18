import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Hive, HiveSnapshot } from '@tbh-beekeeper/shared';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { supabase } from '../lib/supabase';

import { InspectionList } from '../components/InspectionList';
import { InterventionList } from '../components/InterventionList';
import { TaskList } from '../components/TaskList';

const BAR_COLORS = {
    inactive: '#374151',
    active: '#06B6D4',
    empty: '#FFFFFF',
    brood: '#92400E',
    resource: '#FCD34D',
    follower_board: '#1F2937',
};

type Props = NativeStackScreenProps<RootStackParamList, 'HiveDetails'>;

const HiveDetailsScreen = ({ navigation, route }: Props) => {
    const { hiveId } = route.params;
    const [hive, setHive] = useState<Hive | null>(null);
    const [snapshots, setSnapshots] = useState<HiveSnapshot[]>([]);
    const [selectedSnapshot, setSelectedSnapshot] = useState<HiveSnapshot | null>(null);
    const [activeTab, setActiveTab] = useState<'Inspections' | 'Interventions' | 'Tasks'>('Inspections');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const { data: hiveData } = await supabase.from('hives').select('*').eq('id', hiveId).single();
        if (hiveData) setHive(hiveData);

        const { data: snapshotData } = await supabase
            .from('hive_snapshots')
            .select('*')
            .eq('hive_id', hiveId)
            .order('timestamp', { ascending: false });

        setSnapshots(snapshotData || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [hiveId]);

    if (loading && !hive) return <View style={styles.centerContainer}><ActivityIndicator size="large" color="#E67E22" /></View>;
    if (!hive) return <View style={styles.centerContainer}><Text>Hive not found</Text></View>;

    const latestSnapshot = snapshots[0];
    const displaySnapshot = selectedSnapshot || latestSnapshot;
    // Handle both new array format from Supabase (JSONB) and potential stringified fallback if legacy
    const bars = displaySnapshot
        ? (typeof displaySnapshot.bars === 'string' ? JSON.parse(displaySnapshot.bars) : displaySnapshot.bars)
        : (typeof hive.bars === 'string' ? JSON.parse(hive.bars) : hive.bars || []);

    const renderVisualizer = () => (
        <View style={styles.visualizerContainer}>
            <Text style={styles.sectionTitle}>Top Bar Config {selectedSnapshot ? '(History)' : ''}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.barsScroll}>
                <View style={styles.barsRow}>
                    {bars.map((bar: any) => (
                        <View
                            key={bar.position}
                            style={[
                                styles.bar,
                                { backgroundColor: BAR_COLORS[bar.status as keyof typeof BAR_COLORS] || '#333' }
                            ]}
                        >
                            <Text style={[
                                styles.barText,
                                { color: ['empty', 'resource'].includes(bar.status) ? '#000' : '#FFF' }
                            ]}>
                                {bar.position}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );

    const renderHistory = () => (
        <View style={styles.historyContainer}>
            <Text style={styles.sectionTitle}>History</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
                {snapshots.length === 0 && <Text style={styles.noHistoryText}>No history.</Text>}
                {snapshots.map(s => (
                    <TouchableOpacity
                        key={s.id}
                        style={[styles.historyItem, selectedSnapshot?.id === s.id && styles.selectedHistoryItem]}
                        onPress={() => setSelectedSnapshot(s.id === selectedSnapshot?.id ? null : s)}
                    >
                        <Text style={styles.historyDate}>{new Date(s.timestamp).toLocaleDateString()}</Text>
                        <Text style={styles.historyTime}>{new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Inspections':
                return <InspectionList hive={hive} />;
            case 'Interventions':
                return <InterventionList hive={hive} />;
            case 'Tasks':
                return <TaskList hive={hive} />;
            default:
                return null;
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.hiveName}>{hive.name}</Text>
                <Text style={styles.hiveMeta}>
                    {hive.is_active ? 'Active' : 'Inactive'} • {hive.bar_count} bars
                </Text>
            </View>

            {renderVisualizer()}
            {renderHistory()}

            <View style={styles.tabsContainer}>
                {(['Inspections', 'Interventions', 'Tasks'] as const).map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.tabContent}>
                {renderTabContent()}
            </View>
        </ScrollView>
    );
};

export default HiveDetailsScreen;

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
        padding: 20,
        backgroundColor: '#E67E22',
    },
    hiveName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    hiveMeta: {
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#4A3C28',
        textTransform: 'uppercase',
        marginBottom: 8,
        marginLeft: 4,
    },
    visualizerContainer: {
        padding: 16,
        backgroundColor: '#FFF',
        marginTop: 10,
    },
    barsScroll: {
        paddingVertical: 10,
    },
    barsRow: {
        flexDirection: 'row',
        gap: 2,
    },
    bar: {
        width: 30,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
    },
    barText: {
        fontSize: 10,
        fontWeight: 'bold',
        opacity: 0.8,
    },
    historyContainer: {
        marginTop: 10,
        padding: 16,
        backgroundColor: '#FFF',
    },
    historyScroll: {
        paddingBottom: 4,
    },
    historyItem: {
        padding: 10,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    selectedHistoryItem: {
        borderColor: '#E67E22',
        backgroundColor: '#FFF5E5',
    },
    historyDate: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
    historyTime: {
        fontSize: 10,
        color: '#666',
    },
    noHistoryText: {
        color: '#999',
        fontStyle: 'italic',
        fontSize: 12,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    tab: {
        flex: 1,
        paddingVertical: 14,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#E67E22',
    },
    tabText: {
        fontSize: 14,
        color: '#999',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#E67E22',
        fontWeight: 'bold',
    },
    tabContent: {
        padding: 20,
        minHeight: 200,
    },
});
