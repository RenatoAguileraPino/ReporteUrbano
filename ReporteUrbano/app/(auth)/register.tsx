import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthLink from '../components/AuthLink';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !password) {
      alert('Por favor, completa todos los campos');
      return;
    } 

    try {
      const response = await fetch('https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Registro exitoso');
        router.replace('/home');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Hubo un problema al registrarse. Intenta de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Registro</Text>

        <AuthInput
          value={username}
          onChangeText={setUsername}
          placeholder="Nombre de usuario"
          autoCapitalize="none"
        />

        <AuthInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Contraseña"
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
