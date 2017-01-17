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
      currentDrawingData["position"]["zindex"] = 1000;

        //setup holster
        var drawingContainer = $(penTemplate);
        //setup canvas
        currentDrawingData["canvasJQ"] = $("<canvas></canvas>");

        //assign attrs
        drawingContainer.css(currentDrawingData.position); //put container in its place
      drawingContainer.attr("id", "pen-" + nid);
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
  var drawingContainer = $(penTemplate);
  var drawingCanvas = $("<canvas></canvas>");

  console.log("rending drawing", drawingInfo.imageData);

  drawingContainer.css(drawingInfo.position);
  drawingContainer.attr("id", "pen-" + drawingInfo.nid);
  drawingCanvas.attr("id", "canvas-"+drawingInfo.nid);
  drawingCanvas.attr("height", drawingInfo.position.height);
  drawingCanvas.attr("width", drawingInfo.position.width);
  // drawingCanvas.css({"z-index": drawingInfo.position.zindex});

  $("#news-" + drawingInfo.nid).append(drawingContainer);
  drawingContainer.append(drawingCanvas);

  var c = new fabric.Canvas("canvas-" + drawingInfo.nid);
  c.loadFromJSON( drawingInfo.imageData , function() {
    c.renderAll();
  },function(o,object){
    console.log(o,object);
  });

  $('.feed-pen').css({'pointer-events': "none"});


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

function deleteDrawing(e) {
  // send DELETE request
  //cuz called from trashcan
  var nid = $( e.currentTarget ).data("nid");
  $.ajax({
    type: "DELETE",
    url: "/r/pen/" + nid,
    beforeSend: function(request) {
      request.setRequestHeader("X-CSRFToken", Cookies.get("_csrf"));
    },
    success: function (res) {
      console.log(res);
      $("#pen-" + nid).remove(); //takes everythign inside too
      $("#deleteDrawing-" + nid).hide();
    },
    error: function (res) {
      console.log(res);
    }
  });
}

function saveDrawing() {
    stopDrawingUI();
  // currentDrawingData["canvas"].selectable = false;
  // fabric.util.removeListener(fabric.document, 'mousedown', this.onMouseDown); fabric.util.removeListener(fabric.document, 'mousemove', this.onMouseMove);
  // currentDrawingData["canvas"].set({selectable:false});
  currentDrawingData["imageData"] = JSON.stringify(currentDrawingData["canvas"].toJSON());
    delete currentDrawingData["canvasJQ"];
  delete currentDrawingData["canvas"];
    //send currentDrawingData to bolt
  currentDrawingData["authorId"] = "1";
  currentDrawingData["authorName"] = "ia";
  var authorizationToken = Cookies.get("_csrf");

  $.ajax({
    type: "POST",
    url: "/r/pen",
    beforeSend: function(request) {
      request.setRequestHeader("X-CSRFToken", authorizationToken);
      request.setRequestHeader("Content-Type", "application/json");
    },
    data: JSON.stringify( currentDrawingData ),
    dataType: 'json',
    success: function (res) {
      console.log(res);
      $("#deleteDrawing-" + res.nid).show();
      stopDrawingUI();
    },
    error: function (res) {
      console.log(res);
    }
  });
}

function clearAndQuitDrawing() {
    //clearcurrentdrawing data
    stopDrawingUI();
    currentDrawingData.canvas.clear();
    currentDrawingData = {};
}
function getSavedDrawings(idsarray) {
  $.ajax({
    type: "GET",
    url: "/r/pen",
    beforeSend: function(request) {
      request.setRequestHeader("X-CSRFToken", Cookies.get("_csrf"));
      request.setRequestHeader("Content-Type", "application/json");
    },
    data: JSON.stringify( idsarray ),
    dataType: 'json',
    success: function (res) {
      console.log("got saved darwing", res);
      for (i in res) {
        console.log("drawing", res[i]);
        var trash = $("#deleteDrawing-" + res[i].nid);
        renderDrawing(res[i]);
        trash.show();
        trash.click(deleteDrawing);
      }
    },
    error: function (res) {
      console.log("couldnt get saved darwing", res);
    }
  })
}


$(function() {
  if (location.pathname == "/") {
    var feedItems = $(".news-box");
    var feedItemsIds = getAllFoodIds(feedItems);

    getSavedDrawings(feedItemsIds);

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
  }
});
