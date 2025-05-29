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
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';

interface MisDenunciasProps {
  visible: boolean;
  onBack: () => void;
  title: string;
}

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
    fecha: "15/03/2024"
  },
  {
    id: 2,
    tipoDenuncia: "Poste de alumbrado caído",
    imagen: require('../../assets/images/icon.png'),
    descripcion: "El poste está completamente caído y representa un peligro para los peatones. Los cables están expuestos.",
    usuarios_id: 1,
    latitud: -33.4187,
    longitud: -70.6062,
    fecha: "14/03/2024"
  }
];

const MisDenuncias: React.FC<MisDenunciasProps> = ({ 
  visible, 
  onBack,
  title
}) => {
  const [denuncias, setDenuncias] = useState(misDenunciasEjemplo);
  const [direcciones, setDirecciones] = useState<{[key: number]: string}>({});
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const router = useRouter();

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

  // Cargar direcciones cuando se monta el componente
  useEffect(() => {
    denuncias.forEach(denuncia => {
      getAddressFromCoordinates(denuncia.latitud, denuncia.longitud, denuncia.id);
    });
  }, []);

  const handleDenunciaPress = (id: number) => {
    router.push(`/(denuncias)/infomisdenuncias?id=${id}`);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onBack}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { height: windowHeight * 0.8 }]}>
          <View style={[styles.modalContent, { paddingHorizontal: rem(0.5) }]}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={rem(1.5)} color="#007AFF" />
              </TouchableOpacity>
              <Text style={styles.title}>{title}</Text>
            </View>

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
                    </View>
                    <View style={styles.verContainer}>
                      <Text style={styles.verText}>Ver</Text>
                      <Ionicons name="chevron-forward" size={rem(1.3)} color="#007AFF" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  verContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: rem(3),
    paddingLeft: rem(0.5),
  },
  verText: {
    color: '#007AFF',
    marginRight: rem(0.25),
  },
});

export default MisDenuncias; 