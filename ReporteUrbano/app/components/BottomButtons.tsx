import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomButtonsProps {
  onHacerDenuncia: () => void;
  onVerDenuncias: () => void;
}

const BottomButtons: React.FC<BottomButtonsProps> = ({
  onHacerDenuncia,
  onVerDenuncias,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.denunciaButton]}
        onPress={onHacerDenuncia}
      >
        <Ionicons name="add-circle-outline" size={24} color="#fff" />
        <Text style={styles.denunciaText}>Hacer Denuncia</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.verDenunciasButton]}
        onPress={onVerDenuncias}
      >
        <Ionicons name="list-outline" size={24} color="#fff" />
        <Text style={styles.denunciaText}>Ver Denuncias</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 20, // Aumentamos este valor para subir los botones
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    width: '45%',
    backgroundColor: '#007AFF', // Cambiamos a fondo azul
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  denunciaButton: {
    borderWidth: 0, // Removemos el borde
  },
  verDenunciasButton: {
    borderWidth: 0, // Removemos el borde
  },
  denunciaText: {
    color: '#fff', // Cambiamos a texto blanco
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default BottomButtons;