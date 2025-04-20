import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';

interface DenunciasDropdownProps {
  onClose: () => void;
  onDenunciasCercanas: () => void;
  onMisDenuncias: () => void;
}

const DenunciasDropdown: React.FC<DenunciasDropdownProps> = ({
  onClose,
  onDenunciasCercanas,
  onMisDenuncias,
}) => {
  return (
    <Pressable 
      style={styles.overlay}
      onPress={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.option}
          onPress={onDenunciasCercanas}
        >
          <Text style={styles.text}>Denuncias Cercanas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.option}
          onPress={onMisDenuncias}
        >
          <Text style={styles.text}>Mis Denuncias</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    //backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default DenunciasDropdown; 