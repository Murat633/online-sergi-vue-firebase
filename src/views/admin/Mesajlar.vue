<template>
    <div class="row">
        <div class="col m6 s12">
            <div class="card grey lighten-1">
                <div class="card-content white-text">
                    <span class="card-title black-text">Gelen Mesajlar</span>
                    <ul class="collection ">
                        <li class="collection-item black-text" v-for="mesaj in mesajlar" :key="mesaj">
                            <div>
                                {{ mesaj.icerik }} 
                                <a class="secondary-content" @click="mesajGoruntule(mesaj.kimden,mesaj.icerik,mesaj.id)">
                                    <i class="fas fa-paper-plane brown-text"></i>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    <!-- col -->
    <div class="col m6 s12">
        <div class="card grey lighten-1">
            <div class="card-content white-text">
                    <span class="card-title black-text">Cevap Gönder</span>
                    <form @submit.prevent="mesajGonder">
                        <label class="pink-text row">
                            <span class="black-text">Kime:</span>
                            {{ kullaniciAd }}
                        </label>
                        <label class="red-text row">
                            <span class="black-text">İçerik: </span>
                            {{ mesajIcerik }}
                        </label>
                        <label for="" class="black-text row">Cevap Yaz</label>
                        <input type="text" class="input-field" v-model="mesajText">
                        <button class="btn black">Gönder</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { onMounted,ref } from 'vue';
import { firestoreRef,tarih } from '../../firebase/config';
export default {
setup(){
    const mesajlar = ref('')
    const kullaniciAd = ref('')
    const mesajIcerik = ref('')

    const kullaniciUID=ref('')
    const mesajId=ref('')
    const mesajText=ref('')

    onMounted(async()=>{
        await firestoreRef.collection('mesajlar').where("kime",'==',"admin").where('aktiflik','==',true)
        .onSnapshot(snap=>{
            mesajlar.value=[]

            snap.docs.forEach(doc=>{
                    mesajlar.value.push({...doc.data(),id:doc.id})
            })
        })
    })

    const mesajGoruntule = async(kimden,icerik,id)=>{
        mesajIcerik.value=icerik
        mesajId.value=id
        const snap= await firestoreRef.collection('kullanicilar').where('uid','==',kimden).get()

        snap.forEach(doc=>{
            kullaniciAd.value=doc.data().kullaniciAd
            kullaniciUID.value=doc.data().uid
        })
    }

    const mesajGonder = async()=>{
        if(kullaniciAd.value!=''){
            await firestoreRef.collection('mesajlar').doc(mesajId.value).update({
                kime:kullaniciUID.value,
                kimden:'admin',
                icerik:mesajText.value,
                olusturulmaTarihi:tarih()
            }).then(()=>{
                mesajText.value="";
                kullaniciAd.value="";
                mesajIcerik.value="";
            })
        }else{
            console.log('mesaj Gönderilemedi')
        }
    }

    return {mesajlar,mesajGoruntule,mesajGonder,kullaniciAd,mesajIcerik,mesajText}
}
}
</script>

<style>

</style>