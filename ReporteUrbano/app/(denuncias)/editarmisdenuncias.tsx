import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Denuncia {
  id: string;
  tipoDenuncia: string;
  imagen: string;
  descripcion: string;
  usuarios_id: string;
  latitud: number;
  longitud: number;
  fecha: string;
  likes: number;
}

export default function EditarMisDenuncias() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [denuncia, setDenuncia] = useState<Denuncia | null>(null);
  const [tipoDenuncia, setTipoDenuncia] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    cargarDenuncia();
  }, [id]);

  const cargarDenuncia = async () => {
    try {
      // Obtener el username del usuario actual
      const username = await AsyncStorage.getItem('username');
      console.log('Username obtenido de AsyncStorage:', username);

      if (!username) {
        Alert.alert('Error', 'No se encontró el usuario');
        router.back();
        return;
      }

      // Obtener el ID del usuario basado en el username
      const userResponse = await fetch('https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/run-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: `SELECT id FROM usuarios WHERE nombre = '${username}'`
        })
      });

      const userData = await userResponse.json();
      console.log('Respuesta de usuario completa:', JSON.stringify(userData, null, 2));

      if (!userData.result || userData.result.rows.length === 0) {
        Alert.alert('Error', 'No se encontró el ID del usuario');
        router.back();
        return;
      }

      const userId = userData.result.rows[0].id;
      console.log('ID del usuario:', userId);

      // Verificar la estructura de la tabla denuncia
      const tableInfoResponse = await fetch('https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/run-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: `SELECT column_name, data_type, character_maximum_length 
                FROM information_schema.columns 
                WHERE table_name = 'denuncia'`
        })
      });

      const tableInfo = await tableInfoResponse.json();
      console.log('Estructura de la tabla denuncia:', JSON.stringify(tableInfo, null, 2));

      // Verificar los datos de la denuncia específica
      const denunciaInfoResponse = await fetch('https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/run-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: `SELECT id, usuarios_id, tipodenuncia, descripcion 
                FROM denuncia 
                WHERE id = '${id}'`
        })
      });

      const denunciaInfo = await denunciaInfoResponse.json();
      console.log('Datos de la denuncia desde SQL:', JSON.stringify(denunciaInfo, null, 2));

      const response = await fetch(`https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/traerDenuncia/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar la denuncia');
      }

      // Verificar si el usuario tiene permiso para editar esta denuncia
      console.log('Comparando IDs:', {
        denunciaUserId: data.usuarios_id,
        usuarioActualId: userId,
        sonIguales: data.usuarios_id === userId,
        denunciaUserIdTipo: typeof data.usuarios_id,
        usuarioActualIdTipo: typeof userId
      });

      // Convertir ambos IDs a número para la comparación
      const denunciaUserId = parseInt(data.usuarios_id);
      const usuarioActualId = parseInt(userId);

      console.log('IDs convertidos a número:', {
        denunciaUserId,
        usuarioActualId,
        sonIguales: denunciaUserId === usuarioActualId
      });

      if (denunciaUserId !== usuarioActualId) {
        console.log('IDs no coinciden:', {
          denunciaUserId,
          usuarioActualId
        });
        Alert.alert('Error', 'No tienes permiso para editar esta denuncia');
        router.back();
        return;
      }

      // Solo guardamos los datos necesarios
      const denunciaData = {
        id: data.id,
        tipoDenuncia: data.tipodenuncia || 'Sin tipo especificado',
        descripcion: data.descripcion || 'Sin descripción',
        latitud: parseFloat(data.latitud) || 0,
        longitud: parseFloat(data.longitud) || 0,
        fecha: data.fecha || new Date().toLocaleDateString(),
        likes: parseInt(data.likes) || 0,
        usuarios_id: String(data.usuarios_id), // Asegurar que es string
        imagen: `https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/denuncia/imagen/${data.id}`
      };

      console.log('Datos de denuncia procesados:', JSON.stringify(denunciaData, null, 2));

      setDenuncia(denunciaData);
      setTipoDenuncia(denunciaData.tipoDenuncia);
      setDescripcion(denunciaData.descripcion);
      setImagen(denunciaData.imagen);
    } catch (error: any) {
      console.error('Error completo:', error);
      Alert.alert('Error', error?.message || 'Error al cargar la denuncia');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Error', 'Se necesitan permisos para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleGuardar = async () => {
    if (!tipoDenuncia.trim()) {
      Alert.alert('Error', 'El tipo de denuncia es requerido');
      return;
    }

    if (!denuncia) {
      Alert.alert('Error', 'No se encontró la denuncia');
      return;
    }

    setSaving(true);
    try {
      // Obtener el username del usuario actual
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        throw new Error('No se encontró el usuario');
      }

      // Obtener el ID del usuario basado en el username
      const userResponse = await fetch('https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/run-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: `SELECT id::integer as id FROM usuarios WHERE nombre = '${username}'`
        })
      });

      const userData = await userResponse.json();
      if (!userData.result || userData.result.rows.length === 0) {
        throw new Error('No se encontró el ID del usuario');
      }

      const userId = userData.result.rows[0].id;
      console.log('ID del usuario actual:', userId);

      const formData = new FormData();
      formData.append('tipoDenuncia', tipoDenuncia);
      formData.append('descripcion', descripcion || '');
      formData.append('usuarios_id', String(userId));

      if (typeof imagen === 'string' && imagen.startsWith('file://')) {
        const imageUri = imagen;
        const imageName = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(imageName);
        const imageType = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('imagen', {
          uri: imageUri,
          name: imageName,
          type: imageType,
        } as any);
      }

      console.log('Enviando datos:', {
        tipoDenuncia,
        descripcion,
        usuarios_id: String(userId),
        id: id
      });

      const response = await fetch(`https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/actualizarDenuncia/${id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar la denuncia');
      }

      Alert.alert(
        'Éxito',
        'Denuncia actualizada correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      console.error('Error completo:', error);
      Alert.alert('Error', error?.message || 'Error al actualizar la denuncia');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!denuncia) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar Denuncia</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.imageContainer} 
            onPress={handleSeleccionarImagen}
          >
            <Image 
              source={{ uri: imagen || undefined }} 
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay}>
              <Ionicons name="camera" size={32} color="#fff" />
              <Text style={styles.imageText}>Cambiar imagen</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tipo de Denuncia</Text>
            <TextInput
              style={styles.input}
              value={tipoDenuncia}
              onChangeText={setTipoDenuncia}
              placeholder="Ej: Bache, Poste caído, etc."
              defaultValue={denuncia?.tipoDenuncia}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Describe el problema en detalle"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              defaultValue={denuncia?.descripcion}
            />
          </View>

          <TouchableOpacity 
            style={[styles.guardarButton, saving && styles.guardarButtonDisabled]}
            onPress={handleGuardar}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.guardarButtonText}>Guardar Cambios</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  guardarButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  guardarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  guardarButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
}); 