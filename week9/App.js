import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, Platform } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { StatusBar } from 'expo-status-bar';
import { db, storage } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function App() {
  const [uri, setUri] = useState("");
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

  const openImagePicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUri(result.assets[0].uri);
      } else {
        console.log('Image picker was cancelled or URI is undefined');
      }
    } catch (error) {
      console.error('Error opening image picker:', error);
    }
  };

  const handleCameraLaunch = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUri(result.assets[0].uri);
        let location = await Location.getCurrentPositionAsync({});
        setCoords(location.coords);
      } else {
        console.log('Camera was cancelled or URI is undefined');
      }
    } catch (error) {
      console.error('Error launching camera:', error);
    }
  };

  const uploadImageToFirebase = async (uri) => {
    if (!uri) {
      console.error('Error: URI is undefined');
      return null;
    }

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `images/${fileName}`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Image uploaded to Firebase Storage:', downloadURL);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const saveDataToFirestore = async (photoUrl, location) => {
    try {
      await addDoc(collection(db, "photos"), {
        photoUrl,
        location,
        timestamp: new Date().toISOString()
      });
      console.log('Data saved to Firestore');
    } catch (error) {
      console.error('Error saving data to Firestore:', error);
    }
  };

  const handleSaveImage = async () => {
    if (uri && coords) {
      const photoUrl = await uploadImageToFirebase(uri);
      if (photoUrl) {
        await saveDataToFirestore(photoUrl, coords);
      }
    } else {
      console.log('No image or coordinates to save');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Moch. Bima - 00000045997</Text>
      <Button title="TAKE A PHOTO" onPress={handleCameraLaunch} />
      {uri ? <Image source={{ uri }} style={styles.image} /> : null}
      {uri ? <Button title="SAVE LOCATION" onPress={handleSaveImage} /> : null}
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
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});
