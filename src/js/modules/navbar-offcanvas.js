// _offcanvas.js
import $ from 'jquery';

const bootstrapDeviceSize = () => {
  return $('#device-size-detector').find('div:visible').first().attr('id');
};

const onResize = () => {
  const screen = bootstrapDeviceSize();

  // Offcanvas effect on md screen
  const cssNav = 'nav-offcanvas';
  const cssBody = 'body-offcanvas';
  if (screen == 'sm') {
    $('.js-navbar').addClass(cssNav);
    $('body').addClass(cssBody);
  } else {
    $('.js-navbar').removeClass(cssNav);
    $('body').removeClass(cssBody);
  }

  /*
  // Get height and width
  var height = $(window).height();
  var width = $(window).width();
  console.log('Offcanvas resize: ', `height=${height}, width=${width}`);
  if (width < 992) {
    $('.js-navbar').addClass(cssNav);
    $('body').addClass(cssBody);
  } else {
    $('.js-navbar').removeClass(cssNav);
    $('body').removeClass(cssBody);
  }
  */
};
$(function () {
  // Check on load
  onResize();

  // Check on resize
  let resizeTimer;
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Run code here, resizing has 'stopped'
      onResize();
    }, 250);
  });

  $('[data-toggle="offcanvas"]').on('click', function () {
    $('.js-navbar-collapse').toggleClass('open');
  });
});

