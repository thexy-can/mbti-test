import { createApp } from 'vue'
//import './style.css'
import App from './App.vue'
import svgIconsPlugin from "./plugins/svgIcons";
// 引入Element Plus核心库和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 创建Vue应用并使用Element Plus
const app = createApp(App)
app.use(ElementPlus) // 全局注册所有Element Plus组件
app.use(svgIconsPlugin)
app.mount('#app')
