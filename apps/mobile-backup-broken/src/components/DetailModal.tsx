import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

type Props = {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
};

export const DetailModal = ({ visible, onClose, title, children }: Props) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.content}>
                        {children}
                    </ScrollView>
                    <View style={styles.footer}>
                        <TouchableOpacity onPress={onClose} style={styles.button}>
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    container: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        maxHeight: '80%',
        width: '100%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4A3C28',
    },
    closeButton: {
        padding: 4,
    },
    closeText: {
        fontSize: 20,
        color: '#999',
    },
    content: {
        padding: 20,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        alignItems: 'flex-end',
    },
    button: {
        backgroundColor: '#F5F5F5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: '#333',
        fontWeight: '600',
    },
});
