import React, { useState, useEffect } from 'react';
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
  Alert
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

export default function InfoMisDenuncias() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const [direccion, setDireccion] = useState<string>("Cargando ubicación...");

  // Encontrar la denuncia correspondiente
  const denuncia = misDenunciasEjemplo.find(d => d.id === Number(id));

  useEffect(() => {
    if (denuncia) {
      getAddressFromCoordinates(denuncia.latitud, denuncia.longitud);
    }
  }, [denuncia]);

  // Función para obtener la dirección a partir de coordenadas
  const getAddressFromCoordinates = async (latitud: number, longitud: number) => {
    try {
      const response = await Location.reverseGeocodeAsync({
        latitude: latitud,
        longitude: longitud
      });
      
      if (response.length > 0) {
        const location = response[0];
        setDireccion(`${location.street || 'Calle sin nombre'}, ${location.city || 'Ciudad sin nombre'}`);
      } else {
        setDireccion("Ubicación no disponible");
      }
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      setDireccion("Ubicación no disponible");
    }
  };

  const handleEditar = () => {
    router.push({
      pathname: "/(denuncias)/editarmisdenuncias",
      params: { id: id }
    });
  };

  const handleEliminar = () => {
    Alert.alert(
      "Eliminar Denuncia",
      "¿Estás seguro de que quieres eliminar esta denuncia?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            // Aquí iría la lógica para eliminar la denuncia
            router.back();
          }
        }
      ]
    );
  };

  if (!denuncia) {
    return (
      <View style={styles.container}>
        <Text>Denuncia no encontrada</Text>
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
        <Text style={styles.headerTitle}>Detalle de Mi Denuncia</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Image 
          source={denuncia.imagen} 
          style={[styles.image, { width: windowWidth }]}
          resizeMode="cover"
        />

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
            <Text style={styles.sectionTitle}>Likes Totales</Text>
            <View style={styles.likesContainer}>
              <Ionicons name="heart" size={20} color="#FF3B30" />
              <Text style={styles.likesText}>{denuncia.likes}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.comentarioText}>{denuncia.descripcion}</Text>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editarButton]} 
              onPress={handleEditar}
            >
              <Ionicons name="create-outline" size={24} color="#007AFF" />
              <Text style={styles.actionButtonText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.eliminarButton]} 
              onPress={handleEliminar}
            >
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
              <Text style={[styles.actionButtonText, styles.eliminarButtonText]}>Eliminar</Text>
            </TouchableOpacity>
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
  coordenadasText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 10,
  },
  editarButton: {
    backgroundColor: '#E3F2FD',
  },
  eliminarButton: {
    backgroundColor: '#FFEBEE',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#007AFF',
  },
  eliminarButtonText: {
    color: '#FF3B30',
  },
  likesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  likesText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    fontWeight: '500',
  },
});
