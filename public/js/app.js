/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */


/* hard-coded data! */
/*
var sampleAlbums = [];
sampleAlbums.push({
             artistName: 'Ladyhawke',
             name: 'Ladyhawke',
             releaseDate: '2008, November 18',
             genres: [ 'new wave', 'indie rock', 'synth pop' ]
           });
sampleAlbums.push({
             artistName: 'The Knife',
             name: 'Silent Shout',
             releaseDate: '2006, February 17',
             genres: [ 'synth pop', 'electronica', 'experimental' ]
           });
sampleAlbums.push({
             artistName: 'Juno Reactor',
             name: 'Shango',
             releaseDate: '2000, October 9',
             genres: [ 'electronic', 'goa trance', 'tribal house' ]
           });
sampleAlbums.push({
             artistName: 'Philip Wesley',
             name: 'Dark Night of the Soul',
             releaseDate: '2008, September 12',
             genres: [ 'piano' ]
           });
*/
/* end of hard-coded data */

function handleSuccess (json){
  console.log(json);
}

function handleError(json){
  console.log(json);
}

$(document).ready(function() {
  console.log('app.js loaded!');
  $.get('/api/albums')
  .done(function(data){
    var kanyeAlbums = data;
      console.log(kanyeAlbums);
      kanyeAlbums.forEach(function(album){
        renderAlbum(album);
    });
  });

  // new album
  $("#newAlbum").on("submit", function(event) {
    console.log("button clicked?");
    event.preventDefault();
    // serialize
    var formdata = $(this).serialize();
      console.log(formdata);
    $.ajax({
      method: "POST",
      url: "/api/albums",
      data: formdata,
      success: handleSuccess,
      error: handleError
    });
    $(this).trigger("reset");
  });

  // build song list
  function buildSongsHtml(songs) { 
    console.log(songs);
    var songText = " – "; 
    songs.forEach(function(song) { 
      songText = songText + "(" + song.trackNumber + ") " + song.name + " — ";
    }); 
    return songText; 
  }

  // add song button
  $('#albums').on('click', '.add-song', function(event){
    console.log('add song button clicked');
    var id = $(this).parents('.album').data('album-id');
    console.log('id', id);
    $('#songModal').data('album-id', id);
    $('#songModal').modal();
  });


  // new song submit
  // call this when the button on the modal is clicked
  function handleNewSongSubmit(event) {
      event.preventDefault();
      
      // get data from modal fields
      newSongName = $("#songName").val();
      newSongTrack = $("#trackNumber").val();
      
      // POST to SERVER
      $("#saveSong").on("submit", function(event) {
        var newSongData = $(newSongName + newSongTrack);
        console.log(newSongData);

      // clear form
      $(this).trigger("reset");

      // close modal
      $(this).modal("close");
      // update the correct album to show the new song

      // need the album-id in order to build the correct URL for the AJAX POST.
      // URL will eventually be like http://localhost:3000/api/albums/:album_id/songs. 
      // In the handleNewSongSubmit function get the correct id from the modal. 
      // Build the URL and save it as a variable.
      // Prepare the AJAX POST.
      $.ajax({
        method: "POST",
        url: "/api/:album_id/songs",
        data: "newSongVal",
        success: "handleSuccess",
        error: "handleError"
      }); 
      // For data make sure you get the .val from the input fields. 
      // Don't forget to call handleNewSongSubmit when the modal button is clicked.
      // Hint: The modal doesn't actually have a form.
      // Use .val to get the data from the input fields and construct an object for your POST data.

    });
    handleNewSongSubmit();
    console.log("#songName");
    console.log("#trackNumber");
  }

  // new album
  // $("#newAlbum").on("submit", function(event) {
  //   console.log("button clicked?");
  //   event.preventDefault();
  //   // serialize
  //   var formdata = $(this).serialize();
  //     console.log(formdata);
  //   $.ajax({
  //     method: "POST",
  //     url: "/api/albums",
  //     data: formdata,
  //     success: handleSuccess,
  //     error: handleError
  //   });
  //   $(this).trigger("reset");
  // });


// this function takes a single album and renders it to the page
function renderAlbum(album) {
  console.log('rendering album:', album);
  var albumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + album._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + "http://placehold.it/400x400'" +  " alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + album.name + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" + album.artistName + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-releaseDate'>" + album.releaseDate  + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Genres:</h4>" +
  "                        <span class='album-releaseDate'>" + album.genres  + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Songs:</h4>" +
  "                        <span class='albumSongs'>" + buildSongsHtml(album.songs) + "</span>" +
  "                      </li>" + 
  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +
  "              </div>" + // end of panel-body
  "              <div class='panel-footer'>" +
  "                <button class='btn btn-primary add-song'>Add Song</button>" +
  "              </div>" +
  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";

  // render to the page with jQuery
  $('#albums').append(albumHtml);

}

});




