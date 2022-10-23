import $ from 'jquery';

function setNavigation() {
  let path = window.location.pathname;
  path = path.replace(/\.[^/.]+$/, '');
  path = path.replace(/\.html$/, '');
  path = decodeURIComponent(path);
  console.log('path :>> ', path);
  const pathArr = path.split('/');
  console.log('pathArr :>> ', pathArr);
  const lastPath = pathArr[pathArr.length - 1];
  console.log('lastPath :>> ', lastPath);

  const isHome = (['', 'index', 'home'].indexOf(lastPath) !== -1);
  const currentTitle = document.title;
  // Check page is home
  if (isHome) {
    const newTitle = `${currentTitle} | Home`;
    document.title = newTitle;
    return;
  }

  // Check other page
  $('.js-nav-primary a').each(function () {
    const href = $(this).attr('href');
    console.log('href :>> ', href);

    if (href.indexOf(lastPath) !== -1) {
      // const name = path.replace(/\\|\//g, '');
      const nameCapitalizeFirstLetter = lastPath.charAt(0).toUpperCase() + lastPath.slice(1);

      // Set new title for page
      const newTitle = `${currentTitle} | ${nameCapitalizeFirstLetter}`;
      document.title = newTitle;
      // Set active menu
      $(this).closest('li').addClass('active');
    }
  });
}

$(function () {
  setNavigation();
});
