import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, Platform, StatusBar } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';


interface Denuncia {
  id: number;
  tipoDenuncia: string;
  descripcion: string;
  usuarios_id: number;
  latitud: number;
  longitud: number;
  fecha: string;
  likes: number;
  liked: boolean;
  imagen: string;
  locationName?: string;
}

interface DenunciasMapaProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

interface DenunciasMapaRef {
  animateToRegion: (region: any) => void;
}

const DenunciasMapa = forwardRef<DenunciasMapaRef, DenunciasMapaProps>(({ initialRegion }, ref) => {
  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDenuncia, setSelectedDenuncia] = useState<Denuncia | null>(null);
  const [locationName, setLocationName] = useState('');
  const mapRef = useRef<MapView>(null);
  const router = useRouter();

  useImperativeHandle(ref, () => ({
    animateToRegion: (region) => {
      if (mapRef.current) {
        mapRef.current.animateToRegion(region, 1000);
      }
    }
  }));

  const cargarDenuncias = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/traerDenunciasCercanas?lat=${initialRegion.latitude}&lon=${initialRegion.longitude}&distancia=1000`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      if (Array.isArray(data)) {
        const denunciasFormateadas = data.map((denuncia: any) => ({
          id: denuncia.id,
          tipoDenuncia: denuncia.tipodenuncia || '',
          descripcion: denuncia.descripcion || '',
          usuarios_id: denuncia.usuarios_id,
          latitud: parseFloat(denuncia.latitud) || 0,
          longitud: parseFloat(denuncia.longitud) || 0,
          fecha: denuncia.fecha_denuncia ? new Date(denuncia.fecha_denuncia).toLocaleDateString() : '',
          likes: parseInt(denuncia.likes) || 0,
          liked: false,
          imagen: `https://reporte-urbano-backend-8b4c660c5c74.herokuapp.com/denuncia/imagen/${denuncia.id}`,
          locationName: denuncia.locationName || ''
        }));
        console.log('Denuncias formateadas:', denunciasFormateadas);
        setDenuncias(denunciasFormateadas);
      } else {
        console.error('Formato de datos inválido:', data);
        setDenuncias([]);
      }
    } catch (error) {
      console.error('Error al cargar denuncias:', error);
      setDenuncias([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDenuncias();
    
    // Ocultar la barra de estado y navegación
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor('transparent');
    }
    StatusBar.setBarStyle('dark-content');

    // Restaurar la visibilidad cuando el componente se desmonte
    return () => {
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor('#ffffff');
      }
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  const getLocationName = async (latitude: number, longitude: number) => {
    try {
      const [address] = await Location.reverseGeocodeAsync({
        latitude,
        longitude
      });
      
      if (address) {
        const locationParts = [
          address.street,
          address.city,
          address.region
        ].filter(Boolean);
        
        return locationParts.join(', ');
      }
      return '';
    } catch (error) {
      console.error('Error al obtener el nombre de la ubicación:', error);
      return '';
    }
  };

  const handleMarkerPress = async (denuncia: Denuncia) => {
    const locationName = await getLocationName(denuncia.latitud, denuncia.longitud);
    setSelectedDenuncia({ ...denuncia, locationName });
  };

  const handleVerDetalles = (id: number) => {
    router.push({
      pathname: "/infodenuncias",
      params: { id }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Cargando denuncias...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={cargarDenuncias}>
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {denuncias.map((denuncia) => (
          <Marker
            key={denuncia.id}
            coordinate={{
              latitude: denuncia.latitud,
              longitude: denuncia.longitud
            }}
            onPress={() => handleMarkerPress(denuncia)}
          />
        ))}
      </MapView>

      {/* Botón de recarga */}
      <TouchableOpacity 
        style={styles.reloadButton}
        onPress={cargarDenuncias}
      >
        <MaterialIcons name="refresh" size={24} color="white" />
      </TouchableOpacity>

      {selectedDenuncia && (
        <View style={styles.cardContainer}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.titleContainer}>
                <Text style={styles.cardTitle}>
                  {selectedDenuncia.tipoDenuncia}
                </Text>
                <Text style={styles.cardDate}>
                  {selectedDenuncia.fecha}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setSelectedDenuncia(null)}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedDenuncia.imagen && (
              <Image 
                source={{ uri: selectedDenuncia.imagen }} 
                style={styles.cardImage}
                resizeMode="cover"
              />
            )}

            <View style={styles.infoSection}>
              <Text style={styles.cardDescription}>
                {selectedDenuncia.descripcion}
              </Text>
              <View style={styles.locationContainer}>
                <MaterialIcons name="location-on" size={16} color="#666" />
                <Text style={styles.locationText}>
                  {selectedDenuncia.locationName || `${selectedDenuncia.latitud.toFixed(6)}, ${selectedDenuncia.longitud.toFixed(6)}`}
                </Text>
              </View>
            </View>

            <View style={styles.footer}>
              <View style={styles.likesContainer}>
                <Ionicons 
                  name={selectedDenuncia.liked ? "checkmark-circle" : "checkmark-circle-outline"} 
                  size={24} 
                  color={selectedDenuncia.liked ? "#007AFF" : "#666"} 
                />
                <Text style={styles.likesText}>{selectedDenuncia.likes}</Text>
              </View>
              <TouchableOpacity 
                style={styles.verDetallesButton}
                onPress={() => handleVerDetalles(selectedDenuncia.id)}
              >
                <Text style={styles.verDetallesText}>Ver detalles</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  cardContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 80,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#666',
  },
  closeButton: {
    padding: 4,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoSection: {
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  verDetallesButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  verDetallesText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reloadButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 110,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default DenunciasMapa;
