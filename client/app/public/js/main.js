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
$(document).ready(function(){
    ajaxOpt.getCsrf();
    const sv = sideVue();
    $('#side-menu').metisMenu();
})