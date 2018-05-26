import Vue from 'vue'
import MainVue from './Main.vue'

new Vue({
  el: '#main',
  render(h) {
    return h('MainVue')
  },
  components: { MainVue }
})
