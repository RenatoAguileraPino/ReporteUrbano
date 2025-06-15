import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, SafeAreaView, TouchableOpacity, Text, Animated } from 'react-native';
import * as Location from 'expo-location';
import LocationBar from './components/LocationBar';
import BottomButtons from './components/BottomButtons';
import NuevaDenunciaModal from './components/NuevaDenunciaModal';
import VerDenunciasModal from './components/VerDenunciasModal';
import DenunciasCercanas from './components/DenunciasCercanas';
import MisDenuncias from './components/MisDenuncias';
import DenunciasMapa from './components/DenunciasMapa';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Home() {
  const [showDenunciaModal, setShowDenunciaModal] = useState(false);
  const [showDenunciasModal, setShowDenunciasModal] = useState(false);
  const [showDenunciasCercanasModal, setShowDenunciasCercanasModal] = useState(false);
  const [showMisDenunciasModal, setShowMisDenunciasModal] = useState(false);
  const [locationName, setLocationName] = useState("Obteniendo ubicación...");
  const [userLocation, setUserLocation] = useState({
    latitude: -33.497529,
    longitude: -70.686348,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [username, setUsername] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const welcomeOpacity = useRef(new Animated.Value(1)).current;
  const mapRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const updateLocationName = async (latitude: number, longitude: number) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocode && geocode.length > 0) {
        const address = geocode[0];
        const city = address.city || "";
        const district = address.subregion || address.district || "";
        
        let locationText = "";
        if (city && district) {
          locationText = `${city}, ${district}`;
        } else if (city) {
          locationText = city;
        } else if (district) {
          locationText = district;
        } else {
          locationText = "Ubicación desconocida";
        }
        
        setLocationName(locationText);
      }
    } catch (error) {
      console.error('Error al obtener el nombre de la ubicación:', error);
      setLocationName("Error al obtener ubicación");
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permiso de ubicación denegado');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        
        setUserLocation(newRegion);
        
        // Centrar el mapa en la ubicación del usuario
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }

        await updateLocationName(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error('Error al obtener la ubicación:', error);
        setError('Error al obtener la ubicación');
      }
    })();
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      setUsername(storedUsername);
      if (storedUsername) {
        setShowWelcome(true);
        // Iniciar la animación desde abajo
        welcomeOpacity.setValue(0);
        Animated.timing(welcomeOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          // Después de mostrar, esperar y desvanecer
          setTimeout(() => {
            Animated.timing(welcomeOpacity, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start(() => {
              setShowWelcome(false);
            });
          }, 2000);
        });
      }
    };
    fetchUsername();
  }, []);

  const handleDenunciasCercanas = () => {
    setShowDenunciasModal(false);
    setShowDenunciasCercanasModal(true);
  };

  const handleMisDenuncias = () => {
    setShowDenunciasModal(false);
    setShowMisDenunciasModal(true);
  };

  const handleHacerDenuncia = () => {
    console.log('Abriendo modal de denuncia');
    setShowDenunciaModal(true);
  };

  const centerMapOnUser = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.animateToRegion(userLocation, 1000);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('username');
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Error al cerrar sesión');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <DenunciasMapa 
            ref={mapRef}
            initialRegion={userLocation}
          />
        </View>
        
        {/* Coloca el botón de logout antes de locationBarContainer */}
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>

        <View style={styles.locationBarContainer}>
          <LocationBar location={locationName} />
        </View>

        <TouchableOpacity 
          style={styles.myLocationButton}
          onPress={centerMapOnUser}
        >
          <MaterialIcons name="my-location" size={24} color="#007AFF" />
        </TouchableOpacity>

        {showWelcome && (
          <Animated.View style={[styles.welcomeAlert, { opacity: welcomeOpacity }]}>
            <Text style={styles.welcomeText}>¡Bienvenido, {username}!</Text>
          </Animated.View>
        )}

        <View style={styles.bottomContainer}>
          <BottomButtons
            onHacerDenuncia={handleHacerDenuncia}
            onVerDenuncias={() => setShowDenunciasModal(true)}
          />
        </View>

        <NuevaDenunciaModal
          visible={showDenunciaModal}
          onClose={() => setShowDenunciaModal(false)}
          username={username || ''}
        />

        <VerDenunciasModal
          visible={showDenunciasModal}
          onClose={() => setShowDenunciasModal(false)}
          onDenunciasCercanas={handleDenunciasCercanas}
          onMisDenuncias={handleMisDenuncias}
        />

        <DenunciasCercanas
          visible={showDenunciasCercanasModal}
          onClose={() => {
            setShowDenunciasCercanasModal(false);
            setShowDenunciasModal(true);
          }}
        />

        <MisDenuncias
          visible={showMisDenunciasModal}
          onBack={() => {
            setShowMisDenunciasModal(false);
            setShowDenunciasModal(true);
          }}
          title="Mis Denuncias"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  locationBarContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    borderRadius: 25,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  myLocationButton: {
    position: 'absolute',
    right: 20,
    top: Platform.OS === 'ios' ? 120 : 100,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  topContainer: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  welcomeAlert: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    zIndex: 1000,
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  logoutButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 110 : 95, // Aumentamos los valores de 50 y 30 a 80 y 60
    zIndex: 2000,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});