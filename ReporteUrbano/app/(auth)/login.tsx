import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';
import AuthLink from '../components/AuthLink';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

<<<<<<< HEAD
  const handleLogin = async () => {
=======
  const validateInputs = () => {
>>>>>>> 651472c54b5837bf6d9d4944aa8daf8d6b9e414a
    if (!username || !password) {
      alert('Por favor, completa todos los campos.');
      return false;
    }

    if (username.length < 3) {
      alert('El nombre de usuario debe tener al menos 3 caracteres.');
      return false;
    }

    if (password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      alert('El nombre de usuario solo puede contener letras, números y guiones bajos.');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const response = await fetch('https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        await AsyncStorage.setItem('username', username); // Guarda el username
        alert(data.message || 'Inicio de sesión exitoso');
        console.log('Username antes de navegar:', username);
        router.replace({
          pathname: '/home',
          params: { username }, // Pasar el username como parámetro
        });
      } else {
        alert(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Error al conectar con el servidor');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Bienvenido a</Text>
        <Text style={styles.logoText}>Reporte Urbano</Text>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <AuthInput
          value={username}
          onChangeText={setUsername}
<<<<<<< HEAD
          placeholder="Ingresa tu nombre de usuario" // más fiel al campo username
=======
          placeholder="Nombre de usuario"
>>>>>>> 651472c54b5837bf6d9d4944aa8daf8d6b9e414a
          autoCapitalize="none"
        />

        <AuthInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Contraseña"
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
<<<<<<< HEAD
});
=======
});
>>>>>>> 651472c54b5837bf6d9d4944aa8daf8d6b9e414a
