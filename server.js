// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');

// generate a new express app and call it 'app'
var app = express();
var bodyParser = require('body-parser');
var util = require('util');

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

// body parser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/************
 * DATABASE *
 ************/
const db = require('./models');

/* hard-coded data */
/*
var albums = [];
albums.push({
              _id: 132,
              artistName: 'the Old Kanye',
              name: 'The College Dropout',
              releaseDate: '2004, February 10',
              genres: [ 'rap', 'hip hop' ]
            });
albums.push({
              _id: 133,
              artistName: 'the New Kanye',
              name: 'The Life of Pablo',
              releaseDate: '2016, Febraury 14',
              genres: [ 'hip hop' ]
            });
albums.push({
              _id: 134,
              artistName: 'the always rude Kanye',
              name: 'My Beautiful Dark Twisted Fantasy',
              releaseDate: '2010, November 22',
              genres: [ 'rap', 'hip hop' ]
            });
albums.push({
              _id: 135,
              artistName: 'the sweet Kanye',
              name: '808s & Heartbreak',
              releaseDate: '2008, November 24',
              genres: [ 'r&b', 'electropop', 'synthpop' ]
            });
*/

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

// get all albums
app.get('/api/albums', function album_index(req, res) {
  db.Album.find({}, function(err, albums) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(albums);
  });
});

// post new album
app.post('/api/albums', function album_new(req, res) {
  db.Album.create({
    artistName: req.body.artistName,
    name: req.body.name,
    releaseDate: req.body.releaseDate,
    genres: [req.body.genres]
  }, function(err, doc) {
    if (err) {
      console.log("error: " + err);
      return;
    }
    doc.save();
  });
  res.json(req.body);
});

// songs post route
app.post('/api/albums/:album_id/songs', function(req, res) {
  console.log("song post route is up?");
  console.log(req.params);
  console.log('req.body.song: ' + req.body.song + ' req.body.trackNumber: ' + req.body.trackNumber);
  db.Album.findOne({ '_id': req.params.album_id }, function(err, doc) {
    if(err) throw err;
    doc.songs.push({ name: req.body.song, trackNumber: req.body.trackNumber });
    console.log('after push: ' + doc.songs);
    doc.save(function(err, savedDoc) {
      res.json(doc);
    });
  });
});

// song get route
app.get('/api/albums/:id', function(req, res) {
  db.Album.findOne({ '_id': req.params.id }, function(err, doc) {
    if (err) throw err;
    console.dir('get doc: ' + doc);
    res.json(doc);
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
