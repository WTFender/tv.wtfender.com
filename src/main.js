import './assets/main.css'
import Password from 'primevue/password';
import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';

const app = createApp(App);
app.component('Password', Password);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});
app.mount('#app');
 