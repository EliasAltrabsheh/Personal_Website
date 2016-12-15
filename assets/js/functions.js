$(window).scroll(function(){
  youtubeVideoScroll();
});

function youtubeVideoScroll(){
  var wScroll = $(window).scrollTop();

  $('.video-strip').css('background-position','center -' + wScroll +'px');

}
