import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EliminarMisDenunciasProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
  id: number;
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
  titulo,
  id
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      console.log('Iniciando proceso de eliminación...');
      
      const username = await AsyncStorage.getItem('username');
      console.log('Username obtenido:', username);
      
      if (!username) {
        Alert.alert('Error', 'No se pudo obtener la información del usuario');
        return;
      }

      // Obtener el ID del usuario
      console.log('Obteniendo ID del usuario...');
      const userResponse = await fetch('https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/run-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: `SELECT id FROM usuarios WHERE nombre = '${username}'`
        })
      });

      const userData = await userResponse.json();
      console.log('Respuesta de usuario:', JSON.stringify(userData, null, 2));
      
      if (!userData.result || userData.result.rows.length === 0) {
        Alert.alert('Error', 'No se encontró el ID del usuario');
        return;
      }

      const usuarios_id = userData.result.rows[0].id;
      console.log('ID del usuario:', usuarios_id);
      console.log('ID de la denuncia a eliminar:', id);

      // Llamar al endpoint de eliminación
      console.log('Enviando solicitud de eliminación...');
      const deleteUrl = `https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/eliminarDenuncia/${id}`;
      console.log('URL de eliminación:', deleteUrl);
      
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          usuarios_id: parseInt(usuarios_id)
        })
      });

      console.log('Estado de la respuesta:', response.status);
      console.log('Headers de la respuesta:', JSON.stringify(response.headers, null, 2));
      
      const data = await response.json();
      console.log('Datos de respuesta:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar la denuncia');
      }

      console.log('Eliminación exitosa, actualizando UI...');
      await onConfirm(); // Esperar a que se complete la actualización
      onClose(); // Cerrar el modal
      Alert.alert('Éxito', 'Denuncia eliminada correctamente');
    } catch (error) {
      console.error('Error completo al eliminar la denuncia:', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
      Alert.alert(
        'Error', 
        error instanceof Error 
          ? `Error al eliminar la denuncia: ${error.message}`
          : 'Error al eliminar la denuncia'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCancel}
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
              onPress={handleCancel}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button, 
                styles.deleteButton,
                loading && styles.disabledButton
              ]}
              onPress={handleDelete}
              disabled={loading}
            >
              <Text style={styles.deleteButtonText}>
                {loading ? 'Eliminando...' : 'Eliminar'}
              </Text>
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
  disabledButton: {
    opacity: 0.5,
  },
});

export default EliminarMisDenuncias;
