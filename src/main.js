import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/main.css'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { createPinia } from 'pinia'

const pinia = createPinia()
dayjs().format()
dayjs.extend(calendar).extend(weekOfYear)

createApp(App).use(pinia).mount('#app')
