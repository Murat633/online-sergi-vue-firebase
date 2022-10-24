<template>
  <nav class="deep-purple lighten-3">
    <div>
        <router-link :to="{name:'SergiListesi'}" class="brand-logo">
            Online Sergi
        </router-link>
        <ul class="right">
            <li>
                <a class="waves-effect waves-light btn-flat" @click.prevent="handleGiris">
                    <i class="fa-brands fa-google-plus-g"></i>
                </a>
            </li>
        </ul>
    </div>
  </nav>
</template>

<script>
import {firebase,authRef,firestoreRef} from '../../firebase/config.js'
import { useRouter } from 'vue-router';
export default {
    setup(){
        const router = useRouter()
        const handleGiris = async() =>{
            const provider = new firebase.auth.GoogleAuthProvider();
            
            await authRef.signInWithPopup(provider).then(async()=>{
                const {uid,displayName,email,photoURL} = authRef.currentUser

                const snapshot = await firestoreRef.collection('kullanicilar').where('uid','==',uid).get()

                console.log(snapshot.empty)
                
                if(snapshot.empty){
                    console.log('Kullanıcı Kaydı Bulunamadı')
                    const yeniKullanici = {
                        uid,
                        kullaniciAd:displayName,
                        email,
                        fotoURL:photoURL,
                        yetki:'yok'
                    }

                    firestoreRef.collection('kullanicilar').add(yeniKullanici).then(()=>{
                        router.push({name:'Profil'})
                    })
                }else{
                    router.push({name:'Profil'})
                    console.log("Admin Sayfasına Yönlen")
                }

            })

        }


        return {handleGiris}
    }
}
</script>

<style>

</style>