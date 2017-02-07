$(function() {

    /// SEASONALS
    /// ///////////////////

    // Christmas lights.
    var hexables = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    var hexablesMini = ['1', '4', '7', 'a', 'd'];
    var test = '000000';
    var colors = []; // ie {13, '#f231fk'}
    var numColors = 4000;
    var numChristmasLights = 100;
    var windowWidth = $(document).width();
    //make em dance
    function updateRandomWithRandom(max, colors) {
        var index = getRandomNumber(max);
        $('#light-' + index)
            .fadeOut('100')
            .css({
                "background-color": getRandomColor
            })
            .fadeIn('100');
    }

    function getRandomNumber(max) {
        return Math.floor(Math.random() * max);
    }
    // http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#'; //'#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(getRandomNumber(letters.length))];
        }
        return color;
    }

    function celebrateChristmas() {
        // colorize nav
        $('.following.bar').addClass('nativity-nav');

        // hang christmas lights
        $('#christmas-lights-container-box').show();
        $('#christmas-lights-container-box').css({
            'height': windowWidth / numChristmasLights
        });
        for (var i = 1; i < numChristmasLights - 1; i++) {
            //console.log('hanging light');
            var div = document.createElement("div");
            $(div).attr('id', 'light-' + i.toString())
                .attr('class', 'christmas-light')
                .css({
                    "background-color": getRandomColor(),
                    "width": windowWidth / numChristmasLights,
                    "margin-bottom": windowWidth / numChristmasLights,
                    "border-radius": '50%'
                });
            $('#christmas-lights-container-box').append(div);
        }
        // createPalette(hexables);
        var clockIt = function() {
            updateRandomWithRandom(numChristmasLights, colors);
            setTimeout(clockIt, 200); // Tick.
        };
        setTimeout(clockIt, 200);
    }

    function celebrateAmerica() {
        $('.following.bar').addClass('fuck-yea-nav');
    }

    // Check if is Christmas season.
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay); // 'ordinal' day of year, 1-365/66

    if (day > 330 || day < 15) {
        celebrateChristmas();
        // snowstorm timing in source public/js/snowstorm.js
    } else if (now.getMonth() == 6 && now.getDate() == 4) {
        celebrateAmerica();
    }

    /// /////////////////// !SEASONALS


    ///
    /// GLOBALS.
    ///

    // http://stackoverflow.com/questions/9101224/invert-text-color-of-a-specific-element-using-jquery
    function invertHex(hexnum) {
        if (hexnum.length != 6) {
            //console.error("Hex color must be six hex numbers in length.");
            return false;
        }

        hexnum = hexnum.toUpperCase();
        var splitnum = hexnum.split("");
        var resultnum = "";
        var simplenum = "FEDCBA9876".split("");
        var complexnum = new Array();
        complexnum.A = "5";
        complexnum.B = "4";
        complexnum.C = "3";
        complexnum.D = "2";
        complexnum.E = "1";
        complexnum.F = "0";

        for (i = 0; i < 6; i++) {
            if (!isNaN(splitnum[i])) {
                resultnum += simplenum[splitnum[i]];
            } else if (complexnum[splitnum[i]]) {
                resultnum += complexnum[splitnum[i]];
            } else {
                //console.error("Hex colors must only include hex numbers 0-9, and A-F");
                return false;
            }
        }

        return resultnum;
    }

    // returns either black (000000) or white (ffffff)
    // depending if argued hex is mostly light or dark, respectively
    function oppositeContrast(hexnum) {
        var returnWhiteIfLessThan = 0.45 // higher is brighter
        var hexes = hexnum.split(""); // per character -> array
        var hexSum = 0;
        for (n in hexes) {
            var char = hexes[n]; // 'e'
            hexSum += hexables.indexOf(char);
        }
        if (hexSum <= hexables.length * hexes.length * returnWhiteIfLessThan) {
            return 'ffffff';
        }
        return '000000';

    }

    // Colorize commit sha1's everywhere.
    $('.commit-id, .sha').each(function(index) {
        var hashy = $(this).text();
        //console.log(index + " - " + hashy.substring(0,6));
        $(this).css({
            "color": "#" + oppositeContrast(hashy.substring(0, 6)),
            "background-color": "#" + hashy.substring(0, 6)
        });
    });

    // and highlight news feed

    // var md = window.markdownit(); // other opt (see 2nd cdn)
    marked.setOptions({
        emoji: true // since changed default emoji dir location in marked.js
    });

    // markdown feed commit messages
    $('.news .content span.commit-mess').each(function(i, block) {
        // console.log('marking down comms');
        var t = $(this).text();
        //console.log(t);
        var m = marked(t); // marked.js via cdn
        $(this).html(m);
        // var result = md.render(t);
        // $(this).html(result);
    });

    // markdown repo commit messages
    $("td.repo-commit-message span").each(function(i, block) {
        var t = $(this).text();
        //console.log(t);
        var m = marked(t); // marked.js via cdn
        // m = m.replace("<p>","<span>")
        // m = m.replace("</p>", "</span>")
        $(this).html(m);

        // no work cuz i think not rendered as dom element yet...
        // $(this).first('p').changeElementType('span'); // cuz it makes a <p> which breaks the line
        // $(this).first('p').css({"display": "inline"});
    });

    function getRandomQuote() {
        var quotient = Math.floor(Math.random() * quotes.length);
        return quotes[quotient];
    }

    var demo = function(data) {
        fx.rates = data.rates;
        var rate = fx(1).to("EUR");
        var ticker = "<span>$1 == ";
        for (i in fx.rates) {
            if (i !== "") {
                var r = fx.rates[i];
                ticker += "<strong>" + fx(1).to(i).toFixed(3) + "</strong>" + i
                for (var i = 0; i < 5; i++) {
                    ticker += "&nbsp;";
                }
            }


        }
        ticker += "</span>";

        $('#currency-ticker').append(ticker);


    }
    $.getJSON("http://api.fixer.io/latest?base=USD", demo);

});
