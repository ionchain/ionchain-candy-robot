import Vue from 'vue'
Vue.component('split-page', {
    props: ['current-page','pc'],
    data: function() {
        const pages = [];
        const currentPage = this.currentPage;
        const startPage = currentPage - 2 > 1 ? currentPage - 2 : 1;
        const endPage = currentPage + 4 > this.pc ? this.pc :  currentPage + 4;
        console.log('startpage',startPage);
        console.log('endpage',endPage);
        console.log('this.pageCount',this.pc);
        console.log(this);
        for (let i = startPage; i <= endPage; i ++) {
          pages.push(i);
        }
        return {
            pages: pages
        }
    },
    template: '<nav aria-label="Page navigation">' +
    '<ul class="pagination">' +
      '<li>' +
        '<a href="#" aria-label="Previous">' +
          '<span aria-hidden="true">&laquo;</span>' +
        '</a>' +
      '</li>' +
      '<li v-for="item in pages"><a href="#">{{item}}</a></li>'+
      '<li>' +
        '<a href="#" aria-label="Next">' +
          '<span aria-hidden="true">&raquo;</span>' +
        '</a>' +
      '</li>' +
    '</ul>' +
  '</nav>',
})