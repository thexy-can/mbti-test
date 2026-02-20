// svgIcons.js
import SvgIcon from "@/components/SvgIcon.vue";

export default {
  install(app) {
    // 1. 全局注册 SvgIcon 组件
    app.component("SvgIcon", SvgIcon);

    // 2. 自动导入 @/assets/avatars 下所有 .svg 文件（Vite 写法）
    // 注：{ eager: true } 表示立即导入，非懒加载
    const svgModules = import.meta.glob("@/assets/avatars/*.svg", { eager: true });
    // 遍历执行导入（确保SVG文件被加载）
    Object.keys(svgModules).forEach((path) => {
      svgModules[path]; // 执行导入逻辑
    });
  },
};