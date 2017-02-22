var playing = '';
var soundDefaults = {
    html5: true // Set to true to force HTML5 Audio. This should be used for large audio files so that you don't have to wait for the full file to be downloaded and decoded before playing.
    , volume: 0.5
};

function handleMusicLibrary(fsJSON) {

    // All records established by first letter in filename.
    // {'j':['folsom.mp3', 'fire.mp3'], 'f':['chicken.mp3', 'road.mp3']}
    var recordsArchive = {};

    for (var i = 0; i < fsJSON.length; i++) {

        var song = fsJSON[i];
        var hotkey = song.Name.split("-")[0]; // shift+4-01 - Folsom Prison Blues.mp3
        console.log(hotkey);

        if (!recordsArchive[hotkey]) {
            recordsArchive[hotkey] = [];
            recordsArchive[hotkey].push("/music/" + song.Name);
        } else {
            recordsArchive[hotkey].push("/music/" + song.Name);
        }
    }

    console.log('recordsArchive', recordsArchive);

    // These are the ones that actually play.
    var jukebox = {};

    for (prop in recordsArchive) {
        if (recordsArchive.hasOwnProperty(prop)) {

            console.log("recordsArchive[prop]", recordsArchive[prop]);

            var opts = soundDefaults;
            opts.src = recordsArchive[prop];

            jukebox[prop] = new Howl(opts); // set up default

            jukebox[prop].onplay = function (id) {
                playing = prop + "-" + id;
            };

            key(prop, function(){
                console.log("pressed", prop);
                if (playing !== '') {
                    jukebox[playing.split("-")[0]].stop();
                }
                jukebox[prop].play();
            });
        }
    }
}

$.getJSON("/r/music", handleMusicLibrary);


// Protip:
// cd johnnycash
// for file in *.mp3; do mv "$file" "j$file"; done
// rsync --avzLh --progress ./ freya:~/goggable.areteh.co/gogs/public/music/

// {Name: "j01 - Folsom Prison Blues.mp3", Size: 3903488, Mode: 420, ModTime: "2017-02-04T20:10:31+01:00", IsDir: false}
// 1{Name: "j02 - Busted (Unreleased Bonus Track).mp3", Size: 2035712, Mode: 420, ModTime: "2017-02-04T20:10:31+01:00", IsDir: false}
// 2{Name: "j03 - Dark as the Dungeon.mp3", Size: 4433920, Mode: 420, ModTime: "2017-02-04T20:10:31+01:00", IsDir: false}
// 3{Name: "j04 - I Still Miss Someone.mp3", Size: 2349056, Mode: 420, ModTime: "2017-02-04T20:10:33+01:00", IsDir: false}
// 4{Name: "j05 - Cocaine Blues.mp3", Size: 4354048, Mode: 420, ModTime: "2017-02-04T20:10:37+01:00", IsDir: false}
// 5{Name: "j06 - 25 Minutes to Go.mp3", Size: 5068800, Mode: 420, ModTime: "2017-02-04T20:10:37+01:00", IsDir: false}
// 6{Name: "j07 - Orange Blossom Special.mp3", Size: 4343808, Mode: 420, ModTime: "2017-02-04T20:10:39+01:00", IsDir: false}
// 7{Name: "j08 - The Long Black Veil.mp3", Size: 5705728, Mode: 420, ModTime: "2017-02-04T20:26:01+01:00", IsDir: false}
// 8{Name: "j09 - Send A Picture of Mother.mp3", Size: 3135488, Mode: 420, ModTime: "2017-02-04T20:10:42+01:00", IsDir: false}
// 9{Name: "j10 - The Wall.mp3", Size: 2320384, Mode: 420, ModTime: "2017-02-04T20:10:43+01:00", IsDir: false}
// 10{Name: "j11 - Dirty Old Egg Suckin Dog.mp3", Size: 2168832, Mode: 420, ModTime: "2017-02-04T20:10:43+01:00", IsDir: false}
// 11{Name: "j12 - Flushed form the Bathroom of Your Heart.mp3", Size: 3291136, Mode: 420, ModTime: "2017-02-04T20:10:45+01:00", IsDir: false}
// 12{Name: "j13 - Joe Bean (Unreleased Bonus Track).mp3", Size: 3493888, Mode: 420, ModTime: "2017-02-04T20:10:50+01:00", IsDir: false}
// 13{Name: "j14 - Jackson.mp3", Size: 4620288, Mode: 420, ModTime: "2017-02-04T20:10:51+01:00", IsDir: false}
// 14{Name: "j15 - Give My Love to Rose.mp3", Size: 3858432, Mode: 420, ModTime: "2017-02-04T20:10:51+01:00", IsDir: false}
// 15{Name: "j16 - I Got Stripes.mp3", Size: 2811904, Mode: 420, ModTime: "2017-02-04T20:10:58+01:00", IsDir: false}
// 16{Name: "j17 - The Legend of Henrys Hammer (Unreleased Bonus Track).mp3", Size: 10283008, Mode: 420, ModTime: "2017-02-04T20:25:27+01:00", IsDir: false}
// 17{Name: "j18 - Green Green Grass of Home.mp3", Size: 3592192, Mode: 420, ModTime: "2017-02-04T20:10:56+01:00", IsDir: false}
// 18{Name: "j19 - Greystone Chapel.mp3", Size: 8695808, Mode: 420, ModTime: "2017-02-04T20:25:52+01:00", IsDir: false}
