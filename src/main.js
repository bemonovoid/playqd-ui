import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import router from "@/router";
import VueHead from 'vue-head';

import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'

import './index.css'

Vue.config.productionTip = false;

Vue.use(VueHead)
Vue.use(Vuetify)

export const eventBus = new Vue();

new Vue({
    router: router,
    vuetify: new Vuetify({
        icons: {
            iconfont: 'mdi'
        }
    }),
    render: h => h(App)
}).$mount("#app")