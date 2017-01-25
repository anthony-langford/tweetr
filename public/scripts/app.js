$(document).ready(function() {

  function createTweetElement(tweet) {
    let date = new Date(tweet.created_at).toString().slice(0, 15);
    let h1 = $("<h1>").text(tweet.user.name);
    let imgURL = $("<img>").attr("src", tweet.user.avatars.large);
    let span = $("<span>").text(tweet.user.handle);
    let header = $("<header>").append(imgURL).append(h1).append(span);
    let div = $("<div>").text(tweet.content.text);
    let footer = $("<footer>").append("<span>").text(date);
    let $tweet = $("<article>").addClass("tweet").append(header).append(div).append(footer);
    return $tweet;
  }

  function renderTweets(tweets) {
    tweets.forEach(function(tweet) {
      let $tweet = createTweetElement(tweet);
      $('#tweets-container').prepend($tweet);
    });
  }

  function loadTweets() {
    $(function() {
      console.log('Performing ajax call...');
      $.ajax({
        url: "/tweets/",
        type: "GET",
        success: function (data) {
          console.log("Success: ", data);
          renderTweets(data);
        }
      });
    });
  }

  $(function() {
    let $post = $("form input");
    $post.click(function() {
      let tweetData = $("form").serialize();
      event.preventDefault()
      console.log("Button clicked, performing Ajax call...");
      if (tweetData === "text=") {
        console.log("Empty form");
        if ($("alert")) {
          $("alert").remove();
          let alert = $("<alert>").addClass("alert").text("You can't send an empty tweet!");
          $(".new-tweet").append(alert);
          return;
        } else {
          let alert = $("<alert>").addClass("alert").text("You can't send an empty tweet!");
          $(".new-tweet").append(alert);
          return;
        }
      } else if (unescape(tweetData.slice(5)).length > 140) {
        console.log("tweetData.slice(5)).length > 140");
        if ($("alert")) {
          $("alert").remove();
          let alert = $("<alert>").addClass("alert").text("Your tweet is too long!");
          $(".new-tweet").addClass("alert").append(alert);
          return;
        } else {
          let alert = $("<alert>").addClass("alert").text("Your tweet is too long!");
          $(".new-tweet").addClass("alert").append(alert);
          return;
        }
      } else {
        if ($("alert")) {
          $("alert").remove();
          $.ajax({
            url: "/tweets/",
            type: "POST",
            data: tweetData,
            success: function(newTweet) {
              console.log("Success", newTweet);
              loadTweets();
            }
          });
        } else {
          $.ajax({
            url: "/tweets/",
            type: "POST",
            data: tweetData,
            success: function(newTweet) {
              console.log("Success", newTweet);
              loadTweets();
            }
          });
        }
      }
    });
  });

  $(function() {
    let $compose = $("button");
    $compose.click(function() {
      $(".new-tweet").slideToggle(400, function(){
        $("form textarea").focus();
      });
    });
  });

  loadTweets();
});