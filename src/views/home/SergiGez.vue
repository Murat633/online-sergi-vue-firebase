<template>
  <div class="card black">
    <div class="card-content"  v-if="sergiResimler.length>0">
        <div class="slider">
            <ul class="slides">
                <li v-for="resim in sergiResimler" :key="resim.id">
                    <img :src="resim.resimUrl" alt="">
                    <div class="caption left-align">
                        <p>Resim Ad: {{ resim.resimAd }}</p>
                        <p class="light red-text text-lighten-3">Sanatçı: {{ resim.sanatciAd }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router';
import { onMounted,ref,onUpdated } from 'vue';
import { firestoreRef } from '../../firebase/config';
export default {
    setup(){
        const route=useRoute()
        const sergiResimler = ref([])

        onMounted(async () => {
            const resimler = await firestoreRef.collection('resimler').where('sergiId','==',route.params.sergiId).orderBy('resimSira').get()
            resimler.docs.forEach(doc=>{
                sergiResimler.value.push({...doc.data(),id:doc.id})
                console.log(sergiResimler.value,'ss')
            })
        })

        onUpdated(()=>{
            var elems = document.querySelectorAll('.slider');
            var instance = M.Slider.init(elems,
            {
                interval:1200,
                duration:1500,
                height:500
            })
        })


        return {sergiResimler}
    }
}
</script>

<style>

</style>