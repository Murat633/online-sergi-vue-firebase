import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyC3IkEDsO7omMmfIyghVD4RnH6qZDobcRY",
  authDomain: "vue3-firebase-projeler-46f07.firebaseapp.com",
  projectId: "vue3-firebase-projeler-46f07",
  storageBucket: "vue3-firebase-projeler-46f07.appspot.com",
  messagingSenderId: "569981359891",
  appId: "1:569981359891:web:1eb6fd87cd22531640ece6"
};

// init firebase
firebase.initializeApp(firebaseConfig)

// init services
const firestoreRef = firebase.firestore()
const authRef = firebase.auth()
const storageRef = firebase.storage()

// timestamp
const tarih = firebase.firestore.FieldValue.serverTimestamp

export { firebase,firestoreRef, authRef,storageRef, tarih }