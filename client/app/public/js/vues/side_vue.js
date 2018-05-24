'use strict';
import Vue from 'vue'
import ajaxOpt from '../http'
import i18n from './lang'
//import batchVue from "./batch_vue";
import userVue from './user_vue';
function sideVue() {
    // const _batchVue = batchVue();
    const _userVue = userVue();
    return new Vue({
        el: '#side-menu',
        i18n,
        data: {
            // batch: _batchVue,
            user: _userVue,
        },
        methods: {
            sideClick: function(key) {
             // ajaxOpt.getItems(this.vues[key]);
            }
            // onBatchClick: function() {
            //     ajaxOpt.getBatches(_batchVue);
            // }
        }
    });
}
export default sideVue;