var ws; // The websocket that is mostly for chatting cats. But this file is higher up.




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
    this.seeker = 0;
    this.nextSongLoad = {};

    // clear display out (was getting called 2x and i dunno why)
    $("#songs-list").html('');

    // Setup the playlist display.
    playlist.forEach(function(song) {
        var div = $('<div></div>');
        div.addClass('list-song ui row');
        div.html(song.file.substring(7));
        div.on("click", function() {
            if (player.index !== playlist.indexOf(song)) {
                player.skipTo(playlist.indexOf(song));
            }
        });
        $("#songs-list").append(div);
    });

    $("#songs-count").html(playlist.length + " songs");
};

Player.prototype = {
    /**
     * Play a song in the playlist.
     * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
     */
    play: function(index, seek) {
        var self = this;
        var sound;

        index = typeof index === 'number' ? index : self.index;
        seek = typeof seek === 'number' ? seek : 0;
        this.seeker = seek;


        var data = self.playlist[index];

        var dataSrc = self.nextSongLoad.index === index ? [self.nextSongLoad.data] : [data.file];

        // If we already loaded this track, use the current one.
        // Otherwise, setup and load a new Howl.
        if (data.howl) {
            sound = data.howl;
        } else {
            console.log("Playing from data src:", dataSrc);
            sound = data.howl = new Howl({
                src: dataSrc, //[data.file],
                html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
                format: ["mp3"],
                onend: function() {
                    self.skipTo(index + 1);
                },
                onload: function() {
                    $("#song-loading").hide();

                    // load next song by index
                    self.loadSong(index + 1);
                },
                onplay: function() {
                    setInterval(function() {
                        self.seeker = sound.seek();

                        // save locally
                        self.holdPosition(self.index, self.seeker);


                    }, 3000);
                }
            });
        }

        // Begin playing the sound.
        sound.play();
        sound.seek(this.seeker);

        // Show the pause button.
        if (sound.state() === 'loaded') {

        } else {
            console.log("Loading song", index);
            $("#song-loading").show();
        }
        $("#radio-readout").show();
        $("#current-song").html(data.file.substring(7));

        $(".list-song").each(function(i, el) {
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

        self.skipTo(index, 0);
    },

    /**
     * Skip to a specific track based on its playlist index.
     * @param  {Number} index Index in the playlist.
     */
    skipTo: function(index, seek) {
        var self = this;
        seek = typeof seek === "number" ? seek : 0;


        // Stop the current track.
        if (self.playlist[self.index].howl) {
            self.playlist[self.index].howl.stop();
        }

        // Play the new track.
        self.play(index, seek);
    },

    loadSong: function(index) {
        var self = this;


        index = typeof index === 'number' ? index : self.index;
        var data = self.playlist[index];

        console.log("Preloading ", data.file);

        var preload = new createjs.LoadQueue();
        preload.addEventListener("fileload", function(event) {

            console.log("Finished preloading.", event);
            // event.result <- song
            self.nextSongLoad = {
                index: index,
                data: event.result.src
            };
        });
        preload.loadFile(data.file);
    },
    holdPosition: function(index, seek) {
        // console.log("is", index, seek);
        var self = this;
        var i = index,
            s = seek;
        var d = {
            index: i,
            seek: s,
            time: new Date().getTime()
        };
        var ds = JSON.stringify(d);
        // work around for why it keeps iterating a lot
        if (s !== 0) {
            localStorage.setItem("radio_goggles", ds);
            if (typeof(ws) !== "undefined") {
                ws.send("~~~" + ds);
            }
        }
    },
    playFromHeldPosition: function() {
        var self = this;
        var ds = localStorage.getItem("radio_goggles");
        console.log("ds", ds);
        if (ds !== null) {
            var d = JSON.parse(ds);
            self.play(d.index, d.seek);
        } else {
            return;
        }
    }


}

var player;

$(function() {


    // these could be cached in localStorage too TODO
    $.getJSON("/r/music", function(files) {
        var playables = [];
        for (var i = 0; i < files.length; i++) {
            if (files[i].indexOf(".mp3") < 0) {
                continue;
            } // filter out the album covers
            playables.push({
                file: files[i].substring(6),
                howl: null
            });
        }
        player = new Player(playables);
		/* player.playFromHeldPosition();*/
    });



    var songsSearcher = $("input#songs-filterer");
    songsSearcher.keyup(function(e) {
        var $this = $(this);
        var keyword = $this.val();

        if (keyword.length > 1) {

            var count = 0;

            $(".list-song").each(function(i, el) {
                if ($(this).text().toLowerCase().indexOf(keyword.toLowerCase()) < 0) {
                    $(this).hide();
                } else {
                    $(this).show();
                    count++;
                }
            });
            $("#songs-count").html(count + " / " + player.playlist.length + " songs");

        } else {
            $(".list-song").show();
            $("#songs-count").html(player.playlist.length + " songs");
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
