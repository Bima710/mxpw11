// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const addData = async () => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Moch.",
      last: "Bima",
      born: "2005"
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (err) {
    console.error("Error adding document: ", err);
  }
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default firebaseConfig;