// I am chat.


function initializeChat() {
    var url = "ws://" + window.location.host + "/chat-ws";
    ws = new WebSocket(url);

    function establishWS() {
        ws = new WebSocket(url);
    }
    var chat = $("#chat-messages");
    var text = $("#text");
    var isTypingDisplay = $("#other-is-typing");
    var data = [];
    var otherConnectedOperators = [];
    var ipData = {};
    var maxMessageLength = 5000; // :christmas_treeeeeeeeee:. damn hackers keep pushing the limits of what's possible.

    var nak = "";

    var username = $("#signed-user-name").text().trim();
    var userid = +$("#signed-user-id").text().trim();

    console.log("signeduserid", username);
    console.log("signedusername", userid);


    function getNAK() {
        nak = localStorage.getItem("nasa_api_key");
        return nak;
    }

    // function setNAK() {
    //     localStorage.setItem("nasa_api_key", "");
    // }

    if (getNAK()) {
        $.get("https://api.nasa.gov/planetary/apod?api_key=" + nak, function(res) {
            console.log(res);
            $("#catRoom").css({
                "background-image": "url(" + res.url + ")"
            });
            $("#nasa-talk").show().html("<small><strong>" + res.title + "</strong>: <em>" + res.explanation.substring(0, 200) + "...</em></small>")

            .on("click", function() {
                alert(res.title + "\n" + res.explanation + "\n" + res.url);
            });

        });
    }


    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function(s) {
            return entityMap[s];
        });
    }

    function formatDate(unixString, form) {

        // unix is a unix timestamp in milliseconds
        if (unixString) { // check if present
            var a = moment(parseInt(unixString));
            var b = a.toNow(true) //.local().format(form);
            if (a.isValid()) {
                return b + " ago";
            } else {
                return unixString;
            }
        } else {
            return "";
        }
    }

    function emphasizeHTML(string) {
        return '<em>' + string + '</em>';
    }

    function smallifyHTML(string) {
        return '<small>' + string + '</small>';
    }

    function strongifyHTML(string) {
        return '<strong>' + string + '</strong>';
    }

    function classifyString(string, classs) {
        return '<span class="' + classs + '">' + string + '</span>';
    }

    function formatPS1(line) {
        /* console.log("formatting line: " + JSON.stringify(line));*/
        var ps = "";
        var m = ''; // printable message
        // check if is a typing status...
        if (line["unix"] === "") {
            return "";
        }
        // var out = "<div style='display: table-row; margin-top: 10px; ' >";
        var timeFormat = "kk:mmdddDMMM";
        // var ps = "<div style='display: table-cell;vertical-align: top; min-width:300px;' >";
        var color = "palegreen";
        var messageType = "human-message";
        if (line['userName'] === 'ia') {
            color = "red";
        }
        if (line['userName'] === 'jl') {
            color = "blue";
        }
        if (line['userName'] === 'robotcat') {
            color = "purple";
            messageType = "robot-message";
        }
        var out = "<div class='ui row ancatline " + messageType +"' >";
        var ps = "<div style='padding-right: 1em;'>";
        ps += "<span style='color: " + color + ";'>";
        // if have user id, we should

        if (line['userId'] > 0 && line['userName'] !== "robotcat") {
            //ps += strongifyHTML(line["userName"] + "@" + line["city"]) + " $ " + "</div>";
            // ps += line["city"];
            // ps += " "
            // ps += strongifyHTML(line["userName"]);
            // ps += " $ ";

            // ps += "<img style='max-height: 1.4em; max-width: 1.4em; border: 10px solid white; margin-right: 5px;' src='/avatars/" + line['userId'] + "'/>";
            ps += "(" + formatDate(line["unix"], timeFormat) + ") ";
            ps += " " + line["userName"];
        } else if (line['userName'] === "robotcat") {
            ps += "> "
        } else {
            ps += "(" + formatDate(line["unix"], timeFormat) + ") ";
            ps += strongifyHTML(line["city"]);
        }

        if (!(line['userName'] === 'robotcat')) {
            ps += " $ " + "</span>";
        }

        ps += "</div>";

        if (line["message"].length > maxMessageLength) {
            m = line["message"].substring(0, maxMessageLength);
        } else {
            m = line["message"];
        }

        if (line['isQuery']) {
            color = "gray";
        } else {
            color= '';
        }
        // var says = '<div class="ui chat-message has-emoji" style="display: table-cell; padding-left: 10px;vertical-align: top;">' + m + '</div>';
        var says = '<div class="has-emoji" style="color: ' + color + ';">' + m + '</div>';
        out += ps + says;
        out += "</div>";
        return out;
    }

    // func formatPS1(line) {
    //         /* console.log("formatting line: " + JSON.stringify(line));*/
    //         if (line["unix"] === "") {
    //             return "";
    //         }
    //
    //         var timeFormat = "kk:mmdddDMMM";
    //
    //         var out = "<p class='command'>";
    //         out += "(" + formatDate(line["unix"], timeFormat) + ") ";
    //         if (line['userId'] > 0) {
    //             out += line['userName'];
    //         } else {
    //             out += line['city'];
    //         }
    //         out += "</p>";
    //
    //         out += "<p class='response'>";
    //
    //         if (line["message"].length > maxMessageLength) {
    //             out += line["message"].substring(0, maxMessageLength);
    //         } else {
    //             out += line["message"];
    //         }
    //         return out;
    // }

    // function formatPS1(line) {
    //     /* console.log("formatting line: " + JSON.stringify(line));*/
    //     var ps = "";
    //     var m = ''; // printable message
    //     // check if is a typing status...
    //     if (line["unix"] === "") {
    //         return "";
    //     }
    //     // var out = "<div style='display: table-row; margin-top: 10px; ' >";
    //     var out = "<div class='ui row ancatline' >";
    //     var timeFormat = "kk:mmdddDMMM";
    //     // var ps = "<div style='display: table-cell;vertical-align: top; min-width:300px;' >";
    //     var ps = "<div class='ui five wide column' style='text-align: right;'>";
    //     ps += "<span style='color: palegreen;'>";
    //     // if have user id, we should
    //     ps += formatDate(line["unix"], timeFormat) + " ";
    //     if (line['userId'] > 0) {
    //         //ps += strongifyHTML(line["userName"] + "@" + line["city"]) + " $ " + "</div>";
    //         // ps += line["city"];
    //         // ps += " "
    //         // ps += strongifyHTML(line["userName"]);
    //         // ps += " $ ";
    //
    //         // ps += "<img style='max-height: 1.4em; max-width: 1.4em; border: 10px solid white; margin-right: 5px;' src='/avatars/" + line['userId'] + "'/>";
    //         ps += "| " + line["userName"];
    //     } else {
    //         ps += strongifyHTML(line["city"]);
    //     }
    //
    //
    //     ps += " $ " + "</span>";
    //
    //     ps += "</div>";
    //
    //     if (line["message"].length > maxMessageLength) {
    //         m = line["message"].substring(0, maxMessageLength);
    //     } else {
    //         m = line["message"];
    //     }
    //     // var says = '<div class="ui chat-message has-emoji" style="display: table-cell; padding-left: 10px;vertical-align: top;">' + m + '</div>';
    //     var says = '<div class="ui eleven wide column chat-message">' + m + '</div>';
    //     out += ps + says;
    //     out += "</div>";
    //     return out;
    // }


    // get JSON.parsed data now
    function renderData(data) {
        chat.html("");
        html = "";
        $.each(data, function() {
            // console.log(this);
            html += formatPS1(this);
        });
        chat.html(html);
        // highlight.js each pre
        $('pre').each(function(i, block) {
            hljs.highlightBlock(block);
        });

        // add class .has-emoji to each chat-message's child element type 'p'
        // $('.chat-message').children('p').addClass('has-emoji is-chat-p');
        // $('.response').addClass('has-emoji is-chat-p');

        var hasEmoji = document.getElementsByClassName('has-emoji');
        for (var i = 0; i < hasEmoji.length; i++) {
            emojify.run(hasEmoji[i]);
        }
    }

    function showOtherIsTyping() {
        isTypingDisplay.show();
    }

    function hideOtherIsTyping() {
        isTypingDisplay.hide();
    }

    function scrollChat() {
        var div = $('#chat-messages-container');
        // not pretty way to keep :cat2: and :bomb: from being halway-ified when they're posted
        // it's cuz their fatter than usuual
        setTimeout(function() {
            div.scrollTop(div.prop('scrollHeight') + 50);
        }, 100);
    }

    function getChatJSON(qparams) {
        url = "/r/chat";
        if (typeof qparams !== 'undefined' && qparams !== "") {
            url += "?" + qparams;
        }
        $.ajax({
            type: "GET",
            url: url,
            error: function(e) {
                console.log("Error ajaxing chat data.");
                console.log(e);
            },
            success: function(res) {
                console.log('got messages');
                console.log(res);
                    /* console.log("Got AJAX chat/r: ", res);*/
                data = res;
                renderData(res);
                scrollChat();
                // doEmojify();
                /* console.log('data -> ', data);*/
                if (chatIsHidden()) {
                    notifyUnreadMessages();
                }

            }
        });
    }

    function strip(html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }
    // Get ip
    $.getJSON('//freegeoip.net/json/?callback=?', function(data) {
        ipData = data;
    });


    function notifyUnreadMessages() {
        var numberUnread = countMessagesLaterThan(getLastTimeRead());
        if (numberUnread > 0) {
            return setUnreadNotifier(numberUnread);
        }
        return false;
    }

    function countMessagesLaterThan(timeUnixMilliseconds) {
        var c = 0;
        for (var i = 0; i < data.length; i++) {
            var msg = data[i];
            if ((parseInt(msg['unix']) > timeUnixMilliseconds) && (msg['userId'] !== userid)) {
                c++;
            }
        }
        return c;
    }

    function getLastTimeRead() {
        return window.localStorage.getItem('squirrel_chat_last_open');
    }

    function setLastTimeRead(to) {
        return window.localStorage.setItem('squirrel_chat_last_open', to);
    }

    function setUnreadNotifier(to) {
        $('#chat-unread-count').text(to);
    }

    function chatIsHidden() {
        return $('#chatty').is(":hidden");
    }

    // Set last read time to now. On opening and closing chat window.
    $('#get-chatty').on('click', function() {
        setLastTimeRead(Date.now());
        setUnreadNotifier(''); // clear notifier
        $("#currency-ticker span").toggle();
    });
    /* console.log('countMessagesLaterThan', countMessagesLaterThan());*/

    ws.onopen = function(evt) {
        console.log('ws connected');
        $('#disconnected-alert').hide();
        ws.send("iam:::" + username);

    };
    ws.onclose = function(evt) {
        $('#disconnected-alert').show();
        establishWS();
    };
    ws.onmessage = function(msgEvt) {
        console.log("got message", msgEvt.data);
        /* console.log("WSonmessage: ", msgEvt);*/

        var metaRegex = /^~~~|^\!~~~|^\*\*\*|^\!\*\*\*|^:::|^\!:::|^set:::/;
        // If the message is not a meta message
        if (!metaRegex.test(msgEvt.data)) {

            var formattedMsg = JSON.parse(msgEvt.data);
            hideOtherIsTyping();
            data.push(formattedMsg);

            // ensure marked() here.  blah.
            chat.append(formatPS1(formattedMsg));

            // add emoji class to last (newest) chat message elem
            $('.chat-message').last().children('p').last().addClass('has-emoji is-chat-p');

            // local notification.
            /* console.log("ipData.ip: " + ipData.ip);*/
            /* console.log("formattedMsg['ip']: " + formattedMsg['ip']);*/

            if (ipData.ip !== formattedMsg['ip'] && !formattedMsg['IsQueryResponse']) {
                notify({
                    text: strip(formattedMsg['message']),
                    body: formattedMsg['city'],
                    tag: formattedMsg['unixNano']
                });
            }
            scrollChat();

            if (chatIsHidden()) {
                notifyUnreadMessages();
            }

            // doEmojify();
            var hasEmoji = document.getElementsByClassName('has-emoji');
            for (var i = 0; i < hasEmoji.length; i++) {
                emojify.run(hasEmoji[i]);
            }

            // If another person is typing.
        } else if (msgEvt.data === "***") {
            showOtherIsTyping();

            // Another person is not typing anymore.
        } else if (msgEvt.data === "!***") {
            hideOtherIsTyping();

            // onConnect message about radio station from freya
        } else if (msgEvt.data.indexOf("!~~~") === 0) {
            if (typeof(player) === "undefined") {
                return;
            }

            // compare times of local versus server and take whichever is later. the battle for late nite listening...
            var datSongS = msgEvt.data.replace("!~~~", "");
            var datSong = JSON.parse(datSongS).radio;

            var ds = localStorage.getItem("radio_goggles");
            ds = JSON.parse(ds);

            var p = localStorage.getItem("hates_gogs_radio");
            if (p === "true") {
                $("#song-play-button").show();
                $("#song-pause-button").hide();

                // and your locale gets set to station
                // haters can't be choosers

                ds = datSong;
                localStorage.setItem("radio_goggles", JSON.stringify(datSong));

                // update the song display
                $("#song-loading").hide();
                var disp = datSong.file.substring(7).split("/");
                $("#current-song").html(disp[disp.length-1]);

                        // preload song even for haters
                player.loadSong(datSong.index);

                return;
            }



            // if nothing stored locally, use the radio station
            if (ds === null) {
                player.skipTo(datSong.index, datSong.seek);
                console.log("Beginning radio based on station.");
                return;
            };

            var djTime = new Date(datSong.time);
            var localTime = new Date(ds.time);

            if (djTime.getTime() > localTime.getTime()) {
                player.skipTo(datSong.index, datSong.seek);
                console.log("Beginning radio based on station.");
                return;
            } else {
                // should automatically (be playing) from held position
                player.playFromHeldPosition();
                console.log("Beginning radio based on locale.");
                return;
            }


        } else if (msgEvt.data.indexOf("~~~") === 0) {
            // so this is the case where we're gettin an update about another operator changing the dial on teh fly

            if (typeof(player) === "undefined") {
                return
            };

            $("#other-channels").show();

            var datSongS = msgEvt.data.replace("~~~", "");
            var datGopher = JSON.parse(datSongS);
            var datSong = datGopher.radio;

            var p = localStorage.getItem("hates_gogs_radio");

            updateOperatorsStatus(datGopher, otherConnectedOperators);
            updateRadioStationsDisplay(otherConnectedOperators);

            if (p === "true") {

                // and your locale gets set to station
                // haters can't be choosers
                localStorage.setItem("radio_goggles", JSON.stringify(datSong));

                // and update readout
                var disp = datSong.file.substring(7).split("/");
                $("#current-song").html(disp[disp.length-1]);

                return;
            }



            // on connect of an operator
        } else if (msgEvt.data.indexOf(":::") === 0) {
            var d = msgEvt.data.replace(":::", "");
            d = JSON.parse(d);
            /* otherConnectedOperators.push({ d.id: d.radio });*/
            otherConnectedOperators.push(d);

            // update a vizual for that array
            updateOperatorsDisplay(otherConnectedOperators);

            // receive name update
        } else if (msgEvt.data.indexOf("set:::") === 0) {
            var is = msgEvt.data.replace("set:::","");
            console.log("json will parse", is);
            var j = JSON.parse(is);
            updateOperatorsStatus(j, otherConnectedOperators);
            updateOperatorsDisplay(otherConnectedOperators);

            notify({
                text: "Cat in.",
                body: j.name + " is here.",
                tag: Date.now()
            });


            //on disconnect of an operator
        } else if (msgEvt.data.indexOf("!:::") === 0) {
            console.log("An operator disconnected.");

            var d = msgEvt.data.replace("!:::", "");
            d = JSON.parse(d);
            otherConnectedOperators.splice(otherConnectedOperators.indexOf(d), 1);

            updateOperatorsDisplay(otherConnectedOperators);

            updateRadioStationsDisplay(otherConnectedOperators);

            // $("#other-channels").hide();
        }
    };

    function updateOperatorsStatus(gopherInfo, operators) {

        for (var i = 0; i < operators.length; i++) {
            if (operators[i].id === gopherInfo.id) {
                operators[i] = gopherInfo;
            }
        }

    }

    function updateRadioStationsDisplay(operators) {
        for (var i = 0; i < operators.length; i++) {
            $("#rss-radio-" + operators[i].id).off("click");
        }

        // clear out... could be better
        $("#other-channels").html("");

        for (var i = 0; i < operators.length; i++) {
            var op = operators[i];
            var p = $("<p></p>");
            p.css({cursor: "pointer"});
            var pStream = $("<span></span>");
            pStream.attr("id", "rss-radio-" + op.id);
            pStream.attr("index", op.radio.index);
            pStream.attr("seek", op.radio.seek);
            var song;
            if (op.radio.index === player.index) {
                song = "Synced";
            } else {
                song = op.radio.file.substring(7);
            }
            pStream.html("<i class='octicon octicon-rss'></i> " + op.name + " @ " + song);
            $("#other-channels").append(p);
            p.append(pStream);
            $("#rss-radio-" + op.id).on("click", function() {
                var i = +$(this).attr("index");
                var s = +$(this).attr("seek");
                player.skipTo(i, s);
            });

        }
    }

    function updateOperatorsDisplay(operators) {
        console.log("operators", operators);
        var cat = $(".item.brand img").first();
        var catClass = cat.attr("class");
        var catSrc = cat.attr("src");
        $(".item.brand").html("");
        for (var x = 0; x < operators.length + 1; x++) {
            var c = $("<img />");
            c.attr("class", catClass);
            c.attr("src", catSrc);
            $(".item.brand").first().append(c);
            $(".item.brand").first().append();
            // not me
            if (x !== 0) {
                var name = operators[x-1].name;
            } else {
                var name = username;
            }
            var nameIcon = $("<sup></sup>");
            nameIcon.addClass("operator-name-icon");
            nameIcon.text(name);
            $(".item.brand").first().append(nameIcon);

        }
    }
    updateOperatorsDisplay(otherConnectedOperators);

    $('.form-group').on('input', '#text', function() {
        // console.log("I inputted! Value: " + $("#text").val());

        var v = $('#text').val();
        if (v.length > maxMessageLength) {
            $('#count-remaining-characters').show().text((maxMessageLength - v.length).toString() + "/" + maxMessageLength.toString());
        }
        if (v !== "") {
            ws.send('***');
        } else {
            ws.send("!***");
        }
    });


    function storePhonenumber(recipient) {
        var personsNumber = prompt("Please enter the mobile phone number of " + recipient, "1113334444");
        if (personsNumber != null) {
            // document.getElementById("demo").innerHTML =
            // "Hello " + personsNumber + "! How are you today?";
            localStorage.setItem("gitea-phonebook-" + recipient, personsNumber.trim());
            return personsNumber.trim();
        } else {
            return null;
        }
    }

    function sendSMS(recipient, message) {

        var phoneNum = localStorage.getItem("gitea-phonebook-" + recipient);
        if (phoneNum == null) {
            num = storePhonenumber(recipient);
            if (num) {
                phoneNum = num;
            } else {
                alert("can't send sms without phone number");
                return null;
            }
        }

        $.ajax({
            type: "POST",
            url: "//textbelt.com/text",
            data: {
                "number": parseInt(phoneNum),
                "message": message + "(<3 " + username + "@rbgit)"
            },
            error: function(e) {
                alert("Error ajax posting sms to " + recipient + "\nCheck the console logs.");
                console.log(e);
            },
            success: function(res) {
                alert('Success!')
                console.log(res);
            }
        });
    }

    function makeOutgoingMessage(rawMessage) {
        return {
            // http://stackoverflow.com/questions/6002808/is-there-any-way-to-get-current-time-in-nanoseconds-using-javascript
            unixNano: (1000 * (window.performance.timing.navigationStart + window.performance.now())).toString(), // awesome...
            unix: (Date.now() / 1).toString(),
            message: rawMessage.substring(0, maxMessageLength),
            ip: ipData.ip,
            lat: ipData.latitude.toString(),
            lon: ipData.longitude.toString(),
            city: ipData.city,
            subdiv: ipData.region_name,
            countryIsoCode: ipData.country_code,
            tz: ipData.time_zone,
            // sign it
            userName: username,
            userId: userid
        };
    }

    // check for smssering
    function delegateSMS(message) {
        // var str = 'here  jl@ there bubbafett';
        var re = /@(\w*)/g;
        var found = message.match(re);
        if (found == null) {
            return null;
        }

        name = found[0].replace("@", "");
        if (name === "") {
            return null;
        }

        return sendSMS(name, message)

    }
    // Push return to send message.
    text.keyup(function(e) {
        if (!e.shiftKey && e.which == 13 && $.trim(text.val()).length > 0) {
            if (text.val()[0] === "=") {
                var reg = text.val().substring(1);
                console.log(reg);
                // remove newline from pushing enter
                text.val(text.val().replace(/\s+$/g, ''));
                // if just = is entered, clear box
                if (text.val() === "=") {
                    text.val("");
                }
                return getChatJSON(reg);
            }
            var formattedMsg = makeOutgoingMessage(text.val());
            /* console.log("sending message: " + JSON.stringify(formattedMsg, null, 2));*/
            ws.send(JSON.stringify(formattedMsg));

            // send sms if @someone
            delegateSMS(text.val());

            // Reset text value
            text.val('');
            $('#count-remaining-characters').text(maxMessageLength.toString() + "/" + maxMessageLength.toString());
        }
    });
    // get data and handle it on doc ready
    getChatJSON("");
}
