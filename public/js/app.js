/* CLIENT-SIDE JS */
// You may edit this file as you see fit.  Try to separate different components
// into functions and objects as needed.

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

// document ready
$(document).ready(function() {
  console.log('app.js loaded!');
  $.ajax({url: '/api/albums', success: function(result) {
    result.forEach(renderAlbum);
  }});

  // new album
  $('#newAlbum').on('submit', function(event) {
    console.log('button clicked?');
    event.preventDefault();
    // serialize
    var formdata = $('#newAlbum').serialize();
      console.log(formdata);
    $.post('/api/albums', formdata).done(function() {
      console.log('form data posted');
      $.ajax({ url: '/api/albums', success:function(result) {
        var $albums = $('#albums');
        $albums.empty();
        result.forEach(renderAlbum);
      }});
    });
    $('form').trigger('reset');
  });

  // add song button / new song submit
  // call this when the button on the modal is clicked
  $('#albums').on('click', '.add-song', function(event){
    console.log('add song button clicked');
    var id = $(this).parents('.album').data('album-id');
    console.log('id', id);
    $('#songModal').data('album-id', id);
    $('#songModal').modal();
    $('#saveSong').click(function(event) {
      console.log(id);
      var $song = $('#songName').val();
      var $trackNumber = $('#trackNumber').val();
      var sendToAjax = {
        song: $song,
        trackNumber: parseInt($trackNumber)
      };
      console.log(sendToAjax.trackNumber + '. ' + sendToAjax.song);
      event.preventDefault();
      var URL = '/api/albums/' + id + '/songs';
      $.post(URL, sendToAjax).done(function() {
        $.ajax({url: '/api/albums/' + id, success: function(result) {
          console.dir(result);
          console.log(id);
          var $targetedAlbum = $('data-album-id[value=' + result._id + ']');
          $targetedAlbum.remove();
          renderAlbum(result);
        }});
      });
      $('#songModal').modal('hide');
    });
  });
});

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

function buildSongsHtml(songs) {
  var songText = '- ';
  var songsHTML = " ";
  songs.forEach(function(song) {
    songText = '(' + song.trackNumber + ') ' + song.name + ' -';
    songsHTML += songText + " ";
  });
  console.log(songsHTML);
  return songsHTML;
}
