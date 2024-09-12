// Get the button elements
let myBtn = document.getElementById("myBtn");
let jumpBtn = document.getElementById("jumpBtn");

// When the user scrolls down 20px from the top of the document, show the buttons
window.onscroll = function() { scrollFunction() };

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    myBtn.style.display = "block";  // Show "Top" button
    jumpBtn.style.display = "block"; // Show "Jump Down" button
  } else {
    myBtn.style.display = "none"; // Hide buttons if not scrolled down
    jumpBtn.style.display = "none";
  }
}

// Scroll to the top when the "Top" button is clicked
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
}

// Scroll down when the "Jump Down" button is clicked
function jumpDown() {
  window.scrollBy(0, window.innerHeight); // Scroll down by one viewport height
}

var slides = {}
// Disable right click and save as
document.addEventListener("contextmenu", function(event) {
  event.preventDefault();
});

document.addEventListener("keydown", function(event) {
  // Disable F12 key
  if (event.keyCode === 123) {
      event.preventDefault();
  }

  // Disable Ctrl+Shift+I keys
  if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
      event.preventDefault();
  }

  // Disable Ctrl+Shift+C keys
  if (event.ctrlKey && event.shiftKey && event.keyCode === 67) {
      event.preventDefault();
  }

  // Disable Ctrl+Shift+J keys
  if (event.ctrlKey && event.shiftKey && event.keyCode === 74) {
      event.preventDefault();
  }

  // Disable Ctrl+U keys
  if (event.ctrlKey && event.keyCode === 85) {
      event.preventDefault();
  }
});
function createSlides() {
  $("a.gallery-photo").each(function (photo_id, photo) {
    var slide = {
      w:     photo.getAttribute('data-width'),
      h:     photo.getAttribute('data-height'),
      msrc:  photo.getElementsByTagName('img')[0].getAttribute('src'),
      title: photo.getElementsByTagName('img')[0].getAttribute('alt'),
      date:  photo.getAttribute('data-date'),
    };

    if (photo.getAttribute('data-type') == 'image')
      slide['src'] = photo.getAttribute('href');
    else
      slide['html'] = '<video style="margin: 0px auto; height: 100%; max-width: 100%; max-height: 100%; display: block" data-index="' + photo.getAttribute('data-index') +
                      '" controls><source src="' + photo.getAttribute('href') + '" type="video/mp4"></video>';

    var gallery_id = photo.getAttribute('data-gallery');
    if (!(gallery_id in slides))
      slides[gallery_id] = [];

    slides[gallery_id].push(slide);
  });
}

function getThumbBounds(gallery, index) {
  var thumbnail = $('div.gallery a[data-gallery="'+gallery+'"][data-index="'+index+'"]')[0];
  var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
  var rect = thumbnail.getBoundingClientRect();
  return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
}

function addCaptionHTML(item, captionEl, isFake) {
  if(!item.title && !item.date) {
    captionEl.children[0].innerText = '';
    return false;
  }
  captionEl.children[0].innerHTML = item.title;
  if (item.date) {
    captionEl.children[0].innerHTML += '<p class="caption-date">' + item.date + '</p>';
  }
  return true;
}

function openPhotoSwipe() {
  var index = parseInt($(this).attr('data-index'))
  var gallery_id = $(this).attr('data-gallery')

  var options = {
    index: index,
    getThumbBoundsFn: function (id) { return getThumbBounds(gallery_id, id) },
    addCaptionHTMLFn: addCaptionHTML,
    preload: [2,5],
    zoomEl: false,
    shareEl: false,
    barsSize: {top:0, bottom:0},
    bgOpacity: 1,
    loop: false,
    mainClass: 'pswp--minimal--dark',
    
  };

  var gallery = new PhotoSwipe( $('.pswp')[0], PhotoSwipeUI_Default, slides[gallery_id], options);

  gallery.listen('initialZoomOut', function() {
    if (this.currItem.html) {
      var videos = $('div.pswp__item video[data-index='+this.getCurrentIndex()+']')
      if (videos.length > 0)
        videos[0].pause()
    }
  });

  gallery.listen('afterChange', function() {
    var videos = $('div.pswp__item video')
    for (var i=0; i<videos.length; ++i)
      videos[i].pause()

    if (this.currItem.html) {
      var videos = $('div.pswp__item video[data-index='+this.getCurrentIndex()+']')
      if (videos.length > 0)
        videos[0].play()
    }
  });

  gallery.init();

  return false;
}


$( document ).ready(function() {
  createSlides()
  $('div.gallery a').on('click', openPhotoSwipe)
});