import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react';
import { database } from '../database';
import Apiary from '@tbh-beekeeper/shared/src/models/Apiary';
import { ApiaryForm } from '../components/ApiaryForm';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
    navigation: NativeStackNavigationProp<any>;
    apiaries: Apiary[];
};

const ApiaryItem = ({ apiary, onEdit, onDelete }: { apiary: Apiary, onEdit: (a: Apiary) => void, onDelete: (a: Apiary) => void }) => (
    <View style={styles.item}>
        <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{apiary.name}</Text>
            <Text style={styles.itemMeta}>{apiary.zipCode}</Text>
        </View>
        <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdit(apiary)} style={styles.actionButton}>
                <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(apiary)} style={styles.actionButton}>
                <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const ApiaryManagementScreen = ({ navigation, apiaries }: Props) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [editingApiary, setEditingApiary] = useState<Apiary | undefined>(undefined);

    const handleCreate = () => {
        setEditingApiary(undefined);
        setModalVisible(true);
    };

    const handleEdit = (apiary: Apiary) => {
        setEditingApiary(apiary);
        setModalVisible(true);
    };

    const handleDelete = async (apiary: Apiary) => {
        // Check for hives first
        const hiveCount = await apiary.hives.fetchCount();
        if (hiveCount > 0) {
            Alert.alert('Cannot Delete', `Apiary contains ${hiveCount} hives. Please move them first.`);
            return;
        }

        Alert.alert(
            'Delete Apiary',
            `Are you sure you want to delete "${apiary.name}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        await database.write(async () => {
                            await apiary.markAsDeleted();
                        });
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={apiaries}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ApiaryItem
                        apiary={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={styles.title}>Manage Apiaries</Text>
                        <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
                            <Text style={styles.addButtonText}>+ Add New</Text>
                        </TouchableOpacity>
                    </View>
                }
                ListEmptyComponent={
                    <Text style={styles.emptyText}>No apiaries found. Create one to get started.</Text>
                }
                contentContainerStyle={styles.listContent}
            />

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingApiary ? 'Edit Apiary' : 'New Apiary'}</Text>
                        <ApiaryForm
                            initialData={editingApiary}
                            onSuccess={() => setModalVisible(false)}
                            onCancel={() => setModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const enhance = withObservables([], () => ({
    apiaries: database.collections.get<Apiary>('apiaries').query(),
}));

export default enhance(ApiaryManagementScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8F0',
    },
    listContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A3C28',
    },
    addButton: {
        backgroundColor: '#E67E22',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    item: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#4A3C28',
    },
    itemMeta: {
        color: '#8B4513',
        fontSize: 14,
        marginTop: 4,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 8,
    },
    editText: {
        color: '#3498DB',
        fontWeight: '600',
    },
    deleteText: {
        color: '#E74C3C',
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 40,
        fontStyle: 'italic',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: '#4A3C28',
    },
});
