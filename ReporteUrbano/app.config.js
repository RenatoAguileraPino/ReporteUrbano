  export default ({ config }) => ({
  ...config,
  name: "ReporteUrbano",
  slug: "ReporteUrbano",
  version: "1.0.0",
  scheme: "myapp",
  orientation: "portrait",
  userInterfaceStyle: "automatic",
  icon: "./assets/images/icon.png",
  sdkVersion: "53.0.0",
  owner: "elpepo",
  extra: {
    ...config.extra,
    eas: {
      projectId: "0d005d2c-5816-440f-b77e-aa4b6d42c105"
    }
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      }
    ]
  ],
  experiments: {
    typedRoutes: true
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.reporteurbano.app",
    config: {
      googleMapsApiKey: "AIzaSyDajBJt1tQS_K3w1UlA5Np48h622sdwz-g"
    },
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "Esta aplicación necesita acceso a la ubicación para mostrar tu posición en el mapa y las denuncias cercanas.",
      NSLocationAlwaysAndWhenInUseUsageDescription: "Esta aplicación necesita acceso a la ubicación para mostrar tu posición en el mapa y las denuncias cercanas."
    }
  },
  android: {
    package: "com.reporteurbano.app",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    softwareKeyboardLayoutMode: "pan",
    userInterfaceStyle: "automatic",
    navigationBarColor: "transparent",
    navigationBarHidden: true,
    immersive: true,
    permissions: [
      "ACCESS_COARSE_LOCATION",
      "ACCESS_FINE_LOCATION"
    ],
    config: {
      googleMaps: {
        apiKey: "AIzaSyDajBJt1tQS_K3w1UlA5Np48h622sdwz-g"
      }
    }
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  }
});
