<template>
  <div class="row">
      <div class="col s12 m12 l12">
          <div class="card orange lighten-4">
            <div class="card-content">
              <h4 class="title">Sergiler</h4>
              <ul class="collapsible popout">
                <li v-for="sergi in sergiler" :key="sergi.id">
                  <div class="collapsible-header">
                    {{ sergi.sergiAd }}
                  </div>
                  <div class="collapsible-body center-align">
                    <span>açıklamalar</span><br/> 
                    <router-link :to="{name:'SergiGez',params:{sergiId:sergi.id}}" class="btn wavess-effect waves-red red lighten-2">Sergiyi Gez</router-link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
      </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { firestoreRef } from '../../firebase/config';
export default {
  setup(){
    const sergiler = ref([])

    onMounted(async () =>{
      M.AutoInit()
      await firestoreRef.collection('sergiler').where('aktiflik','==',true).onSnapshot(snap=>{
        sergiler.value = []
        snap.docs.forEach(doc=>{
          sergiler.value.push({...doc.data(),id:doc.id})
        })
      })
    })
  
    return {sergiler}
  }
}
</script>

<style>

</style>