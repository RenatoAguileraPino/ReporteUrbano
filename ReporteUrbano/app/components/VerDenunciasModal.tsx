import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity, 
  Dimensions, 
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VerDenunciasModalProps {
  visible: boolean;
  onClose: () => void;
  onDenunciasCercanas: () => void;
  onMisDenuncias: () => void;
}

export const VerDenunciasModal: React.FC<VerDenunciasModalProps> = ({ 
  visible, 
  onClose, 
  onDenunciasCercanas, 
  onMisDenuncias 
}) => {
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
              <Text style={styles.title}>Ver Denuncias</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.optionsContainer}>
              <TouchableOpacity 
                style={styles.optionButton}
                onPress={onDenunciasCercanas}
                activeOpacity={0.7}
              >
                <Ionicons name="location" size={30} color="#007AFF" />
                <Text style={styles.optionText}>Denuncias Cercanas</Text>
                <Text style={styles.optionDescription}>
                  Ver denuncias reportadas cerca de tu ubicación
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.optionButton}
                onPress={onMisDenuncias}
                activeOpacity={0.7}
              >
                <Ionicons name="person" size={30} color="#007AFF" />
                <Text style={styles.optionText}>Mis Denuncias</Text>
                <Text style={styles.optionDescription}>
                  Ver las denuncias que has reportado
                </Text>
              </TouchableOpacity>
            </View>
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
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 10,
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
}); 