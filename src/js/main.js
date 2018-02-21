'use strict';
/* 1. Import modules */
import 'inobounce';
import Vue from 'vue';
import VueX from 'vuex';
import VueTouch from 'vue-touch';
import VueCanvas from 'vue-easeljs';
import VuexI18n from 'vuex-i18n';
import VueResource from 'vue-resource';
import Store from './store.js';
import Vm from './vm.js';
import I18n from './i18n.js';

/* 2. Set global directives */
Vue.use(VueCanvas);
Vue.use(VueResource);
// Use vue-touch 2.0 in Vue
Vue.use(VueTouch, { name: 'v-touch' });
// Custom directive to focus on insertion
Vue.directive('focus', { 'inserted': (el) => el.focus() });

/* 3. Set VueX state manager */
Vue.use(VueX);
const store = new VueX.Store(Store());

/* 4. Set VuexI18n internationalization plugin */
// Initialize plugin
Vue.use(VuexI18n.plugin, store);
// The second argument is the default language
I18n(Vue, 'english');
store.i18n = Vue.i18n;
/* 5. Create Vue Virtual machine instance */
// Create Vue machine
global['vm'] = new Vue(Vm(store));

/* 6. Save store instance globally */
// Store vuex Store for components to reach out
global['store'] = store;

/* 7. Set auto reload tool on cache update */
// To reload page whenever cache has been updated
window.applicationCache.addEventListener('downloading', () => {
  store.commit('setError', 'updateDownloading');
}, { once: true });
window.applicationCache.addEventListener('updateready', () => {
  window.location.reload();
});
if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
  window.location.reload();
}
