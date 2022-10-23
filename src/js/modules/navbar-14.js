// Link: https://colorlib.com/wp/template/website-menu-14/
import $ from 'jquery';

$(function () {
  $('nav .dropdown').on('hover', function () {
    const $this = $(this);
    $this.addClass('show');
    $this.find('> a').attr('aria-expanded', true);
    $this.find('.dropdown-menu').addClass('show');
  }, function () {
    const $this = $(this);
    $this.removeClass('show');
    $this.find('> a').attr('aria-expanded', false);
    $this.find('.dropdown-menu').removeClass('show');
  });
});
