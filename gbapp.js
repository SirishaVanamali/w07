var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");

var app = express();  // make express app
app.use(express.static(__dirname + '/assets'));
var server = require('http').createServer(app);

// set up the view engine
app.set("views", path.resolve(__dirname, "views")); // path to views
app.set('view engine', 'ejs');
// End of view engine setup

// manage our entries
var entries = [];
app.locals.entries = entries;


// set up the logger 
//only log error responses
app.use(logger("dev"));
/*app.use(logger('combined',{
  skip: function (req, res) { return res.statusCode < 400 }
}));*/
// End of logger
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname+'/assets/')));
// GETS
app.get("/", function(req,res){
	res.render("index");
});

app.get("/new-entry", function(req,res){
	res.render("new-entry");
});
// ENd of GET request handling

// POSTS
app.post('/new-entry',function(req,res){
   if (!req.body.title || !req.body.body) {
    res.status(400).send("Entries must have a title and a body.");
    return;
  }
  entries.push({
    author: req.body.author,
    title: req.body.title,
    content: req.body.body,
    published: new Date()
  });
  res.redirect("/");
});

// 404
app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});	
//End of 404 error handling

// Listen for an application request on port 8081
server.listen(8081, function () {
  console.log('Guestbook app listening on http://127.0.0.1:8081/');
});
