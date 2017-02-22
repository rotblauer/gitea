/*!
 *  Howler.js Audio Player Demo
 *  howlerjs.com
 *
 *  (c) 2013-2016, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

/**
 * Player class containing the state of our playlist and where we are in it.
 * Includes all methods for playing, skipping, updating the display, etc.
 * @param {Array} playlist Array of objects with playlist song details ({file, howl}).
 */
var Player = function(playlist) {
    this.playlist = playlist;
    this.index = 0;
    $("#songs-list").html('');

    // Setup the playlist display.
    playlist.forEach(function(song) {
        var div = $('<div></div>');
        div.addClass('list-song');
        div.html(song.file.substring(7));
        div.on("click", function () {
            $("#song-loading").show();
            if (typeof(getWS()) !== "undefined") {
                getWS().send("~~~"+playlist.indexOf(song));
            }
            player.skipTo(playlist.indexOf(song));
        });
        $("#songs-list").append(div);
    });
};

Player.prototype = {
    /**
     * Play a song in the playlist.
     * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
     */
    play: function(index) {
        var self = this;
        var sound;

        index = typeof index === 'number' ? index : self.index;
        var data = self.playlist[index];

        // If we already loaded this track, use the current one.
        // Otherwise, setup and load a new Howl.
        if (data.howl) {
            sound = data.howl;
        } else {
            sound = data.howl = new Howl({
                src: [data.file],
                html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
                onend: function() {
                    self.skipTo(index + 1);
                },
                onload: function () {
                    $("#song-loading").hide();
                }
            });
        }

        // Begin playing the sound.
        sound.play();

        // Show the pause button.
        if (sound.state() === 'loaded') {
        } else {
            $("#song-loading").show();
        }

        $(".list-song").each(function (i, el) {
            if ($(el).text() !== data.file.substring(7)) {
                $(el).removeClass("playing");
            } else {
                $(el).addClass("playing");
            }
        });

        // // Update the track display.
        // track.innerHTML = (index + 1) + '. ' + data.title;

        // Keep track of the index we are currently playing.
        self.index = index;
    },

    /**
     * Skip to the next or previous track.
     * @param  {String} direction 'next' or 'prev'.
     */
    skip: function(direction) {
        var self = this;

        // Get the next track based on the direction of the track.
        var index = 0;
        if (direction === 'prev') {
            index = self.index - 1;
            if (index < 0) {
                index = self.playlist.length - 1;
            }
        } else {
            index = self.index + 1;
            if (index >= self.playlist.length) {
                index = 0;
            }
        }

        self.skipTo(index);
    },

    /**
     * Skip to a specific track based on its playlist index.
     * @param  {Number} index Index in the playlist.
     */
    skipTo: function(index) {
        var self = this;

        // Stop the current track.
        if (self.playlist[self.index].howl) {
            self.playlist[self.index].howl.stop();
        }

        // Play the new track.
        self.play(index);
    }
};

var player;

$(function () {

    $.getJSON("/r/music", function(files) {
        var playables = [];
        for (var i = 0; i < files.length; i++) {
            if (files[i].indexOf(".mp3") < 0) { continue; } // filter out the album covers
            playables.push({
                file: files[i].substring(6),
                howl: null
            });
        }
        player = new Player(playables);
    });

    var songsSearcher = $("input#songs-filterer");
    songsSearcher.keyup(function (e) {
        var $this = $(this);
        var keyword = $this.val();

        if (keyword.length > 1) {
            $(".list-song").each(function (i, el) {
                if ($(this).text().toLowerCase().indexOf(keyword.toLowerCase()) < 0) {
                    $(this).hide();
                }
            });
        } else {
            $(".list-song").show();
        }
    });
});

// // Setup our new audio player class and pass it the playlist.
// var player = new Player([
//   {
//     file: 'rave_digger',
//     howl: null
//   },
//   {
//     file: '80s_vibe',
//     howl: null
//   },
//   {
//     file: 'running_out',
//     howl: null
//   }
// ]);

// prevBtn.addEventListener('click', function() {
//     player.skip('prev');
// });
// nextBtn.addEventListener('click', function() {
//     player.skip('next');
// });
