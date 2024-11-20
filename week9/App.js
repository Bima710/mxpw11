import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as FileSystem from 'expo-file-system';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [coords, setCoords] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCoords(location.coords);
    })();
  }, []);

  const getLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setCoords(location.coords);
  };

  const saveLocationToFile = async () => {
    if (!coords) {
      console.log('No coordinates to save');
      return;
    }

    const content = `Latitude: ${coords.latitude}, Longitude: ${coords.longitude}\n`;

    if (Platform.OS === 'web') {
      // bisa simpan data lokasi ke file location.txt di web
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'location.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      console.log('Location saved to location.txt');
    } else {
      // bisa simpan data lokasi ke file location.txt di Android
      const directory = `${FileSystem.documentDirectory}Download`;
      const fileName = `${directory}/location.txt`;

      try {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
        await FileSystem.writeAsStringAsync(fileName, content, { encoding: FileSystem.EncodingType.UTF8 });
        console.log('Location saved to', fileName);
      } catch (error) {
        console.error('Error saving location to file:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Moch. Bima - 00000045997</Text>
      <Button title="GET GEO LOCATION" onPress={getLocation} />
      {coords ? (
        <Text>
          Latitude: {coords.latitude}, Longitude: {coords.longitude}
        </Text>
      ) : (
        <Text>{errorMsg ? errorMsg : 'Fetching location...'}</Text>
      )}
      <Button title="SAVE LOCATION" onPress={saveLocationToFile} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
