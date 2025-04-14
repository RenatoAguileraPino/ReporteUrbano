import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Platform, SafeAreaView } from 'react-native';
import { LocationBar } from './components/LocationBar';
import { BottomButtons } from './components/BottomButtons';
import { NuevaDenunciaModal } from './components/NuevaDenunciaModal';
import { VerDenunciasModal } from './components/VerDenunciasModal';

export default function Home() {
  const [showDenunciaModal, setShowDenunciaModal] = useState(false);
  const [showDenunciasModal, setShowDenunciasModal] = useState(false);

  const handleDenunciasCercanas = () => {
    setShowDenunciasModal(false);
    // Aquí irá la lógica para mostrar denuncias cercanas
    console.log('Mostrando denuncias cercanas');
  };

  const handleMisDenuncias = () => {
    setShowDenunciasModal(false);
    // Aquí irá la lógica para mostrar mis denuncias
    console.log('Mostrando mis denuncias');
  };

  const handleHacerDenuncia = () => {
    console.log('Abriendo modal de denuncia');
    setShowDenunciaModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../assets/images/mapaejemplo.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <LocationBar location="Pedro Aguirre Cerda" />
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
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
  },
}); 