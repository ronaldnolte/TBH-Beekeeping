import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { database } from '../database';
import Apiary from '@tbh-beekeeper/shared/src/models/Apiary';

type Props = {
    initialData?: Apiary;
    onSuccess: () => void;
    onCancel: () => void;
};

export const ApiaryForm = ({ initialData, onSuccess, onCancel }: Props) => {
    const [name, setName] = useState(initialData?.name || '');
    const [zipCode, setZipCode] = useState(initialData?.zipCode || '');
    const [notes, setNotes] = useState(initialData?.notes || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async () => {
        if (!name || !zipCode) {
            Alert.alert('Required Fields', 'Please fill in Name and Zip Code');
            return;
        }

        setIsSaving(true);

        try {
            await database.write(async () => {
                const apiariesCollection = database.collections.get<Apiary>('apiaries');

                if (initialData) {
                    await initialData.update(record => {
                        record.name = name;
                        record.zipCode = zipCode;
                        record.notes = notes;
                    });
                } else {
                    await apiariesCollection.create(record => {
                        record.name = name;
                        record.zipCode = zipCode;
                        record.notes = notes;
                        record.userId = 'user_1'; // TODO: Get real user ID
                        // @ts-ignore
                        record._raw.created_at = Date.now();
                        // @ts-ignore
                        record._raw.updated_at = Date.now();
                    });
                }
            });
            onSuccess();
        } catch (error) {
            console.error('Failed to save apiary:', error);
            Alert.alert('Error', 'Failed to save apiary');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.field}>
                <Text style={styles.label}>Apiary Name *</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Home Yard"
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Zip Code * <Text style={styles.subtext}>(for weather)</Text></Text>
                <TextInput
                    style={styles.input}
                    value={zipCode}
                    onChangeText={setZipCode}
                    placeholder="e.g. 90210"
                    keyboardType="numeric"
                    maxLength={5}
                />
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>Notes</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Location details..."
                    multiline
                    numberOfLines={4}
                />
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={onCancel}
                    disabled={isSaving}
                >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, styles.saveButton]}
                    onPress={handleSubmit}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.saveButtonText}>
                            {initialData ? 'Update' : 'Create'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 12,
    },
    field: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        color: '#4A3C28',
        marginBottom: 8,
    },
    subtext: {
        fontSize: 12,
        color: '#999',
        fontWeight: 'normal',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#FAFAFA',
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    button: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButton: {
        backgroundColor: '#E67E22',
    },
    saveButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    cancelButtonText: {
        color: '#666',
        fontWeight: '600',
        fontSize: 16,
    },
});
