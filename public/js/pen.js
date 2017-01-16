var penTemplate = "<div class='feed-pen'></div>";
var currentDrawingData = {};
var drawings = {}; //keyd on news id {{.GetCreated}}
var drawingUnderway = false;
var authorName;
var authorId;

function getAllFoodIds(feedItems) {
    var foodIds = [];
    feedItems.each(function(i, el) {
        foodIds.push($(el).data('createdat'));
    });
    return foodIds;
}


function getDrawingPositionByNewsItem(nid) {
  var item = $("#news-" + nid);
    var position = {
      "top": -(document.getElementById("news-"+nid).offsetTop+40), //dist of item from top of foodbox
        "left": -40,
        "width": $("#userfeeds").width() + 80, //otherwise full width and height
      "height": $("#userfeeds").height() + 80,
      "position": "absolute",
      "display": "float",
      "z-index":1000
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
        currentDrawingData["canvasJQ"].attr("height", currentDrawingData.position.height);
        currentDrawingData["canvasJQ"].attr("width", currentDrawingData.position.width);
        currentDrawingData["canvasJQ"].css({"z-index":1000});

        //stickem in
        $("#news-" + nid).append(drawingContainer);
        drawingContainer.append(currentDrawingData["canvasJQ"]);

        //setup darwing
        currentDrawingData["canvas"] = new fabric.Canvas("canvas-" + nid, {isDrawingMode: true});

        currentDrawingData["canvas"].freeDrawingBrush = new fabric["Pencil" + 'Brush'](currentDrawingData["canvas"]);
        if (currentDrawingData["canvas"].freeDrawingBrush) {
          currentDrawingData["canvas"].freeDrawingBrush.color = "#000000";
          currentDrawingData["canvas"].freeDrawingBrush.width = 1;
          currentDrawingData["canvas"].freeDrawingBrush.shadowBlur = 0;
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
  // currentDrawingData["canvas"].selectable = false;
  // fabric.util.removeListener(fabric.document, 'mousedown', this.onMouseDown); fabric.util.removeListener(fabric.document, 'mousemove', this.onMouseMove);
  // currentDrawingData["canvas"].set({selectable:false});
  currentDrawingData["imageData"] = currentDrawingData["canvas"].toJSON();
    delete currentDrawingData["canvasJQ"];
  delete currentDrawingData["canvas"];
    //send currentDrawingData to bolt
  currentDrawingData["authorId"] = "1";
  currentDrawingData["authorName"] = "ia";
  var d = JSON.stringify(currentDrawingData);
  console.log(d);
    $.post("/r/pen",
         d,
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
  authorName = '{{.SignedUser.Name}}';
  authorId = '{{.SignedUser.ID}}';

  $(".pencilIcon").click(function (e) {
    //gets just the formatted date data, which is our nid
    console.log($( e.currentTarget ).data("nid"));
    buildDrawing($( e.currentTarget ).data("nid"));
  });

    $("#clearAndQuit").click(clearAndQuitDrawing);
    $("#saveDrawing").click(saveDrawing);

});
