import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Platform,
  Dimensions,
  useWindowDimensions,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

// Función para convertir rem a píxeles
const rem = (size: number) => {
  const { width, height } = Dimensions.get('window');
  const scale = Math.min(width, height) / 375;
  return size * 16 * scale;
};

interface Denuncia {
  id: number;
  tipoDenuncia: string;
  imagen: string;
  descripcion: string;
  usuarios_id: number;
  latitud: number;
  longitud: number;
  fecha: string;
  likes: number;
  liked: boolean;
}

export default function InfoDenuncia() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const [direccion, setDireccion] = useState<string>("Cargando ubicación...");
  const [denuncia, setDenuncia] = useState<Denuncia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  // Función para obtener la dirección a partir de coordenadas
  const getAddressFromCoordinates = useCallback(async (latitud: number, longitud: number) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude: latitud,
        longitude: longitud
      });
      
      if (response.length > 0) {
        const location = response[0];
        // Simplificar la dirección
        const street = location.street || 'Calle sin nombre';
        const city = location.city || 'Ciudad sin nombre';
        setDireccion(`${street}, ${city}`);
      } else {
        setDireccion("Ubicación no disponible");
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      setDireccion("Ubicación no disponible");
    }
  }, []);

  const fetchDenuncia = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/traerDenuncia/${id}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      
      // Limitar los datos almacenados a solo lo necesario
      const denunciaData: Denuncia = {
        id: data.id,
        tipoDenuncia: data.tipodenuncia || '',
        descripcion: data.descripcion || '',
        usuarios_id: data.usuarios_id,
        latitud: parseFloat(data.latitud) || 0,
        longitud: parseFloat(data.longitud) || 0,
        fecha: data.fecha_denuncia ? new Date(data.fecha_denuncia).toLocaleDateString() : '',
        likes: parseInt(data.likes) || 0,
        liked: false,
        imagen: `https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/denuncia/imagen/${data.id}`
      };

      // Limpiar cualquier dato innecesario
      setDenuncia(denunciaData);
      
      // Obtener la dirección de forma separada
      if (denunciaData.latitud && denunciaData.longitud) {
        getAddressFromCoordinates(denunciaData.latitud, denunciaData.longitud);
      }
    } catch (error) {
      console.error('Error al obtener la denuncia:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar la denuncia');
    } finally {
      setLoading(false);
    }
  }, [id, getAddressFromCoordinates]);

  useEffect(() => {
    fetchDenuncia();
  }, [fetchDenuncia]);

  // Limpiar datos al desmontar el componente
  useEffect(() => {
    return () => {
      setDenuncia(null);
      setDireccion("Cargando ubicación...");
      setImageLoading(true);
    };
  }, []);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle de Denuncia</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando denuncia...</Text>
        </View>
      </View>
    );
  }

  if (error || !denuncia) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalle de Denuncia</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Denuncia no encontrada'}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={fetchDenuncia}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
        <Text style={styles.headerTitle}>Detalle de Denuncia</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          {imageLoading && (
            <View style={styles.imageLoadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          )}
          <Image 
            source={{ uri: denuncia.imagen }} 
            style={[styles.image, { width: windowWidth }]}
            resizeMode="cover"
            onLoad={handleImageLoad}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.titulo}>{denuncia.tipoDenuncia}</Text>
          
          <View style={styles.estadoContainer}>
            <View style={styles.estadoDot} />
            <Text style={styles.estadoText}>Sin reparar</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            <Text style={styles.ubicacionText}>{direccion}</Text>
            <Text style={styles.coordenadasText}>
              Coordenadas: {denuncia.latitud.toFixed(4)}, {denuncia.longitud.toFixed(4)}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Fecha de Reporte</Text>
            <Text style={styles.fechaText}>{denuncia.fecha}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.comentarioText}>{denuncia.descripcion}</Text>
          </View>

          <View style={styles.likesContainer}>
            <Ionicons 
              name={denuncia.liked ? "checkmark-circle" : "checkmark-circle-outline"} 
              size={24} 
              color={denuncia.liked ? "#007AFF" : "#666"} 
            />
            <Text style={styles.likesText}>{denuncia.likes} personas apoyan esta denuncia</Text>
          </View>
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
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  imageLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  image: {
    height: 300,
  },
  content: {
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  estadoDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF3B30',
    marginRight: 8,
  },
  estadoText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  ubicacionText: {
    fontSize: 16,
    color: '#333',
  },
  fechaText: {
    fontSize: 16,
    color: '#333',
  },
  comentarioText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  likesText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  coordenadasText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
}); 