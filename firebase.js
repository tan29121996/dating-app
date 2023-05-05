import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCHsqTlvbSVRRzClBqw-iN8wdvEtCocdkM",
  authDomain: "dating-3d3ab.firebaseapp.com",
  databaseURL: "https://dating-3d3ab.firebaseio.com",
  projectId: "dating-3d3ab",
  storageBucket: "dating-3d3ab.appspot.com",
  messagingSenderId: "677915905036",
  appId: "1:677915905036:web:ca03d25740b06978d9b229",
  measurementId: "G-PRW9435QPM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});

export { auth, db }