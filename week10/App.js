import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Location from 'expo-location';
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

  return (
    <View style={styles.container}>
      <Text>Moch. Bima - 00000045997</Text>
      <Button title="Get Geo Location" onPress={getLocation} />
      {coords ? (
        <Text>
          Latitude: {coords.latitude}, Longitude: {coords.longitude}
        </Text>
      ) : (
        <Text>{errorMsg ? errorMsg : 'Fetching location...'}</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
