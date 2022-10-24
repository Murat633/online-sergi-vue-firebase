import {ref} from 'vue'
import {firestoreRef} from '../firebase/config'

const getYetki = async(uid)=>{
    const yetki=ref('')

    await firestoreRef.collection('kullanicilar').where('uid','==',uid).get().then(snap=>{
        snap.forEach(doc=>{
            yetki.value=doc.data().yetki
        })
    })

    return {yetki}
}


export default getYetki