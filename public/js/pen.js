function log() {
    console.log(arguments);
}

var userFeedHeight;
var userFeedWidth;
var penTemplate = "<div class='feed-pen'></div>";
var metaDrawingTemplate = "<div></div>";

function getAllFoodIds(feedItems) {
    var foodIds = [];
    feedItems.each(function(i, el) {
        foodIds.push($(el).attr('id'));
    });
    return foodIds;
}

var drawingUnderway = false;

function buildPen() {
    if (!drawingUnderway) {
        $('.feed-pen').each(function (i, el) {
            $(el).css({"pointer-events":"all"});
        });
        var el = $(this);
        var p = $(penTemplate);
        var newsId = el.attr("id");
        var thisId = "pen-" + newsId;
        p.attr("id", thisId);
        var data = {};
        var position = {
            "top": -(this.offsetTop+40), //dist of food from top of foodbox
            "left": -40,
            "width": $("#userfeeds").width() + 80,
            "height": $("#userfeeds").height() + 80
        };
        data["position"] = position;
        data["nid"] = newsId;

        p.css(position);

        var c = "<canvas></canvas>";
        c = $(c);
        c.attr("id", "canvas" + newsId);
        c.attr("width", position.width);
        c.attr("height", position.height);
        c.css({"z-index":1000});

        $(el).append(p);
        p.append(c);

        var canvasOpts = {
            isDrawingMode: true
        };

        var canvas = new fabric.Canvas("canvas" + newsId, canvasOpts);

        canvas.freeDrawingBrush = new fabric["Pencil" + 'Brush'](canvas);
        if (canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = "#000000";
            canvas.freeDrawingBrush.width = 1;
            canvas.freeDrawingBrush.shadowBlur = 0;
        }

        var controls = $(metaDrawingTemplate);
        controls.attr("id", "drawingcontrols");
        controls.css({
            "float": true,
            "position": "fixed",
            "height": 40,
            "width": "40px",
            "bottom": 0,
        });

        $('body').append(controls);
        var stopDrawingButton = $("<span id='stopDrawing'>STOP DRAWING!</span>");
        controls.append(stopDrawingButton);

        stopDrawingButton.click(saveDrawing);

        drawingUnderway = true;
    }
}

function saveDrawing() {
    drawingUnderway = false;
    $("#drawingcontrols").hide();
    $('.feed-pen').each(function (i, el) {
        $(el).css({"pointer-events":"none"});
    });
}


$(function() {
    var userFeedContainer = $("#userfeeds");
    var feedItems = $(".news-box");
    var feedItemsIds = getAllFoodIds(feedItems);
    var iconthings = $(".iconthings");
    log(feedItemsIds);

    userFeedHeight = userFeedContainer.height();
    userFeedWidth = userFeedContainer.width();
    log(userFeedWidth, userFeedHeight);

    // //TODO only for feeditems that have existing pens
    // feedItems.each(buildPen);
    feedItems.click(buildPen);




});
