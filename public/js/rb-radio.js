
// Set up music.
var sound = new Howl({
    src: ['/music/cocaine-blues.mp3']
});

// define short of 'a'
key('a', function(){ sound.play(); });
