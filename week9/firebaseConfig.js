import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDfr0ZsR1Tbkqnl5mKy5IVbcEKfPUJxIHo",
  authDomain: "mobilecrossweek11-5c3c8.firebaseapp.com",
  projectId: "mobilecrossweek11-5c3c8",
  storageBucket: "mobilecrossweek11-5c3c8.firebasestorage.app",
  messagingSenderId: "779584871805",
  appId: "1:779584871805:web:17ae30310c2813290a0014",
  measurementId: "G-Y1ZCBGQYF4"
};

const addData = async () => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Moch.",
      last: "Bima",
      born: "2005"
    });
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  if (Platform.OS === "android") {
    console.log("Document written from phone with ID: ", docRef.id);
  } else {
    console.log("Document written with ID: ", docRef.id);
  }
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default firebaseConfig;