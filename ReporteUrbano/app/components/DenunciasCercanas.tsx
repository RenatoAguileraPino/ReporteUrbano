import React, { useState } from 'react';
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

// Datos de ejemplo actualizados
const denunciasEjemplo = [
  {
    id: 1,
    titulo: "Bache en calle principal con riesgo de accidente",
    estado: "Sin reparar",
    ubicacion: "Comuna de Santiago, Calle Principal 1234",
    likes: 5,
    liked: false,
    imagen: require('../../assets/images/icon.png'),
    comentario: "El bache tiene aproximadamente 30cm de profundidad y está causando problemas a los vehículos que pasan por la zona. Se necesita atención urgente.",
    fecha: "15/03/2024"
  },
  {
    id: 2,
    titulo: "Poste de alumbrado público caído en la vereda",
    estado: "Sin reparar",
    ubicacion: "Comuna de Providencia, Avenida Nueva Providencia 1234",
    likes: 3,
    liked: false,
    imagen: require('../../assets/images/icon.png'),
    comentario: "El poste está completamente caído y representa un peligro para los peatones. Los cables están expuestos.",
    fecha: "14/03/2024"
  },
  {
    id: 3,
    titulo: "Semáforo dañado en intersección principal",
    estado: "Sin reparar",
    ubicacion: "Comuna de Ñuñoa, Avenida Irarrázaval 5678",
    likes: 2,
    liked: false,
    imagen: require('../../assets/images/icon.png'),
    comentario: "El semáforo no está funcionando correctamente, solo muestra luz roja intermitente. Es una intersección muy transitada.",
    fecha: "13/03/2024"
  },
  {
    id: 4,
    titulo: "Fuga de agua en alcantarillado de la calle",
    estado: "Sin reparar",
    ubicacion: "Comuna de Macul, Avenida Macul 3456",
    likes: 4,
    liked: false,
    imagen: require('../../assets/images/icon.png'),
    comentario: "Hay una fuga constante de agua que está causando inundación en la calle. El agua ya está llegando a las casas cercanas.",
    fecha: "11/03/2024"
  },
];

const DenunciasCercanas: React.FC<DenunciasCercanasProps> = ({ 
  visible, 
  onClose
}) => {
  const [denuncias, setDenuncias] = useState(denunciasEjemplo);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const router = useRouter();

  const handleLike = (id: number, event: any) => {
    event.stopPropagation(); // Evitar que el evento se propague al TouchableOpacity padre
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
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
                        {denuncia.titulo}
                      </Text>
                      <View style={styles.estadoContainer}>
                        <View style={[styles.estadoDot, { width: rem(0.5), height: rem(0.5) }]} />
                        <Text style={[styles.estadoText, { fontSize: rem(0.9) }]}>
                          {denuncia.estado}
                        </Text>
                      </View>
                      <Text 
                        style={[styles.ubicacionText, { fontSize: rem(0.9) }]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {truncateText(denuncia.ubicacion, 40)}
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
});

export default DenunciasCercanas; 