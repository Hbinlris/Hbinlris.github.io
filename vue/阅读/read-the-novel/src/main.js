import Vue from 'vue'
import './plugins/axios'
import './api/axios'
import App from './App.vue'
import store from './store'
import router from './router'
import Vant from 'vant';
import { Lazyload } from 'vant';
import { Skeleton } from 'vant';
import 'vant/lib/index.css';
import "/public/iconfont/iconfont.css";

Vue.use(Vant);

Vue.use(Skeleton);
Vue.use(Lazyload, {
  lazyComponent: true,
});

Vue.config.productionTip = false

new Vue({
  store,
  router,
  created() {
    this.$store.dispatch('initializeStore');
  },
  render: h => h(App)
}).$mount('#app')
