<template>
  <div class="row">
    <div class="col s12 m12 hoverable">
        <div class="card blue-grey lighten-2">
            <div class="card-content black-text">
                <span class="card-title center">Yönetici Listesi</span>
                <ul class="collection">
                    <li class="collection-item avatar" v-for="kullanici in kullanicilar" :key="kullanici.id">
                        <img :src="kullanici.fotoURL" :alt="kullanici.kullaniciAd" class="circle">
                        <p class="title red-text">{{ kullanici.kullaniciAd }}</p>
                        <p>Yetki: {{ kullanici.yetki }}</p>
                        <a class="secondary-content btn-floating black" @click="yetkiGoruntule(kullanici.id)">
                            <i class="fas fa-key red-text text-darken-2"></i>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  </div>
  <!-- Yetki Ver -->
  <div class="row" v-if="goster">
    <div class="col s12 m12 hoverable">
        <div class="card black">
            <div class="card-content white-text">
                <span class="card-title red-text text-darken-3">{{ kullaniciAd }} İçin Yetki Düzenle</span>
                <p class="white-text">Yetkisi: <span class="red-text text-darken-3">{{ yetki }}</span></p>
                <!-- <p>
                    <label>
                        <input class="with-gap" type="radio" name="grup1" value="yok" v-model="yetkiTur">
                        <span>yok</span>
                    </label>
                </p>
                <p>
                    <label>
                        <input class="with-gap" type="radio" name="grup2" value="yetkili" v-model="yetkiTur">
                        <span>Yetkili</span>
                    </label>
                </p>
                <p>
                    <label>
                        <input class="with-gap" type="radio" name="grup3" value="admin" v-model="yetkiTur">
                        <span>Admin</span>
                    </label>
                </p> -->
                <p>Yetki Seç</p>
                <p v-for="yetki in yetkiler" :key="yetki.sira">
                    <label>
                        <input type="radio" class="with-gap" :name="`grup${yetki.sira}`" :value="yetki.yetkiTur" v-model="yetkiTur">
                        <span>{{ yetki.yetkiAd }}</span>
                    </label>
                </p>
            </div>

            <div class="card-action">
                <a @click="yetkiDegistir" class="white-text btn red darken-4">Yetki Değiştir</a>
            </div>

        </div>
    </div>
  </div>
</template>

<script>
import { type } from 'os';
import { onMounted,ref } from 'vue';
import { firestoreRef } from '../../firebase/config';
export default {
setup(){
    const kullanicilar = ref([])
    const kullaniciAd = ref('')
    const yetki = ref('')
    const goster = ref(false)

    const docId=ref('')
    const yetkiTur = ref('')

    const yetkiler=ref([])

    const yetkiGoruntule = async(id)=>{
        goster.value=true
        docId.value=id


        const snap=await firestoreRef.collection('kullanicilar').doc(id).get()


        kullaniciAd.value=snap.data().kullaniciAd
        yetki.value = snap.data().yetki
    }


    const yetkiDegistir = async()=>{
        // console.log(yetkiTur.value)

        await firestoreRef.collection('kullanicilar').doc(docId.value).update({
            yetki:yetkiTur.value
        }).then(()=>{
            window.location="/yonetim"
        })
    }



    onMounted(async()=>{
        await firestoreRef.collection('kullanicilar').onSnapshot(snap=>{
            kullanicilar.value=[]

            snap.docs.forEach(doc=>{
                kullanicilar.value.push({...doc.data(),id:doc.id})
            })
        })

        const yetkiSnap = await firestoreRef.collection('yetkiler').orderBy('sira').get()

        yetkiSnap.docs.forEach(doc=>{
            yetkiler.value.push(doc.data())
        })
    })

    return {kullanicilar,yetki,kullaniciAd,goster,yetkiGoruntule,yetkiTur,yetkiDegistir,yetkiler}
}
}
</script>

<style>

</style>