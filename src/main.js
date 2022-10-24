import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { authRef } from './firebase/config';

import './assets/main.css'

let app

authRef.onAuthStateChanged(() => {
    
  if (!app) {
    
    app = createApp(App)
      .use(router)
      .mount('#app')
  }
})

