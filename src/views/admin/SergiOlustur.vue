<template>
  <div class="row">
    <div class="col s12 m6 l6">
        <div class="card grey darken-1">
            <div class="card-content">
                <p class="title">
                    Sergi Oluştur
                </p>
                <form @submit.prevent="sergiEkle">
                    <label class="grey-text text-darken-3">Sergi Ad:</label>
                    <input type="text" class="input-field grey-text text-darken-3" v-model="sergiAd">
                    <button type="submit" class="btn red darken-3">Kaydet</button>
                </form>
            </div>
        </div>
    </div>
    <!-- col -->
    <div class="col s12 m6 l6">
        <div class="card grey darken-">
            <div class="card-content">
                <p class="title">Sergi Listesi</p>
                <ul class="collection-item" v-for="sergi in sergiler" :key="sergi.id">
                    <span>{{ sergi.sergiAd }}</span>
                    <span>
                        <a class="secondary-content" @click="sergiGuncelle(sergi.id)">
                            <i :class="sergi.icon"></i>
                        </a>
                    </span>
                </ul>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import {ref,onMounted} from 'vue'
import { firestoreRef, tarih } from '../../firebase/config';
import getUser from '../../composables/getUser';
export default {
setup(){
    const sergiAd = ref('')
    const {kullanici} = getUser()
    const sergiler = ref()

    onMounted(async()=>{
        await firestoreRef.collection('sergiler').orderBy('olusturulmaTarihi','desc').onSnapshot(snap=>{
            sergiler.value=[]
            snap.docs.forEach(doc=>{
                sergiler.value.push({...doc.data(),id:doc.id})
            })
        })
    })

    const sergiEkle = async ()=>{
        if(sergiAd.value !=""){
            let sergi={
                sergiAd:sergiAd.value,
                aktiflik:true,
                icon:"fas fa-level-down-alt red-text text-darken-2",
                olusturulmaTarihi:tarih(),
                olusturanUID:kullanici.value.uid
            }

            await firestoreRef.collection('sergiler').add(sergi).then(()=>{
                sergiAd.value=""
            })
        }
    } 


    const sergiGuncelle=async(id)=>{
        const veri = await firestoreRef.collection('sergiler').doc(id).get();

        const aktiflik=veri.data().aktiflik == true?false:true

        let icon = veri.data().icon =="fas fa-level-down-alt red-text text-darken-2"?"fas fa-level-up-alt green-text text-darken-4"
        :"fas fa-level-down-alt red-text text-darken-2"

        await firestoreRef.collection('sergiler').doc(id).update({
            aktiflik,
            icon
        })
    }

    return {sergiEkle,sergiAd,sergiler,sergiGuncelle}
}
}
</script>

<style>

</style>