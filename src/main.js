import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'

import '@mdi/font/css/materialdesignicons.css'

import App from './App.vue'

import './index.css'

Vue.use(Vuetify)
Vue.use(VueRouter)
Vue.use(VueAxios, axios)

export const eventBus = new Vue();

new Vue({
    vuetify: new Vuetify({
        icons: {
            iconfont: 'mdi'
        }
    }),
    render: h => h(App)
}).$mount("#app")