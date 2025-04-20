import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthLink from '../components/AuthLink';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // Aquí irá la lógica de registro
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Registro</Text>

        <AuthInput
          value={email}
          onChangeText={setEmail}
          placeholder="Ingresa tu correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AuthInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Ingresa tu contraseña"
        />

        <AuthInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirma tu contraseña"
        />

        <AuthButton
          title="Registrarse"
          onPress={handleRegister}
        />

        <AuthLink
          text="¿Ya tienes una cuenta?"
          linkText="Inicia sesión"
          href="../login"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
}); 