var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapedassignment";

mongoose.connect(MONGODB_URI), { useNewUrlParser: true };

app.get("/scrape", function(req, res) {
  axios.get("https://www.buzzfeed.com").then(function(response) {
    var $ = cheerio.load(response.data);

    $('div.xs-px05').each(function() {
      var result = {};

      result.link = $(this)
      .find('a')
      .attr('href');
      result.title = $(this)
      .find('a')
      .text();
      result.summary = $(this)
     .children('p')
      .text();
      
      db.Article.create(result)
      .then(function(dbArticle) {
        console.log(dbArticle);
      })
      .catch(function(err) {
        console.log(err);
      })
    
    
    });
    res.send("Scrape Complete");
  });
});


app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    })
});


app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    })
});

app.post("/articles/:id", function(req, res) {
  db.Comment.create(req.body)
  .then(function(dbComment) {
    return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbComment._id }, { new: true });
  }).then(function(dbArticle) {
    res.json(dbArticle);
  })
  .catch(function(err) {
    res.json(err);
  })
});

app.get("/saved-comments", function(req,res) {
  db.Comment.find({})
  .populate("comment")
  .then(function(dbComment) {
    res.json(dbComment)
  })
  .catch(function(err) {
    res.json(err)
  })
})

app.delete("/saved-comments/:id", function(req, res) {
  db.Comment.remove( {_id: req.params.id} )
  .then(function(dbComment) {
    res.json(dbComment)
    console.log(dbComment)
  })
  .catch(function(err) {
    res.json(err)
  })

})


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});