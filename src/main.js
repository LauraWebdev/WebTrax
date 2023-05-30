import '@/assets/reset.scss';
import '@fontsource-variable/work-sans';
import '@mdi/font/scss/materialdesignicons.scss';
import '@/assets/app.scss';

import { createApp } from 'vue';
import App from './App.vue';

const Vue = createApp(App);

Vue.mount('#app');