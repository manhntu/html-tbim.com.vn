import $ from 'jquery';

$(function () {
  // console.log('Webpack loaded!');
  // $('body').addClass('bg-light');
});

// Defining event listener function
function displayWindowSize() {
  // Get width and height of the window
  // excluding scrollbars
  const w = document.documentElement.clientWidth;
  // const h = document.documentElement.clientHeight;

  // Display result inside a div element
  const collection = document.getElementsByClassName('slide-triangle');
  if (collection && collection[0]) {
    collection[0].style.borderLeftWidth = `${w}px`;
  }

  const collection1 = document.getElementsByClassName('triangle-down');
  if (collection1 && collection1[0]) {
    const hParent = collection1[0].parentElement.offsetHeight;
    collection1[0].style.borderTopWidth = `${hParent}px`;
  }
}

// Attaching the event listener function
// to window's resize event
window.addEventListener('resize', displayWindowSize);

// Calling the function for the first time
displayWindowSize();
