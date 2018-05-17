function ajaxOpt(){

}
ajaxOpt.csrf = '';

/*
*分页处理
*/
function getPages(currentPage, pageCount) {
  const startPage = currentPage - 2 > 1 ? currentPage - 2 : 1;
  const endPage = currentPage + 4 > pageCount ? pageCount :  currentPage + 4;
  const pages = [];
  for (let i = startPage; i <= endPage; i ++) {
    pages.push(i);
  }
  return pages;
}

/*
* 封装了下jQuery的ajax
*/
function ajax(params){
  const type = params.type || "post";
  const dataType = params.dataType || "json";
  const processData = params.processData;
  const contentType = params.contentType;
  if (typeof processData == 'undefinded') {
    processData = true;
  }
  if (typeof contentType == 'undefinded') {
    processData = 'application/x-www-form-urlencoded';
  }
  if(type == 'post') {
    params.data._csrf = ajaxOpt.csrf;
  }
  $.ajax({
      type: type,
      url: params.url,
      data: params.data,
      dataType: dataType,
      processData: processData,
      contentType: contentType,
      headers: {
        ajax: true,
      },
      beforeSend: function(){  //开始loading
          $(".js_loading").show();                    
      },

      success: function(res){
        if(params.success){
           params.success(res);
        }                       
                
      },
      error: function(event, XMLHttpRequest, ajaxOptions, thrownError){
        if(params.error){
          params.error(event, XMLHttpRequest, ajaxOptions, thrownError);
       }                   
                
      },
      complete: function(){   //结束loading
          //$(".js_loading").remove();
          $(".js_loading").hide();
      }
  });
}

/*
*公用的获取模块
*/
ajaxOpt.getItems = function(vue) {
  ajax({
    type: 'get',
    url: vue.url.getUrl,
    data: {page: vue.currentPage, table: vue.table},
    success: function(result) {
      if(result.code === 0) {
        vue.items = result.data.items;
        vue.pageCount = result.data.pageCount;
        vue.pages = getPages(vue.currentPage, vue.pageCount);
      } else {

      }
    }
  } );
}

/*
* 公用的添加模块
*/
ajaxOpt.signupItem = function(vue) {
  ajax({
    type: 'post',
    url: vue.url.signupUrl,
    data: vue.signupForm,
    success: function(result) {
      if(result.code === 0) {
        ajaxOpt.getItems(vue);
      } else {
        
      }
      alert(result.message);
    }
  } );
}

/*
*公用的修改模块
*/
ajaxOpt.resetItem = function(vue) {
  ajax({
    type: 'post',
    url: vue.url.resetUrl,
    data: vue.resetForm,
    success: function(result) {
      alert(result.message);
      if (vue.reload) {
        ajaxOpt.getItems(vue);
      }
    }
  } );
}

/*
*公用的删除模块
*/
ajaxOpt.deleteItem = function(vue, id) {
  ajax({
    type: 'post',
    url: vue.url.deleteUrl,
    data: {id: id},
    success: function(result) {
      if(result.code === 0) {
        ajaxOpt.getItems(vue);
      } else {
        
      }
      alert(result.message);
    }
  } );
}
/*
*获取csrftoken
*/
ajaxOpt.getCsrf = function() {
  ajax({
    type: 'get',
    url: '/csrf',
    success: function(result) {
      if(result.code === 0) {
        ajaxOpt.csrf = result.data.csrfToken
      } else {
      }
     
    }
  } );
}

ajaxOpt.upload = function(vue) {
  ajax({
    type: 'post',
    url: '/upload?_csrf=' + ajaxOpt.csrf,
    data: vue.fileData,
    contentType: false,
    processData: false,
    success: function(result) {
      if(result.code === 0) {
        vue.rewards = result.data.rewards;
      } else {
        alert(result.message);
      }
     
    }
  } );
}
ajaxOpt.sendCoin = function(vue) {
    ajax({
      type: 'post',
      url: '/transfer',
      data: vue.sb,
      success: function(result) {
        if(result.code === 0) {
          vue.rewards = result.data.rewards;
        } else {
          alert(result.message);
        }
      },
      error: function(event, XMLHttpRequest, ajaxOptions, thrownError) {
        alert(event.responseJSON.code);
      }
    } );
}
ajaxOpt.getBatches = function(vue) {
  ajax({
    type: 'get',
    url: '/batches',
    data: {},
    success: function(result) {
      if(result.code === 0) {
        vue.batches = result.data.batches;
      } else {
        alert(result.message);
      }
    },
    error: function(event, XMLHttpRequest, ajaxOptions, thrownError) {
      alert(event.responseJSON.code);
    }
  } );
}
ajaxOpt.getOrderInfo = function(batch_id,vue) {
  ajax({
    type: 'get',
    url: '/orders',
    data: { batch_id },
    success: function(result) {
      if(result.code === 0) {
        vue.orders = result.data.orders;
      } else {
        alert(result.message);
      }
    },
    error: function(event, XMLHttpRequest, ajaxOptions, thrownError) {
      alert(event.responseJSON.code);
    }
  } );
}
export default ajaxOpt;