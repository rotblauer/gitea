var penTemplate = "<div class='feed-pen'></div>";
var currentDrawingData = {};
// var currentDrawing;
var drawings = {}; //keyd on news id {{.GetCreated}}
var drawingUnderway = false;

function getAllFoodIds(feedItems) {
    var foodIds = [];
    feedItems.each(function(i, el) {
        foodIds.push($(el).data('createdat'));
    });
    return foodIds;
}


function getDrawingPositionByNewsItem(nid) {
  var item = $("#news-" + nid.toString());
    var position = {
        "top": -(item.offsetTop+40), //dist of item from top of foodbox
        "left": -40,
        "width": $("#userfeeds").width() + 80, //otherwise full width and height
        "height": $("#userfeeds").height() + 80
    };
    return position;
}

function buildDrawing(nid) {
    if (!drawingUnderway) {
        startDrawingUI();
        currentDrawingData["nid"] = nid;
        currentDrawingData["position"] = getDrawingPositionByNewsItem(nid);

        //setup holster
        var drawingContainer = $(penTemplate);
        //setup canvas
        currentDrawingData["canvasJQ"] = $("<canvas></canvas>");

        //assign attrs
        drawingContainer.css(currentDrawingData.position); //put container in its place
      currentDrawingData["canvasJQ"].attr("id", "canvas-" + nid);
        currentDrawingData["canvasJQ"].attr("width", currentDrawingData.position.height);
        currentDrawingData["canvasJQ"].attr("height", currentDrawingData.position.width);
        currentDrawingData["canvasJQ"].css({"z-index":1000});

        //setup darwing
        var currentDrawing = new fabric.Canvas("canvas-" + nid, {isDrawingMode: true});

       currentDrawing.freeDrawingBrush = new fabric["Pencil" + 'Brush'](currentDrawing);
        if (currentDrawing.freeDrawingBrush) {
          currentDrawing.freeDrawingBrush.color = "#000000";
          currentDrawing.freeDrawingBrush.width = 1;
          currentDrawing.freeDrawingBrush.shadowBlur = 0;
        }
    }
}

function renderDrawing(drawingInfo) {
    //drawingInfo is obj

}


function startDrawingUI() {
    $("#drawing-controls").show();
    $('.feed-pen').each(function (i, el) {
        $(el).css({"pointer-events":"all"});
    });
    drawingUnderway = true;
}

function stopDrawingUI() {
    $("#drawing-controls").hide();
    $('.feed-pen').each(function (i, el) {
        $(el).css({"pointer-events":"none"});
    });
    drawingUnderway = false;
}

function saveDrawing() {
    stopDrawingUI();
    currentDrawingData["imageData"] = JSON.stringify(currentDrawingData["canvas"]);
    delete currentDrawingData["canvasJQ"];
    //send currentDrawingData to bolt
    $.post("/r/pen",
         JSON.stringify( currentDrawingData ),
         function (res) {
           console.log("success", res);
         },
         function (e) {
           console.log(e);
         });

}
function clearAndQuitDrawing() {
    //clearcurrentdrawing data
    stopDrawingUI();
    currentDrawingData.canvas.clear();
    currentDrawingData = {};
}


$(function() {
    var feedItems = $(".news-box");
    var feedItemsIds = getAllFoodIds(feedItems);
    console.log(feedItemsIds);

  $(".pencilIcon").click(function (e) {
    //gets just the formatted date data, which is our nid
    console.log($( e.currentTarget ).data("nid"));
    return buildDrawing($( e.currentTarget ).data("nid"));
  });

    $("#clearAndQuit").click(clearAndQuitDrawing);
    $("#saveDrawing").click(saveDrawing);

});
