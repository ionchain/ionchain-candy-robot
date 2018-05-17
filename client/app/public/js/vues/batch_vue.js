'use strict';
import Vue from 'vue'
import ajaxOpt from '../http'
import util from '../util'
import i18n from './lang'
function batchVue() {
    return new Vue({
        el: '#transfer_history',
        i18n,
        data: {
            pageCount: 10,
            pageTotalCount: 1,
            currentPage: 1,
            pages:[1],
            batches: [],
            orders:[]
        },
        methods: {
            getOrders: function(id){
              this.orders = [];
              ajaxOpt.getOrderInfo(id, this);
            }
        },
        
    });
}
export default batchVue;