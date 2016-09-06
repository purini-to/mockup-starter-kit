$(function () {
  var commonFunc = {};
  commonFunc.closeSideMenu = closeSideMenu;
  window.$commonFunc = commonFunc;

  $('#nav-btn').on('click', function () {
    $('#side-nav').addClass('open');
    $('<div></div>', { class: 'mask-overlay', id: 'mask-overlay' })
      .on('click', closeSideMenu)
      .appendTo('body');
  });

  function closeSideMenu() {
    $('#side-nav').removeClass('open');
    $('#mask-overlay').remove();
  }
});