$(document).ready(function() {
  let composeButton = $(".composeButton");
  let loginButton = $(".loginButton");
  let registerButton = $(".register .submitButton");
  let logoutButton = $(".logoutButton");
  let userLoggedIn = false;

  if (userLoggedIn === true) {
    composeButton.show();
    logoutButton.show();
    loginButton.hide();
    registerButton.hide();
  } else {
    composeButton.hide();
    logoutButton.hide();
    loginButton.show();
    registerButton.show();
  }

  function createTweetElement(tweet) {
    let date = new Date(tweet.created_at).toString().slice(0, 15);
    let imgURL = $("<img>").attr("src", tweet.user.avatars.large);
    let h1 = $("<h1>").text(tweet.user.name);
    let spanUser = $("<span>").text(tweet.user.handle);
    let header = $("<header>").append(imgURL).append(h1).append(spanUser);
    let div = $("<div>").text(tweet.content.text);
    let spanDate = $("<span>").text(date);
    let likeButton = $(`<i class="likeButton fa fa-heart-o" aria-hidden="true"></i>`);
    let footer = $("<footer>").append(spanDate).append(likeButton);
    let newTweet = $("<article>").addClass("tweet")
      .append(header)
      .append(div)
      .append(footer);
    newTweet[0].dataset.owner = tweet.user.handle;
    newTweet[0].dataset.likes = tweet.likes;
    newTweet[0].dataset.id = tweet._id;
    newTweet[0].dataset.liked = false;
    return newTweet;
  }

  function renderTweets(tweets) {
    tweets.forEach(function(tweet) {
      let newTweet = createTweetElement(tweet);
      $('#tweets-container').prepend(newTweet);
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
          // need to loop through data which is array of objects (tweets)
          // and check if user handle is in tweets
          renderTweets(data);
        }
      });
    });
  }

  // Submit new tweet POST
  $(function() {
    let post = $(".new-tweet input");
    post.click(function() {
      let tweetData = $(".new-tweet form").serialize();
      event.preventDefault();
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

  function getUsers() {
    $(function() {
      console.log("Getting users from mongodb");

    });
  }

  // Slide toggle new tweet div
  $(function() {
    composeButton.click(function() {
      $(".new-tweet").slideToggle(400, function(){
        $("form textarea").focus();
      });
    });
  });

  // Submit register
  $(function() {
    registerButton.click(function() {
      let userData = $(".register").serialize();
      event.preventDefault();

      console.log('Performing ajax call...');
      $.ajax({
        url: "/tweets/register",
        type: "POST",
        data: userData,
        success: function() {
          if ($("alert")) {
            $("alert").remove();
          }
          userLoggedIn = true;
          composeButton.show();
          logoutButton.show();
          loginButton.hide();
          registerButton.hide();
          console.log("Successful user registration");
          loadTweets();
        },
        error: function() {
          console.log("Unsuccessful user registration");
          let alert = $("<alert>").addClass("alert").text("That handle is taken!");
          $(".register").addClass("alert").append(alert);
        }
      });
    });
  });

  // Login
  $(function() {
    loginButton.click(function() {
      let userData = $(".login").serialize();
      event.preventDefault();
      if (userData === "handle=") {
        if ($("alert")) {
          $("alert").remove();
          let alert = $("<alert>").addClass("alert").text("You need to enter a handle to login dummy!");
          $(".login").addClass("alert").append(alert);
        }
        return;
      }
      console.log('Performing ajax call...');
      $.ajax({
        url: "/tweets/login",
        type: "POST",
        data: userData,
        success: function() {
          if ($("alert")) {
            $("alert").remove();
          }
          console.log("Successful login");
          userLoggedIn = true;
          composeButton.show();
          logoutButton.show();
          loginButton.hide();
          registerButton.hide();
          loadTweets();
        },
        error: function() {
          console.log("Unsuccessful login - user doesn't exist");
          if ($("alert")) {
            $("alert").remove();
            let alert = $("<alert>").addClass("alert").text("That handle hasn't been registered!");
            $(".login").addClass("alert").append(alert);
          }
        }
      });
    });
  });

  // Logout
  $(function() {
    logoutButton.click(function() {
      event.preventDefault();
      console.log('Performing ajax call...');
      $.ajax({
        url: "/tweets/logout",
        type: "POST",
        success: function() {
          console.log("Successful logout");
          userLoggedIn = false;
          composeButton.hide();
          logoutButton.hide();
          loginButton.show();
          registerButton.show();
        }
      });
    });
  });

  $(function() {
    $("#tweets-container").on("click", ".likeButton", function() {
      var likesArray = $(this).data("likes");
      $(this).toggleClass('fa-heart-o fa-heart');
      // let tweetId = $(this).parents(".tweet").data("id");
      // $.ajax({
      //   url: "/tweets/like",
      //   type: "POST",
      //   data: tweetId,
      //   success: function(tweet) {
      //     console.log("Successful like");
      //   }
      // });
    });
  });

  loadTweets();
});