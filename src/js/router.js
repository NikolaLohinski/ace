import Home from '../vue/routes/home.vue';
import Settings from '../vue/routes/settings.vue';
import Play from '../vue/routes/play.vue';
import Offline from '../vue/routes/offline.vue';
import Menu from '../vue/routes/menu.vue';
import Scores from '../vue/routes/scores.vue';
import About from '../vue/routes/about.vue';

export default {
  routes: [
    { path: '/', component: Home },
    { path: '/settings', component: Settings, meta: { vertical: true }},
    { path: '/about', component: About, meta: { vertical: true }},
    { path: '/play', component: Play },
    { path: '/play/offline', component: Offline },
    { path: '/play/offline/menu', component: Menu, meta: { vertical: true }},
    { path: '/play/offline/scores', component: Scores, meta: { vertical: true }},
    { path: '*', redirect: '/' }
  ]
};
