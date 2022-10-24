<template>
  <div class="row">
    <div class="col s12 m12 l12">
        <div class="card grey lighten-2">
            <div class="card-content">
                <span class="card-title">Sergiye Resim Ekle</span>
                <form @submit.prevent="resimEkle">
                    <select v-model="sergiSelect">
                        <option selected disabled>Sergi Seçiniz</option>
                        <option v-for="sergi in sergiler" :key="sergi.id" :value="sergi.id">
                            <span class="red-text">{{ sergi.sergiAd }}</span>
                        </option>
                    </select>
                    <input class="input-field" placeholder="Resim Ad" v-model="resimAd"/>
                    <input class="input-field" placeholder="Sanatçı Ad" v-model="sanatciAd"/>
                    <input class="input-field" type="number" placeholder="Resim Sırası" v-model="resimSira"/>
                    
                    <div class="file-field input-field">
                        <div class="btn red lighten-2">
                            <span>Dosya</span>
                            <input type="file" @change="resimDosyaYukle"/>
                        </div>
                        <div class="file-path-wrapper">
                            <input type="text" class="file-path validate" placeholder="Resim Dosyasını Seçiniz.">
                        </div>
                    </div>
                    <div class="progress red lighten-3" v-if="progressVisible">
                        <div class="determinate red darken-2" :style="progressStyle">

                        </div>
                    </div>
                    <div class="center-align">
                        <button class="btn red darken-3 btn-large">Sergiye Resim Ekle</button>
                        <p class="red-text">{{ dosyaHata }}</p>
                    </div>
                </form>
            </div>
        </div>
    </div>
  </div>

  <!-- row -->
  <div class="row">
    <div class="col s12 m12 l12">
        <div class="card grey lighten-2">
            <div class="card-content">
                <span class="card-title">Resim Lİstesi</span>
                    <select v-model="sergiSelect">
                        <option selected disabled>Sergi Seçiniz</option>
                        <option v-for="sergi in sergiler" :key="sergi.id" :value="sergi.id">
                            <span class="red-text">{{ sergi.sergiAd }}</span>
                        </option>
                    </select>
                    <button class="btn orange darken-2" @click="resimleriGetir">
                        Resimleri Getir
                    </button>
                    <ul class="collection">
                        <li class="collection-item" v-for="resim in resimler" :key="resim.id">
                            <span class="title">{{resim.resimAd}}</span>s
                            <a @click="resimSil(resim.id)" class="secondary-content">
                                <i class="far fa-trash-alt red-text"></i>
                            </a>
                        </li>
                    </ul>
            </div>
        </div>
    </div>
  </div>  
</template>

<script>
import {ref,onMounted,onUpdated} from 'vue'
import { firestoreRef,storageRef, authRef } from '../../firebase/config'
import getYetki from '../../composables/getYetki'
export default {

    setup(){
        const sergiSelect = ref('')
        const sergiler = ref([])
        const dosyaTipleri=ref(["image/png","image/jpeg"])
        const resimDosya=ref(null)
        const dosyaHata=ref('')
        const progressStyle =ref('width:0%;')
        const progressVisible = ref(false)

        const resimAd=ref('')
        const sanatciAd=ref('')
        const resimUrl=ref('')
        const resimSira=ref(null)

        const resimler = ref([])

        const silmeYetki = ref('')



        onMounted(async()=>{
            var el = document.querySelectorAll('select')
            // console.log(M,el)
            M.FormSelect.init(el,{})   
             await firestoreRef.collection('sergiler').where('aktiflik','==',true).onSnapshot(snap=>{
                sergiler.value = []

                snap.docs.forEach(doc=>{
                    sergiler.value.push({...doc.data(),id:doc.id})
                })
            })         
            
           let kullanici = authRef.currentUser;
           const {yetki} = await getYetki(kullanici.uid)           
           silmeYetki.value=yetki.value
        })

        onUpdated(()=>{
            var el = document.querySelectorAll('select')
            // console.log(M,el)
            M.FormSelect.init(el,{})
        })

        const resimDosyaYukle = (e)=>{
            let secilenDosya=e.target.files[0];

            if(secilenDosya && dosyaTipleri.value.includes(secilenDosya.type)){
                resimDosya.value = secilenDosya
                dosyaHata.value = null
            }else{
                dosyaHata.value = "Seçilen Dosya png yada jpg olmalı"
            }
        }        
        
        const resimEkle = async()=>{
            if(sergiSelect.value!="" && resimDosya.value){
                progressVisible.value=true

                const storage = await storageRef.ref(`resimler/${M.guid()}`)

                const resimRef = storage.put(resimDosya.value).on('state_changed',(snap)=>{
                    let yuzdelik = (snap.bytesTransferred/snap.totalBytes)*100

                    progressStyle.value=`width:${yuzdelik};`
                },err=>{
                    dosyaHata.value="Dosya Yüklenirken Hata Oluştu"
                },async()=>{
                    setTimeout(async()=>{
                        progressVisible.value=false;
                        dosyaHata.value='Dosya Yüklendi'

                        resimUrl.value = await storage.getDownloadURL()

                        const resim = {
                            sergiId:sergiSelect.value,
                            resimAd:resimAd.value,
                            sanatciAd:sanatciAd.value,
                            resimSira:Number(resimSira.value),
                            resimUrl:resimUrl.value
                        }

                            await firestoreRef.collection('resimler').add(resim)
                            .then((r)=>{
                                dosyaHata.value=`${r.id} id'li resim eklendi`
                                sergiSelect.value=''    
                                sanatciAd.value=''
                                resimSira.value=''
                                resimAd.value=''
                            })
                    },500)
                })
            }else{
                dosyaHata.value=`Lütfen Sergi ve resim Seçiniz`
            }            
        }

        const resimleriGetir = async()=>{
                await firestoreRef.collection('resimler').where('sergiId','==',sergiSelect.value).onSnapshot(snap=>{
                    resimler.value = []
                    snap.docs.forEach(doc=>{
                        resimler.value.push({...doc.data(),id:doc.id})
                    })
                })
            }

        const resimSil=async(id)=>{
            if(silmeYetki.value=="admin"){
                await firestoreRef.collection('resimler').doc(id).delete()
            }
        }

        return {
            sergiSelect,
            sergiler,
            resimDosyaYukle,
            dosyaHata,
            resimEkle,
            progressStyle,
            progressVisible,
            resimAd,
            resimUrl,
            sanatciAd,
            resimSira,
            resimleriGetir,
            resimler,
            resimSil,
            silmeYetki
        }
    }
}
</script>

<style scoped>
::placeholder{
    color: #636e72;
    opacity: 1;
}
</style>