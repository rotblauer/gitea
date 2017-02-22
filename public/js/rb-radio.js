
// Set up music.
var sound = new Howl({
    src: ['/music/cocaine-blues.mp3'],
    html5: true // Set to true to force HTML5 Audio. This should be used for large audio files so that you don't have to wait for the full file to be downloaded and decoded before playing.
    , volume: 0.5
});

// define short of 'a'
key('shift+4', function(){
    if (sound.playing()) {
        sound.stop();
    }
    sound.play();
});

//turn it up to abc123
document.onkeypress = function (e) {
    if (sound.playing()) {
        var v = sound.volume();
        if (v < 0.99) {
            sound.volume(v+0.01);
        }
    }
}
