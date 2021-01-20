import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import 'core-js/stable'

import App from './App.vue'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

import './index.css'

Vue.use(VueRouter)
Vue.use(BootstrapVue, BootstrapVueIcons)

Vue.use(VueAxios, axios)

export const eventBus = new Vue();

new Vue({
    render: function(h) {
        return h(App);
    }
}).$mount("#app")