'use strict';
//import $ from 'jquery'
import './bootstrap'
import './plugins/metisMenu/jquery.metisMenu'
import './plugins/slimscroll/jquery.slimscroll.min'
import './inspinia'
import './vues/validation'
import './vues/user_vue'
import sideVue from './vues/side_vue'
import ajaxOpt from './http'
import userVue from './vues/user_vue';
$(document).ready(function(){
    ajaxOpt.getCsrf();
    userVue();
    const sv = sideVue();
    sv.sideClick('admin');
    $('#side-menu').metisMenu();
})