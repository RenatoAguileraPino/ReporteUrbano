import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AuthInput } from '../components/AuthInput';
import { AuthButton } from '../components/AuthButton';
import AuthLink from '../components/AuthLink';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Aquí irá la lógica de autenticación
    console.log('Login attempt with:', { email, password });
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Bienvenido a</Text>
        <Text style={styles.logoText}>Reporte Urbano</Text>
        <Text style={styles.title}>Iniciar Sesión</Text>

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

        <AuthButton
          title="Iniciar Sesión"
          onPress={handleLogin}
        />

        <AuthLink
          text="¿No tienes una cuenta?"
          linkText="Regístrate"
          href="../register"
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 30,
  },
}); 