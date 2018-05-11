'use strict';
function util() {

}
util.moveItem = function(select, from, to, key) {
  select.forEach(val => {
    for (let i = 0; i < from.length; i++) {
      if (val === from[i][key]) {
        to.push(from[i]);
        from.splice(i, 1);
        break;
      }
    }
  });
};

util.getData = function(data, index, count) {
  if(data.length == 0) {
    return {filter: [], pages: [1], pageTotalCount: 1}
  }
  const newData = [];
  const totalCount = Math.ceil(data.length / count);
  if (index < 1) {
    index = 1;
  }
  if(index > totalCount) {
    index = totalCount;
  }

  const start = (index - 1 ) * count;
  const end = data.length - 1 > start + count ? start + count : data.length - 1;
  for(let i = start; i <= end; i++) {
    newData.push(data[i]);
  }
  const startPage = index - 2 > 1 ? index - 2 : 1;
  const endPage = index + 4 > totalCount ? totalCount :  index + 4;
  const pages = [];
  for (let i = startPage; i <= endPage; i ++) {
    pages.push(i);
  }
  return {filter: newData, pages: pages, pageTotalCount: totalCount};
};
export default util;