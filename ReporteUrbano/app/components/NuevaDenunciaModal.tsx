import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface NuevaDenunciaModalProps {
  visible: boolean;
  onClose: () => void;
  username: string; // Se pasa el nombre del usuario como prop
}

const NuevaDenunciaModal: React.FC<NuevaDenunciaModalProps> = ({ visible, onClose, username }) => {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [eventType, setEventType] = useState('');
  const [comments, setComments] = useState('');
  const [photo, setPhoto] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (!visible) {
      setEventType('');
      setComments('');
      setHasPhoto(false);
      setPhoto(null);
    } else {
      // Obtener la ubicación del usuario al abrir el modal
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación para continuar.');
          return;
        }

        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        });
      })();
    }
  }, [visible]);

  const handleAddPhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhoto(result.assets[0]); // Guarda el objeto completo
      setHasPhoto(true);
    }
  };

  const handleSubmit = async () => {
    if (!hasPhoto || !eventType.trim() || !location) {
      let errorMessage = '';
      if (!hasPhoto && !eventType.trim()) {
        errorMessage = 'Debes agregar una foto y seleccionar un tipo de evento';
      } else if (!hasPhoto) {
        errorMessage = 'Debes agregar una foto de la denuncia';
      } else if (!eventType.trim()) {
        errorMessage = 'Debes seleccionar un tipo de evento';
      } else if (!location) {
        errorMessage = 'No se pudo obtener la ubicación del usuario';
      }

      Alert.alert('Campos incompletos', errorMessage, [{ text: 'OK' }]);
      return;
    }

    const formData = new FormData();

    formData.append('username', username);
    formData.append('tipoDenuncia', eventType);
    formData.append('descripcion', comments || '');
    formData.append('latitud', location.latitude.toString());
    formData.append('longitud', location.longitude.toString());



    if (photo) {
      const mimeType = photo.uri.endsWith('.png') ? 'image/png' : 'image/jpeg';
      formData.append('imagen', {
        uri: photo.uri,
        name: 'denuncia' + (mimeType === 'image/png' ? '.png' : '.jpg'),
        type: mimeType,
      } as any);
    }

    try {
      const response = await fetch('https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/hacerDenuncia', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('Éxito', '¡Denuncia enviada con éxito!', [
          {
            text: 'OK',
            onPress: () => {
              onClose();
            },
          },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Hubo un problema al enviar la denuncia.');
      }
    } catch (error) {
      console.error('Error al enviar la denuncia:', error);
      Alert.alert('Error', 'No se pudo conectar con el servidor.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Nueva Denuncia</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.form}
              contentContainerStyle={styles.formContent}
              showsVerticalScrollIndicator={false}
            >
              <TouchableOpacity
                style={[styles.photoButton, hasPhoto && styles.photoButtonActive]}
                onPress={handleAddPhoto}
              >
                <Ionicons name={hasPhoto ? 'checkmark-circle' : 'camera'} size={40} color="#007AFF" />
                <Text style={styles.photoText}>
                  {hasPhoto ? 'Foto agregada' : 'Agregar Foto *'}
                </Text>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Tipo de Evento *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Buscar tipo de evento..."
                  value={eventType}
                  onChangeText={setEventType}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Comentarios (Opcional)</Text>
                <TextInput
                  style={[styles.input, styles.commentsInput]}
                  placeholder="Agrega detalles adicionales..."
                  value={comments}
                  onChangeText={setComments}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.7}
              >
                <Text style={styles.submitButtonText}>Enviar Denuncia</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
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
  modalContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    maxHeight: height * 0.6,
  },
  formContent: {
    paddingBottom: 20,
  },
  photoButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
    borderRadius: 10,
    marginBottom: 20,
  },
  photoButtonActive: {
    borderStyle: 'solid',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  photoText: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  commentsInput: {
    height: 100,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NuevaDenunciaModal;