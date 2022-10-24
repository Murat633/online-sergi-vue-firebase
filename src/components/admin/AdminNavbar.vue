<template>
  <nav class="black">
    <li class="brand-logo">Online Sergi Admin</li>
    <ul class="right">
        <span v-if="adminBtn || yetkiliBtn">
            <li>
                <router-link :to="{name:'SergiOlustur'}" class="waves-effect waves-red btn-flat navbar-btn">Sergi</router-link>
            </li>
            <li>
                <router-link :to="{name:'ResimEkle'}" class="waves-effect waves-red btn-flat navbar-btn">Resim</router-link>
            </li>
        </span>
        <span v-if="adminBtn">
            <li>
                <router-link :to="{name:'Yonetim'}" class="waves-effect waves-red btn-flat navbar-btn">Yönetim</router-link>
            </li>
            <li>
                <router-link :to="{name:'Mesajlar'}" class="waves-effect waves-red btn-flat navbar-btn">Mesajlar</router-link>
            </li>
        </span>
        <li>
            <router-link :to="{name:'Profil'}" class="waves-effect waves-red btn-flat navbar-btn">Profil</router-link>
        </li>
        <li>
            <a @click="handleCikis" class="waves-effect waves-light btn-small navbar-btn red darken-4">Çıkış</a>
        </li>
    </ul>
  </nav>
</template>

<script>
import { onMounted,ref } from 'vue';
import { authRef,firestoreRef } from '../../firebase/config';
import { useRouter } from 'vue-router';
import getUser from '../../composables/getUser';
export default {
setup(){
    const adminBtn=ref(false)
    const yetkiliBtn=ref(false)


    const router = useRouter()
    
    const handleCikis=async()=>{
        await authRef.signOut().then(()=>{
            router.push({name:'SergiListesi'})
        })
    }

    onMounted(async()=>{
        const {kullanici} = getUser()

        const snap=await firestoreRef.collection('kullanicilar').where('uid','==',kullanici.value.uid).get()

        snap.forEach(doc=>{
            if(doc.data().yetki=="admin"){
                adminBtn.value=true
                yetkiliBtn.value=true
            }else if(doc.data().yetki=="yetkili"){
                adminBtn.value=false
                yetkiliBtn.value=true
                console.log('yetkili')
            }else{
                adminBtn.value=false
                yetkiliBtn.value=false
            }
        })
    })

    return {handleCikis,adminBtn,yetkiliBtn}
}
}
</script>

<style>

</style>