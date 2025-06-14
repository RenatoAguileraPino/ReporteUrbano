import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableOpacity,
  Platform,
  ScrollView,
  Dimensions,
  useWindowDimensions,
  Image,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

// Función para convertir rem a píxeles
const rem = (size: number) => {
  const { width, height } = Dimensions.get('window');
  const scale = Math.min(width, height) / 375; // 375 es el ancho base de diseño
  return size * 16 * scale; // 16 es el tamaño base de fuente
};

interface DenunciasCercanasProps {
  visible: boolean;
  onClose: () => void;
}

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

const DenunciasCercanas: React.FC<DenunciasCercanasProps> = ({ 
  visible, 
  onClose
}) => {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [direcciones, setDirecciones] = useState<{[key: number]: string}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const router = useRouter();

  // Función para obtener la ubicación actual
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permiso de ubicación denegado');
        return null;
      }

      let location = await Location.getCurrentPositionAsync({});
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      setError('Error al obtener ubicación');
      return null;
    }
  };

  // Función para obtener denuncias cercanas
  const fetchDenunciasCercanas = async () => {
    try {
      setLoading(true);
      setError(null);
      const location = await getCurrentLocation();
      
      if (!location) {
        setError('No se pudo obtener la ubicación');
        return;
      }

      console.log('Obteniendo denuncias cercanas con coordenadas:', location);

      const response = await fetch(
        `https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/traerDenunciasCercanas?lat=${location.latitude}&lon=${location.longitude}&distancia=5`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Respuesta del servidor:', response.status);

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      console.log('Datos recibidos:', data);

      if (!Array.isArray(data)) {
        throw new Error('Formato de datos inválido');
      }

      setDenuncias(data.map((denuncia: any) => ({
        id: denuncia.id,
        tipoDenuncia: denuncia.tipodenuncia,
        descripcion: denuncia.descripcion,
        usuarios_id: denuncia.usuarios_id,
        latitud: parseFloat(denuncia.latitud),
        longitud: parseFloat(denuncia.longitud),
        fecha: new Date(denuncia.fecha_denuncia).toLocaleDateString(),
        likes: denuncia.likes || 0,
        liked: false,
        imagen: `https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/denuncia/imagen/${denuncia.id}`
      })));
    } catch (error) {
      console.error('Error detallado al obtener denuncias:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar las denuncias');
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener la dirección a partir de coordenadas
  const getAddressFromCoordinates = async (latitud: number, longitud: number, id: number) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude: latitud,
        longitude: longitud
      });
      
      if (response.length > 0) {
        const location = response[0];
        const direccion = `${location.street || 'Calle sin nombre'}, ${location.city || 'Ciudad sin nombre'}`;
        setDirecciones(prev => ({
          ...prev,
          [id]: direccion
        }));
      } else {
        setDirecciones(prev => ({
          ...prev,
          [id]: "Ubicación no disponible"
        }));
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      setDirecciones(prev => ({
        ...prev,
        [id]: "Ubicación no disponible"
      }));
    }
  };

  // Cargar denuncias y direcciones cuando se monta el componente
  useEffect(() => {
    if (visible) {
      fetchDenunciasCercanas();
    }
  }, [visible]);

  // Cargar direcciones cuando se actualizan las denuncias
  useEffect(() => {
    denuncias.forEach(denuncia => {
      getAddressFromCoordinates(denuncia.latitud, denuncia.longitud, denuncia.id);
    });
  }, [denuncias]);

  const handleLike = (id: number, event: any) => {
    event.stopPropagation();
    setDenuncias(denuncias.map(denuncia => 
      denuncia.id === id 
        ? { 
            ...denuncia, 
            likes: denuncia.liked ? denuncia.likes - 1 : denuncia.likes + 1,
            liked: !denuncia.liked 
          }
        : denuncia
    ));
  };

  const handleDenunciaPress = (id: number) => {
    router.push(`/(denuncias)/infodenuncias?id=${id}`);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { height: windowHeight * 0.8 }]}>
          <View style={[styles.modalContent, { paddingHorizontal: rem(0.5) }]}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <Ionicons name="arrow-back" size={rem(1.5)} color="#007AFF" />
              </TouchableOpacity>
              <Text style={styles.title}>Denuncias Cercanas</Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Cargando denuncias...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity 
                  style={styles.retryButton}
                  onPress={fetchDenunciasCercanas}
                >
                  <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView 
                style={styles.denunciasList}
                contentContainerStyle={styles.denunciasListContent}
              >
                {denuncias.map((denuncia) => (
                  <TouchableOpacity 
                    key={denuncia.id}
                    onPress={() => handleDenunciaPress(denuncia.id)}
                    style={[
                      styles.denunciaCard,
                      { 
                        maxWidth: windowWidth - rem(1),
                        marginHorizontal: rem(0.25)
                      }
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.denunciaContent}>
                      <View style={styles.denunciaInfo}>
                        <Text 
                          style={[styles.denunciaTitulo, { fontSize: rem(1.1) }]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {denuncia.tipoDenuncia}
                        </Text>
                        <View style={styles.estadoContainer}>
                          <View style={[styles.estadoDot, { width: rem(0.5), height: rem(0.5) }]} />
                          <Text style={[styles.estadoText, { fontSize: rem(0.9) }]}>
                            Sin reparar
                          </Text>
                        </View>
                        <Text 
                          style={[styles.ubicacionText, { fontSize: rem(0.9) }]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {direcciones[denuncia.id] || "Cargando ubicación..."}
                        </Text>
                        <Text 
                          style={[styles.fechaText, { fontSize: rem(0.8) }]}
                        >
                          {denuncia.fecha}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        style={styles.likeContainer}
                        onPress={(event) => handleLike(denuncia.id, event)}
                      >
                        <Ionicons 
                          name={denuncia.liked ? "checkmark-circle" : "checkmark-circle-outline"} 
                          size={rem(1.3)}
                          color={denuncia.liked ? "#007AFF" : "#666"}
                        />
                        <Text style={[styles.likeCount, { fontSize: rem(0.9) }]}>
                          {denuncia.likes}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: rem(1.25),
    borderTopRightRadius: rem(1.25),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: rem(0.25),
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalContent: {
    flex: 1,
    paddingVertical: rem(1),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rem(1),
    paddingTop: Platform.OS === 'ios' ? rem(0.5) : 0,
  },
  backButton: {
    padding: rem(0.5),
    zIndex: 1,
  },
  title: {
    fontSize: rem(1.2),
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: rem(2),
  },
  denunciasList: {
    flex: 1,
  },
  denunciasListContent: {
    paddingVertical: rem(0.25),
  },
  denunciaCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: rem(0.75),
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: rem(0.5),
    padding: rem(0.75),
    minHeight: rem(5),
  },
  denunciaContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  denunciaInfo: {
    flex: 1,
    marginRight: rem(1),
    justifyContent: 'center',
  },
  denunciaTitulo: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: rem(0.5),
  },
  estadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: rem(0.5),
  },
  estadoDot: {
    backgroundColor: '#FF3B30',
    borderRadius: rem(0.25),
    marginRight: rem(0.5),
  },
  estadoText: {
    color: '#FF3B30',
    fontWeight: '500',
  },
  ubicacionText: {
    color: '#666',
  },
  likeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: rem(3),
    paddingLeft: rem(0.5),
  },
  likeButton: {
    padding: rem(0.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeCount: {
    color: '#666',
    marginTop: rem(0.25),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: rem(1),
    fontSize: rem(1),
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: rem(1),
  },
  errorText: {
    fontSize: rem(1),
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: rem(1),
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: rem(1),
    paddingVertical: rem(0.5),
    borderRadius: rem(0.5),
  },
  retryButtonText: {
    color: 'white',
    fontSize: rem(0.9),
    fontWeight: '500',
  },
  fechaText: {
    color: '#666',
    marginTop: rem(0.25),
  },
});

export default DenunciasCercanas; 