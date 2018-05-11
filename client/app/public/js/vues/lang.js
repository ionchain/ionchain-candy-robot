import VueI18n from 'vue-i18n'
import Vue from 'vue'
Vue.use(VueI18n) // 通过插件的形式挂载

const i18n = new VueI18n({
    locale: 'zh-CN',    // 语言标识
    //this.$i18n.locale // 通过切换locale的值来实现语言切换
    messages: {
      'zh-CN': require('../locales/zh-cn'),   // 中文语言包
    }
})

export default i18n;