/*  Approximate schema for these seeds

var SongSchema = new Schema({
  name: String,
  trackNumber: Number,
});
*/
var db = require("./models");


var sampleSongs = [];

sampleSongs.push({ name: 'Famous',
                   trackNumber: 1
});
sampleSongs.push({ name: "All of the Lights",
                   trackNumber: 2
});
sampleSongs.push({ name: 'Guilt Trip',
                   trackNumber: 3
});
sampleSongs.push({ name: 'Paranoid',
                   trackNumber: 4
});
sampleSongs.push({ name: 'Ultralight Beam',
                   trackNumber: 5
});
sampleSongs.push({ name: 'Runaway',
                   trackNumber: 6
});
sampleSongs.push({ name: 'Stronger',
                   trackNumber: 7
});


db.Album.remove({}, function(err, songs){

  db.Album.create(sampleSongs, function(err, songs){

    if (err) { return console.log('ERROR', err); }
    console.log("all songs:", songs);
    console.log("created", songs.length, "songs");
    process.exit();
  });
});

