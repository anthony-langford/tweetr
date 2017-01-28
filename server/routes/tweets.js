"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();

module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body' });
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      likes: []
    };

    DataHelpers.saveTweet(tweet, (err, tweet) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).end();
      }
    });
  });

  tweetsRoutes.post("/register", function(req, res) {
    if (!req.body.name) {
      res.status(400).json({ error: 'invalid request: no data in POST body' });
      return;
    }

    let randomAvatar = {};

    randomAvatar = userHelper.generateRandomAvatar(req.body.handle);
    console.log(randomAvatar);

    const newUser = {
      name: req.body.name,
      handle: req.body.handle,
      avatar: randomAvatar,
      created_at: Date.now()
    };

    DataHelpers.registerUser(newUser, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        req.session.user = req.body.handle;
        res.status(201).redirect("/");
      }
    });
  });

  tweetsRoutes.post("/login", function(req, res) {

    DataHelpers.loginUser(req.body.handle, (err, user) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        req.session.user = user.handle;
        res.status(200).json(user);
      }
    });
  });

  tweetsRoutes.post("/logout", function(req, res) {
    req.session = null;
    res.status(200).end();
  });

  // tweetsRoutes.post("/like", function(req, res) {
  //   DataHelpers.updateLike(req.body.tweetId, req.session.user, (err) => {
  //     if (err) {
  //       res.status(500).json({ error: err.message });
  //     } else {
  //       // tweet.likes.length();
  //       res.status(200).end();
  //     }
  //   });
  // });

  return tweetsRoutes;

}
