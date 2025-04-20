import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface LocationBarProps {
  location: string;
}

const LocationBar: React.FC<LocationBarProps> = ({ location }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="location-on" size={24} color="#007AFF" />
      <Text style={styles.text} numberOfLines={2}>{location}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    minHeight: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default LocationBar; 