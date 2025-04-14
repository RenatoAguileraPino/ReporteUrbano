import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, variant === 'secondary' && styles.secondaryButton]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, variant === 'secondary' && styles.secondaryButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
});

export default AuthButton; 