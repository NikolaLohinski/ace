import Home from '../vue/routes/home.vue';
import Settings from '../vue/routes/settings.vue';
import Offline from '../vue/routes/offline.vue';
import Menu from '../vue/routes/menu.vue';
import Scores from '../vue/routes/scores.vue';
export default {
  routes: [
    { path: '/', component: Home },
    { path: '/settings', component: Settings, meta: { vertical: true }},
    { path: '/offline', component: Offline },
    { path: '/offline/menu', component: Menu, meta: { vertical: true }},
    { path: '/offline/scores', component: Scores, meta: { vertical: true }}
  ]
};

