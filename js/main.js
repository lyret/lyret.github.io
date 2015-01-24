
/* ==========================================================================
   Custom javascript
   ========================================================================== */

// Create a video background

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

// Create a function for correcting the backgrounds size

function correctBackground() {
        $('.videoBG').css("width",$( window ).width());
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


                  
// Hide the Skype plugin default look and bind it to the skype service icon
$("#SkypeButton_Call_viktorlyresten_1").hide();
$("#skype-button").click(function() { $("#SkypeButton_Call_viktorlyresten_1_paraElement").children()[0].click(); });



// Find Apple Imessage compitable devices and update the sms link
p = navigator.platform;

if( p === 'iPad' || p === 'iPhone' || p === 'iPod' ){
    $("#sms-button").attr("href", "sms:viktor@lyresten.se");
}