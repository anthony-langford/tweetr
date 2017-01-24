/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


// Test / driver code (temporary). Eventually will get this from the server.
// Fake data taken from tweets.json
// var data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": {
//         "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
//         "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
//         "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
//       },
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": {
//         "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
//         "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
//         "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
//       },
//       "handle": "@rd" },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   },
//   {
//     "user": {
//       "name": "Johann von Goethe",
//       "avatars": {
//         "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
//         "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
//         "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
//       },
//       "handle": "@johann49"
//     },
//     "content": {
//       "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
//     },
//     "created_at": 1461113796368
//   }
// ];

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
          // return;
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


