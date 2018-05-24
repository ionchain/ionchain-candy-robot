'use strict';
import Vue from 'vue'
import ajaxOpt from '../http'
import util from '../util'
import i18n from './lang'
function userVue() {
    return new Vue({
        el: '#user',
        i18n,
        data: {
            pageCount: 10,
            pageTotalCount: 1,
            currentPage: 1,
            pages:[1],
            items: [],
            sb: {},
            rewards: [],
            displayRewards: [],
            fileData: [],
            status_select: '0',
            select_eth: [],
            checkAll: false,
        },
        methods: {
            upload: function() {
                if($("#upload-file").hasClass("disabled")){
                    alert("请勿重复上传！")
                    return;
                }
                const formData = new FormData();
                const excelEle = document.getElementById('excel');
                if (excelEle.files.length == 0) {
                    alert('您还没有选择文件');
                    return;
                }
                const ext = excelEle.files[0].name.split('.')[1];
                if (ext !== 'xlsx') {
                    alert('文件不是xlsx格式');
                    return;
                }
                formData.append('excel', excelEle.files[0]);
                this.fileData = formData;
                ajaxOpt.upload(this);
            },      
            changePage: function(index) {
                this.currentPage = index;
                this.getData();
            },
            getData: function() {
                const status = this.status_select;
                this.filterRewards = this.rewards.filter(function(item) {
                    return item.status == status;
                });
                const filter = util.getData(this.filterRewards, this.currentPage, this.pageCount);
                this.displayRewards = filter.filter;
                this.pages = filter.pages;
                this.pageTotalCount =filter.pageTotalCount;
            },
            sendCoin: function() {
                $('#send-coin').modal('hide');
                this.sb.eths = JSON.stringify(this.select_eth);
                ajaxOpt.sendCoin(this);
            }
        },
        watch: {
            rewards: function(newVal) {
                this.getData();
            },
            status_select: function(val) {
                this.getData();
            },
            pageCount: function(val) {
                this.getData();
            },
            checkAll: function(val) {
                const boxes = document.getElementsByName('eth_checkbox');
                this.select_eth = [];
                if(val) {
                  for(let i = 0; i < boxes.length; i++) {
                    this.select_eth.push(boxes[i].value);
                  }                  
                }               
            },
            
        },
        
    });
}
export default userVue;