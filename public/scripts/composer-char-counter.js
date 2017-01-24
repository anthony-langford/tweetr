$(document).ready(function() {
  $(".new-tweet textarea").on('input', function() {
      let lettersLeft = 140;
      let text = $(this).val();
      lettersLeft -= text.length;
      if (lettersLeft < 0) {
        $(this).siblings(".counter").text(lettersLeft).css("color", "red");
      } else {
        $(this).siblings(".counter").text(lettersLeft).css("color", "black");
      }
  });
});