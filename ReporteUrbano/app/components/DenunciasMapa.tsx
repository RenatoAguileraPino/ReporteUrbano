import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Image
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Función para convertir rem a píxeles
const rem = (size: number) => {
  const { width, height } = Dimensions.get('window');
  const scale = Math.min(width, height) / 375;
  return size * 16 * scale;
};

// Datos de ejemplo según la estructura de la BD
const denunciasEjemplo = [
  {
    id: 1,
    tipoDenuncia: "Bache en calle principal",
    imagen: require('../../assets/images/icon.png'),
    descripcion: "El bache tiene aproximadamente 30cm de profundidad y está causando problemas a los vehículos que pasan por la zona. Se necesita atención urgente.",
    usuarios_id: 1,
    latitud: -33.497529,
    longitud: -70.686348,
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

interface DenunciasMapaProps {
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const DenunciasMapa: React.FC<DenunciasMapaProps> = ({ 
  initialRegion = {
    latitude: -33.497529,
    longitude: -70.686348,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }
}) => {
  const router = useRouter();
  const [denuncias, setDenuncias] = useState(denunciasEjemplo);

  const handleVerDetalles = (id: number) => {
    router.push({
      pathname: "/(denuncias)/infodenuncias",
      params: { id: id }
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {denuncias.map((denuncia) => (
          <Marker
            key={denuncia.id}
            coordinate={{
              latitude: denuncia.latitud,
              longitude: denuncia.longitud
            }}
            pinColor="#FF3B30"
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerBubble}>
                <Ionicons name="alert-circle" size={24} color="#FF3B30" />
              </View>
              <View style={styles.markerArrow} />
            </View>
            <Callout
              tooltip
              onPress={() => handleVerDetalles(denuncia.id)}
            >
              <View style={styles.calloutContainer}>
                <Image 
                  source={denuncia.imagen} 
                  style={styles.calloutImage}
                  resizeMode="cover"
                />
                <View style={styles.calloutContent}>
                  <Text style={styles.calloutTitle} numberOfLines={1}>
                    {denuncia.tipoDenuncia}
                  </Text>
                  <Text style={styles.calloutDate}>
                    {denuncia.fecha}
                  </Text>
                  <View style={styles.calloutFooter}>
                    <View style={styles.likesContainer}>
                      <Ionicons name="heart" size={16} color="#FF3B30" />
                      <Text style={styles.likesText}>{denuncia.likes}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.verButton}
                      onPress={() => handleVerDetalles(denuncia.id)}
                    >
                      <Text style={styles.verButtonText}>Ver detalles</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerBubble: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  markerArrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#FF3B30',
    borderWidth: 8,
    alignSelf: 'center',
    marginTop: -1,
  },
  calloutContainer: {
    width: rem(15),
    backgroundColor: 'white',
    borderRadius: rem(0.5),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  calloutImage: {
    width: '100%',
    height: rem(8),
  },
  calloutContent: {
    padding: rem(0.75),
  },
  calloutTitle: {
    fontSize: rem(0.9),
    fontWeight: '600',
    color: '#333',
    marginBottom: rem(0.25),
  },
  calloutDate: {
    fontSize: rem(0.8),
    color: '#666',
    marginBottom: rem(0.5),
  },
  calloutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesText: {
    fontSize: rem(0.8),
    color: '#FF3B30',
    marginLeft: rem(0.25),
    fontWeight: '500',
  },
  verButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: rem(0.75),
    paddingVertical: rem(0.25),
    borderRadius: rem(0.25),
  },
  verButtonText: {
    color: 'white',
    fontSize: rem(0.8),
    fontWeight: '500',
  },
});

export default DenunciasMapa;
