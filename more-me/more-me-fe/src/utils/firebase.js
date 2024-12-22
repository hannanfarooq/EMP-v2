import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCdwziLPU858uEeElyY60wnIMap8A8cl3c",
  authDomain: "more-me.firebaseapp.com",
  projectId: "more-me",
  storageBucket: "more-me.appspot.com",
  messagingSenderId: "181996079785",
  appId: "1:181996079785:web:bd79b2648a1b550ffdf7b8"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);