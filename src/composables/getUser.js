import { ref } from 'vue'
import { authRef } from '../firebase/config'

// refs
const kullanici = ref(authRef.currentUser)

// auth changes
authRef.onAuthStateChanged(k => {
  kullanici.value = k
});

const getUser = () => {
  return { kullanici } 
}

export default getUser