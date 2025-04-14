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
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NuevaDenunciaModalProps {
  visible: boolean;
  onClose: () => void;
}

export const NuevaDenunciaModal: React.FC<NuevaDenunciaModalProps> = ({ visible, onClose }) => {
  const [hasPhoto, setHasPhoto] = useState(false);
  const [eventType, setEventType] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    if (!visible) {
      setEventType('');
      setComments('');
      setHasPhoto(false);
    }
  }, [visible]);

  const handleAddPhoto = () => {
    // Por ahora solo simulamos que se agregó una foto
    setHasPhoto(true);
    console.log('Agregar foto');
  };

  const handleSubmit = () => {
    // Verificar campos obligatorios
    if (!hasPhoto || !eventType.trim()) {
      let errorMessage = '';
      if (!hasPhoto && !eventType.trim()) {
        errorMessage = 'Debes agregar una foto y seleccionar un tipo de evento';
      } else if (!hasPhoto) {
        errorMessage = 'Debes agregar una foto de la denuncia';
      } else if (!eventType.trim()) {
        errorMessage = 'Debes seleccionar un tipo de evento';
      }

      Alert.alert(
        'Campos incompletos',
        errorMessage,
        [{ text: 'OK' }]
      );
      return;
    }

    // Si todos los campos están completos, mostrar mensaje de éxito
    Alert.alert(
      'Éxito',
      '¡Denuncia enviada con éxito!',
      [
        {
          text: 'OK',
          onPress: () => {
            onClose();
          }
        }
      ]
    );
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
                <Ionicons name={hasPhoto ? "checkmark-circle" : "camera"} size={40} color="#007AFF" />
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