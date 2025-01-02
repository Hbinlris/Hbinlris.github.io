
import { createApp } from 'vue'
import { createPinia } from 'pinia'

// @ts-ignore
import App from './App.vue'
import router from './router'

import Vant, { Lazyload } from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css';


const app = createApp(App)



app.use(createPinia())
app.use(router)

app.use(Vant);

app.use(Lazyload);

app.mount('#app')
