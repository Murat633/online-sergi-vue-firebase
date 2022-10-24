<template>
  <!-- Row -->
  <div class="row">
    <div class="col m12 s12">
        <div class="card grey lighten-1">
            <div class="card-content white-text">
                <span class="card-title">Kişisel Bilgiler</span>
                <table class="responsive-table centered">
                    <tbody>
                        <tr>
                            <td class="black-text">
                                <img :src="resimUrl" height="100" style="{resize-mode:contain ;}">
                            </td>
                            <td class="black-text">{{ kullaniciAd }}</td>
                            <td class="black-text">{{ email }}</td>
                            <td class="black-text">{{ yetki }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  </div>
  <!-- Row -->
  <div class="row">
    <!-- col -->
    <div class="col m6 s12">
        <div class="card grey lighten-1">
            <div class="card-content white-text">
                <span class="card-title">Admine Mesaj Gönder</span>
                <form @submit.prevent="mesajGonder">
                    <input type="text" class="input-field" v-model="mesajText">
                    <button class="btn black">Gönder</button>
                </form>
            </div>
        </div>
    </div>
    <!-- Col -->
     <div class="col m6 s12">
        <div class="card grey lighten-1">
            <div class="card-content white-text">
                <span class="card-title">Gelen Mesajlar</span>
                <ul class="collection">
                    <li class="collection-item black-text" v-for="mesaj in mesajlar" :key="mesaj">
                        <div>
                            {{ mesaj.icerik }} <a href="#" class="secondary-content">
                                <i class="fas fa-trash red-text" @click="mesajSil(mesaj.id)"></i>
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { onMounted,ref } from 'vue';
import getUser from '../../composables/getUser';
import { firestoreRef,tarih } from '../../firebase/config';
export default {
setup(){
    const resimUrl=ref('')
    const email = ref('')
    const kullaniciAd = ref('')
    const yetki = ref('')
    const mesajText = ref('')
    const mesajlar = ref([])

    const {kullanici} = getUser()
    const kullaniciUID=kullanici.value.uid



    onMounted(async()=>{
        const snapshot=await firestoreRef.collection('kullanicilar').where('uid','==',kullaniciUID).get()

        snapshot.forEach(doc=>{
            resimUrl.value = doc.data().fotoURL
            email.value=doc.data().email
            kullaniciAd.value = doc.data().kullaniciAd
            yetki.value = doc.data().yetki
        })

        await firestoreRef.collection('mesajlar').where('kime','==',kullaniciUID).where('aktiflik','==',true).onSnapshot(snap=>{
            mesajlar.value=[]
            
            snap.docs.forEach(doc=>{
                mesajlar.value.push({...doc.data(),id:doc.id})
            })
        })
    })

    const mesajGonder = async()=>{
        if(mesajText.value!=''){
            // console.log(mesajText.value)
            const yeniMesaj = {
                icerik:mesajText.value,
                kimden:kullaniciUID,
                kime:"admin",
                olusturulmaTarihi:tarih(),
                aktiflik:true
            }
            await firestoreRef.collection('mesajlar').add(yeniMesaj).then(()=>{
                mesajText.value = ''
            })
        }
    }

    const mesajSil = async(id)=>{
        await firestoreRef.collection('mesajlar').doc(id).update({
            aktiflik:false
        })
    }
    return {resimUrl,email,kullaniciAd,yetki,mesajText,mesajGonder,mesajlar,mesajSil}
}
}
</script>

<style>

</style>