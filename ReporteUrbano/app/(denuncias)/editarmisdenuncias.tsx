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
  Image
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// Datos de ejemplo según la estructura de la BD
const misDenunciasEjemplo = [
  {
    id: 1,
    tipoDenuncia: "Bache en calle principal",
    imagen: require('../../assets/images/icon.png'),
    descripcion: "El bache tiene aproximadamente 30cm de profundidad y está causando problemas a los vehículos que pasan por la zona. Se necesita atención urgente.",
    usuarios_id: 1,
    latitud: -33.4489,
    longitud: -70.6693,
    fecha: "15/03/2024",
    likes: 15
  },
  {
    id: 2,
    tipoDenuncia: "Poste de alumbrado caído",
    imagen: require('../../assets/images/icon.png'),
    descripcion: "El poste está completamente caído y representa un peligro para los peatones. Los cables están expuestos.",
    usuarios_id: 1,
    latitud: -33.4187,
    longitud: -70.6062,
    fecha: "14/03/2024",
    likes: 8
  }
];

export default function EditarMisDenuncias() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [denuncia, setDenuncia] = useState(misDenunciasEjemplo.find(d => d.id === Number(id)));
  const [tipoDenuncia, setTipoDenuncia] = useState(denuncia?.tipoDenuncia || '');
  const [descripcion, setDescripcion] = useState(denuncia?.descripcion || '');
  const [imagen, setImagen] = useState(denuncia?.imagen);

  useEffect(() => {
    if (!denuncia) {
      Alert.alert('Error', 'Denuncia no encontrada');
      router.back();
    }
  }, [denuncia]);

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

  const handleGuardar = () => {
    if (!tipoDenuncia.trim()) {
      Alert.alert('Error', 'El tipo de denuncia es requerido');
      return;
    }

    // Aquí iría la lógica para guardar los cambios
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
  };

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
              source={typeof imagen === 'string' ? { uri: imagen } : imagen} 
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
            />
          </View>

          <TouchableOpacity 
            style={styles.guardarButton}
            onPress={handleGuardar}
          >
            <Text style={styles.guardarButtonText}>Guardar Cambios</Text>
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
}); 