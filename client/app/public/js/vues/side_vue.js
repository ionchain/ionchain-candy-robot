'use strict';
import Vue from 'vue'
import ajaxOpt from '../http'
import i18n from './lang'
function sideVue() {
    return new Vue({
        el: '#side-menu',
        i18n,
        data: {
        },
        methods: {
            sideClick: function(key) {
               // ajaxOpt.getItems(this.vues[key]);
            }
        }
    });
}
export default sideVue;