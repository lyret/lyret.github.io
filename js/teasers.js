
/* ==========================================================================
   Custom javascript
   ========================================================================== */


// Create a video background

/*
$('body').videoBG({
	position:"fixed",
	zIndex:-1,
	mp4:'img/AdolescentSaltyKoala.mp4',
	webm:'img/AdolescentSaltyKoala.webm',
	poster: 'img/AdolescentSaltyKoala-poster.jpg',
	opacity:.5,
	sclae: true,
	loop: true
});
*/

// Create a function for correcting the backgrounds size

function correctBackground() {
        $('.videoBG').css("min-width",$( window ).width());
        $('.videoBG').css("min-height",$( window ).height());
        $('.videoBG').css("height","auto");
}

$( window ).resize(correctBackground); // Trigger it on window resize
correctBackground(); // Trigger on window load


// Blink all elements on page load
setTimeout(
  function() 
  {
    $('.blink').addClass('active');
  }, 100);
                
setTimeout(
  function() 
  {
    $('.blink').removeClass('active').addClass('done');
  }, 1100);