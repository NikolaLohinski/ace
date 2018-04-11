'use strict';
if (!Object.assign) Object.assign = require('object.assign').getPolyfill();

import Vue from 'vue';

import 'inobounce';
import VueX from 'vuex';
import VueTouch from 'vue-touch';
import VuexI18n from 'vuex-i18n';
import Cube from 'cube-ui';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import VueSimpleMarkdown from 'vue-simple-markdown';

import Store from './store.js';
import Router from './router.js';
import I18n from './i18n.js';
import Vm from './vm.js';

Vue.use(Cube);
Vue.use(VueSimpleMarkdown);
Vue.use(VueResource);
Vue.use(VueTouch, { name: 'v-touch' });

Vue.use(VueX);
Vm.store = new VueX.Store(Store);

Vue.use(VueRouter);
Vm.router = new VueRouter(Router);

Vue.use(VuexI18n.plugin, Vm.store);
I18n(Vue);
Vm.store.i18n = Vue.i18n;

global['vm'] = new Vue(Vm);
global['store'] = Vm.store;

window.applicationCache.addEventListener('updateready', () => {
  window.location.reload();
});
if (window.applicationCache.status === window.applicationCache.UPDATEREADY) {
  window.location.reload();
}
