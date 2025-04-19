import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, SafeAreaView } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { LocationBar } from './components/LocationBar';
import { BottomButtons } from './components/BottomButtons';
import { NuevaDenunciaModal } from './components/NuevaDenunciaModal';
import { VerDenunciasModal } from './components/VerDenunciasModal';
import { DenunciaDetailModal } from './components/DenunciaDetailModal';

export default function Home() {
  const [showDenunciaModal, setShowDenunciaModal] = useState(false);
  const [showDenunciasModal, setShowDenunciasModal] = useState(false);
  const [showDenunciasCercanasModal, setShowDenunciasCercanasModal] = useState(false);
  const [showMisDenunciasModal, setShowMisDenunciasModal] = useState(false);
  const [userLocation, setUserLocation] = useState({
    latitude: -33.4489,
    longitude: -70.6483,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Suscribirse a actualizaciones de ubicación
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          setUserLocation(prev => ({
            ...prev,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }));
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
        <LocationBar location="Pedro Aguirre Cerda" />
        
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={userLocation}
            showsUserLocation={true}
            showsMyLocationButton={true}
          />
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

        <DenunciaDetailModal
          visible={showDenunciasCercanasModal}
          onBack={() => {
            setShowDenunciasCercanasModal(false);
            setShowDenunciasModal(true);
          }}
          title="Denuncias Cercanas"
        />

        <DenunciaDetailModal
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
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
}); 