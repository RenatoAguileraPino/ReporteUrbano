import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Platform,
  Dimensions,
  useWindowDimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Función para convertir rem a píxeles
const rem = (size: number) => {
  const { width, height } = Dimensions.get('window');
  const scale = Math.min(width, height) / 375;
  return size * 16 * scale;
};

// Datos de ejemplo (esto eventualmente vendrá de una API)
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

export default function InfoDenuncia() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();

  // Encontrar la denuncia correspondiente
  const denuncia = denunciasEjemplo.find(d => d.id === Number(id));

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
        <Text style={styles.headerTitle}>Detalle de Denuncia</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Image 
          source={denuncia.imagen} 
          style={[styles.image, { width: windowWidth }]}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.titulo}>{denuncia.titulo}</Text>
          
          <View style={styles.estadoContainer}>
            <View style={styles.estadoDot} />
            <Text style={styles.estadoText}>{denuncia.estado}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Ubicación</Text>
            <Text style={styles.ubicacionText}>{denuncia.ubicacion}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Fecha de Reporte</Text>
            <Text style={styles.fechaText}>{denuncia.fecha}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.comentarioText}>{denuncia.comentario}</Text>
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
}); 