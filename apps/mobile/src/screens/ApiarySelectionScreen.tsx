import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { withObservables } from '@nozbe/watermelondb/react';
import { database } from '../database';
import Apiary from '@tbh-beekeeper/shared/src/models/Apiary';

type RootStackParamList = {
    Login: undefined;
    ApiarySelection: undefined;
    ApiaryDashboard: { apiaryId: string };
};

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ApiarySelection'>;
    apiaries: Apiary[];
};

const ApiarySelectionScreen = ({ navigation, apiaries }: Props) => {
    const [selectedApiaryId, setSelectedApiaryId] = useState<string>('');

    // Auto-select first apiary if available and none selected
    useEffect(() => {
        if (!selectedApiaryId && apiaries.length > 0) {
            setSelectedApiaryId(apiaries[0].id);
        }
    }, [apiaries, selectedApiaryId]);

    const handleOk = () => {
        if (selectedApiaryId) {
            navigation.navigate('ApiaryDashboard', { apiaryId: selectedApiaryId });
        }
    };

    const handleManageApiaries = () => {
        // TODO: Navigate to apiary management screen
        console.log('Manage apiaries');
    };

    const handleSyncNow = () => {
        // TODO: Trigger sync
        console.log('Sync now');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.icon}>🐝</Text>
                <Text style={styles.title}>Beekeeping Manager</Text>
            </View>

            <View style={styles.card}>
                <View style={styles.selectRow}>
                    <Text style={styles.label}>Select Apiary:</Text>
                    <View style={styles.pickerContainer}>
                        {apiaries.length > 0 ? (
                            <Picker
                                selectedValue={selectedApiaryId}
                                onValueChange={(value) => setSelectedApiaryId(value)}
                                style={styles.picker}
                            >
                                {apiaries.map((apiary) => (
                                    <Picker.Item key={apiary.id} label={apiary.name} value={apiary.id} />
                                ))}
                            </Picker>
                        ) : (
                            <View style={styles.noApiariesContainer}>
                                <Text style={styles.noApiariesText}>No apiaries found</Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[styles.okButton, !selectedApiaryId && styles.disabledButton]}
                        onPress={handleOk}
                        disabled={!selectedApiaryId}
                    >
                        <Text style={styles.okButtonText}>OK</Text>
                    </TouchableOpacity>
                </View>

                {apiaries.length === 0 && (
                    <Text style={styles.warningText}>
                        You need to create an apiary to get started.
                    </Text>
                )}

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.outlineButton} onPress={handleManageApiaries}>
                        <Text style={styles.outlineButtonText}>Manage Apiaries</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.outlineButton} onPress={handleSyncNow}>
                        <Text style={styles.outlineButtonText}>🔄 Sync Now</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.instructionText}>
                    Select an apiary above and click OK to begin.
                </Text>
            </View>
        </View>
    );
}

const enhance = withObservables([], () => ({
    apiaries: database.collections.get<Apiary>('apiaries').query(),
}));

export default enhance(ApiarySelectionScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
        padding: 20,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    icon: {
        fontSize: 48,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#4A3C28',
        marginTop: 8,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    selectRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: '#4A3C28',
        marginRight: 12,
    },
    pickerContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    picker: {
        height: 50,
    },
    noApiariesContainer: {
        height: 50,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    noApiariesText: {
        color: '#999',
        fontStyle: 'italic',
    },
    okButton: {
        backgroundColor: '#F5A623',
        borderRadius: 20,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    disabledButton: {
        backgroundColor: '#E0E0E0',
    },
    okButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    outlineButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#8B4513',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },
    outlineButtonText: {
        color: '#8B4513',
        fontSize: 14,
        fontWeight: '500',
    },
    instructionText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 14,
    },
    warningText: {
        color: '#D35400',
        textAlign: 'center',
        marginBottom: 15,
        fontWeight: '500',
    },
});
