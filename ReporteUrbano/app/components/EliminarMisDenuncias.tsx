import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EliminarMisDenunciasProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
}

// Función para convertir rem a píxeles
const rem = (size: number) => {
  const { width, height } = Dimensions.get('window');
  const scale = Math.min(width, height) / 375;
  return size * 16 * scale;
};

const EliminarMisDenuncias: React.FC<EliminarMisDenunciasProps> = ({
  visible,
  onClose,
  onConfirm,
  titulo
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Ionicons name="warning" size={rem(2)} color="#FF3B30" />
            <Text style={styles.title}>Eliminar Denuncia</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.message}>
              ¿Estás seguro de que quieres eliminar la denuncia "{titulo}"?
            </Text>
            <Text style={styles.warning}>
              Esta acción no se puede deshacer.
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={onConfirm}
            >
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: rem(1),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    alignItems: 'center',
    padding: rem(1.5),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: rem(1.2),
    fontWeight: 'bold',
    color: '#333',
    marginTop: rem(0.5),
  },
  content: {
    padding: rem(1.5),
  },
  message: {
    fontSize: rem(1),
    color: '#333',
    textAlign: 'center',
    marginBottom: rem(0.5),
  },
  warning: {
    fontSize: rem(0.9),
    color: '#FF3B30',
    textAlign: 'center',
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  button: {
    flex: 1,
    padding: rem(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: rem(1),
    fontWeight: '600',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: rem(1),
    fontWeight: '600',
  },
});

export default EliminarMisDenuncias;
