import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

interface AuthInputProps extends TextInputProps {
  placeholder: string;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  placeholder,
  ...props
}) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#999"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
}); 