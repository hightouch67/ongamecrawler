const express = require('express');
const decamelize = require('decamelize');
const _ = require('lodash');
var mysql = require('mysql');
const router = express.Router();
const sql = require('mssql')
const steem = require('steem');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var Crawler = require("crawler");

steem.api.setOptions({ url: 'https://api.steemit.com' });


router.get('/', (req, res) => {
  res.json({ hello: 'world' });
});


function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({ "error": message });
}

router.get("/crawler/:url(*)", function (req, res) {
  var c = new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function (error, result, done) {
      if (error) {
        console.log(error);
      } else {
        var $ = result.$;
        var result = {}
        result.title = $("title").text()
        result.image = $("meta[property='og:image']").attr("content")
        result.description = $("meta[property='og:description']").attr("content")
        result.url = $("meta[property='og:url']").attr("content")
        result.body =  $("body").html()
        // // $ is Cheerio by default
        // console.log($("body").text());
        // //a lean implementation of core jQuery designed specifically for the server
        // console.log($("title").text());
        // console.log($("description").text());
        // console.log($("url").text());
        res.json(result)
      }
      done();
    }
  });
  c.queue(req.params.url);
})

module.exports = router;