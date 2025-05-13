import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform, SafeAreaView, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import LocationBar from './components/LocationBar';
import BottomButtons from './components/BottomButtons';
import NuevaDenunciaModal from './components/NuevaDenunciaModal';
import VerDenunciasModal from './components/VerDenunciasModal';
import DenunciasCercanas from './components/DenunciasCercanas';
import MisDenuncias from './components/MisDenuncias';
import { MaterialIcons } from '@expo/vector-icons';

export default function Home() {
  const mapRef = useRef<MapView>(null);
  const [showDenunciaModal, setShowDenunciaModal] = useState(false);
  const [showDenunciasModal, setShowDenunciasModal] = useState(false);
  const [showDenunciasCercanasModal, setShowDenunciasCercanasModal] = useState(false);
  const [showMisDenunciasModal, setShowMisDenunciasModal] = useState(false);
  const [locationName, setLocationName] = useState("Obteniendo ubicación...");
  const [userLocation, setUserLocation] = useState({
    latitude: -33.4489,
    longitude: -70.6483,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const centerMapOnUser = () => {
    mapRef.current?.animateToRegion({
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.005, // Zoom más cercano para mejor visualización
      longitudeDelta: 0.005,
    }, 1000); // Duración de la animación en ms
  };

  const updateLocationName = async (latitude: number, longitude: number) => {
    try {
      const geocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geocode && geocode.length > 0) {
        const address = geocode[0];
        // Construimos el texto con ciudad y comuna/distrito
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
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      
      setUserLocation(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);

      // Actualizar el nombre de la ubicación con la nueva función
      await updateLocationName(location.coords.latitude, location.coords.longitude);

      // Suscribirse a actualizaciones de ubicación
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        async (location) => {
          const newRegion = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          
          setUserLocation(newRegion);
          mapRef.current?.animateToRegion(newRegion, 1000);

          // Actualizar el nombre de la ubicación con la nueva función
          await updateLocationName(location.coords.latitude, location.coords.longitude);
        }
      );

      return () => {
        if (subscription) {
          subscription.remove();
        }
      };
    })();
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <LocationBar location={locationName} />
        </View>
        
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={userLocation}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onPress={() => {}}
            onPanDrag={() => {}}
          />
          
          <TouchableOpacity 
            style={styles.myLocationButton}
            onPress={centerMapOnUser}
          >
            <MaterialIcons name="my-location" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        <BottomButtons
          onHacerDenuncia={handleHacerDenuncia}
          onVerDenuncias={() => setShowDenunciasModal(true)}
        />

        <NuevaDenunciaModal
          visible={showDenunciaModal}
          onClose={() => setShowDenunciaModal(false)}
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
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  myLocationButton: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 130 : 110,
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
    zIndex: 1,
  },
}); 