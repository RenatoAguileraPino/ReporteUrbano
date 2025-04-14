import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

interface BottomButtonsProps {
  onHacerDenuncia: () => void;
  onVerDenuncias: () => void;
}

export const BottomButtons: React.FC<BottomButtonsProps> = ({
  onHacerDenuncia,
  onVerDenuncias,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, styles.leftButton]}
        onPress={onHacerDenuncia}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Hacer Denuncia</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity 
        style={[styles.button, styles.rightButton]}
        onPress={onVerDenuncias}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Ver Denuncias</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#007AFF',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  leftButton: {
    borderRightWidth: 1,
    borderRightColor: '#007AFF',
  },
  rightButton: {
    borderLeftWidth: 1,
    borderLeftColor: '#007AFF',
  },
  separator: {
    width: 1,
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
}); 