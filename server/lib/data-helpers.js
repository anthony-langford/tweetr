"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  const tweets = db.collection("tweets");
  const users = db.collection("users");
  const ObjectId = require('mongodb').ObjectId;
  return {

    // Saves a tweet to 'tweets' collection
    saveTweet: function(newTweet, callback) {
      tweets
        .insertOne(newTweet, (err, result) => {
          if (err) {
            return callback(err);
          }
          console.log("Inserted a document into the tweets collection.");
          callback();
        });
    },

    // Get all tweets from 'tweets' collection in 'tweeter' db
    getTweets: function(callback) {
      tweets
        .find()
        .toArray((err, tweets) => {
          if (err) {
            return callback(err);
          }
          console.log("Retrieved all tweets from tweets collection")
          callback(null, tweets);
        });
    },

    // Register new user in 'users' collection in 'tweeter' db
    registerUser: function(newUser, callback) {
      users
        .insertOne(newUser, (err, result) => {
          if (err) {
            return callback(err);
          }
          console.log("Inserted a document into the users collection.");
          callback();
        });
    },

    // Check 'users' collection for user account
    loginUser: function(userData, callback) {
      console.log("Checking database for user info");
      users
        .find({ "handle" : userData })
        .toArray((err, user) => {
          if (err) {
            return callback(err);
          }
          if (user.length === 0) {
            let error = new Error("Email has not been registered");
            callback(error);
          } else {
            callback(null, user[0]);
          }
        });
    },

    // can't do nesting because asynchronous, need promises

    // updateLike: function(tweetId, userHandle, callback) {
    //   db.collection("tweets")
    //     .find( { "_id" : ObjectId(tweetId) } )
    //     .toArray((err, tweet) => {
    //       if (err) {
    //         return callback(err);
    //       }

    //       let liked = false;

    //       console.log(tweet);
    //       console.log(tweet.likes);

    //       for (let i = 0; i < tweet.likes.length; i++) {

    //         let handle = tweet.likes[i];
    //         if (handle === userHandle) {
    //           liked = true;
    //           let updatedLikes = tweet.likes.splice(i, 1);
    //           db.collection("tweets")
    //             .findOneAndUpdate( ({ "tweetId" : ObjectId(id) }, { $set: { "likes" : updatedLikes} }), (err, result) => {
    //               console.log("Updated a document in the users collection.");
    //               return callback();
    //             });
    //         }
    //       }
    //       if (liked = false) {
    //         db.collection("tweets")
    //           .findOneAndUpdate( ({"tweetId" : ObjectId(id)}, { $set: { "likes" : updatedLikes} }), (err, result) => {
    //             console.log("Updated a document in the users collection.");
    //             return callback();
    //           });
    //       }
    //     });
    // },

  };
}
