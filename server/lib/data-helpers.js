"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, (err, result) => {
        if (err) {
          return callback(err);
        }
        console.log("Inserted a document into the restaurants collection.");
        callback();
      });
    },

    // Get all tweets in `db`
    getTweets: function(callback) {
      db.collection("tweets").find().toArray((err, tweet) => {
        if (err) {
          return callback(err);
        }
        callback(null, tweet);
      });
    }

  };
}
