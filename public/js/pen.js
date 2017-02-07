var penTemplate = "<div class='feed-pen'></div>";
var currentDrawingData = {};
var drawings = {}; //keyd on news id {{.GetCreated}}
var drawingUnderway = false;
var authorName;
var authorId;

function showLoading() {
    var loadingIcon = $("#drawings-loading-icon");
    loadingIcon.show();
}
function hideLoading() {
    var loadingIcon = $("#drawings-loading-icon");
    // loadingIcon.hide();
}

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

function buildDrawing(e) {
    var nid = $( e.currentTarget ).data("nid");
    if (!drawingUnderway) {
        currentDrawingData["nid"] = nid;
      currentDrawingData["authorId"] = $(e.currentTarget).data("authorid");
      currentDrawingData["authorName"] = $(e.currentTarget).data("authorname");
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
          currentDrawingData["canvas"].freeDrawingBrush.color = getFaveColor();
          currentDrawingData["canvas"].freeDrawingBrush.width = 1;
          currentDrawingData["canvas"].freeDrawingBrush.shadowBlur = 0;
        }
      startDrawingUI(nid);
    }
}

function renderDrawing(drawingInfo) {
    //drawingInfo is obj
  var drawingContainer = $(penTemplate); //div

    // var drawingCanvas = $("<canvas></canvas>");
    var drawingPNG = $("<img/>");

  // console.log("rending drawing", drawingInfo.imageData);

  drawingContainer.attr("id", "pen-" + drawingInfo.nid);
  drawingContainer.css(drawingInfo.position);

    drawingPNG.attr("id", "canvas-" + drawingInfo.nid);
    drawingPNG.attr("height", drawingInfo.position.height);
    drawingPNG.attr("width", drawingInfo.position.width);
    drawingPNG.css({"z-index": 1000});
    drawingPNG.attr("src", drawingInfo.imageData);
    // console.log("drawingInfo", drawingInfo.imageData);

  // drawingCanvas.attr("id", "canvas-"+drawingInfo.nid);
  // drawingCanvas.attr("height", drawingInfo.position.height);
  // drawingCanvas.attr("width", drawingInfo.position.width);
  // drawingCanvas.css({"z-index": 1000});

  //double check news item exists?
  if ($("#news-" + drawingInfo.nid).length) {

    $("#news-" + drawingInfo.nid).append(drawingContainer);
    drawingContainer.append(drawingPNG);

    // var c = new fabric.Canvas("canvas-" + drawingInfo.nid);
    // c.loadFromJSON( drawingInfo.imageData , function() {
    //   c.renderAll();
    // },function(o,object){
    //   console.log(o,object);
    // });

  }
  $("#createDrawing-" + drawingInfo.nid).hide();
}

function saveFaveColor(stringey) {
  window.localStorage.setItem("myfavoritecolor", stringey);
}
function getFaveColor() {
  var f = window.localStorage.getItem("myfavoritecolor");
  if (typeof(f) === "undefined" || f === null) { //cuz idk which is get when it doesntget
    return "#000000"; //default black
  }
  return f;
}

function startDrawingUI(nid) {
  $("#drawing-controls").show();

  $("#pen-" + nid).css({"pointer-events":"all"});

  $("#colorp-red").click(function (e) {
    currentDrawingData["canvas"].freeDrawingBrush.color = "#ff0000";
    saveFaveColor("#ff0000");
    // window.localStorage.setItem("myfavoritecolor", "#ff0000");
  });
  $("#colorp-blue").click(function (e) {
    currentDrawingData["canvas"].freeDrawingBrush.color = "#0000ff";
    saveFaveColor("#0000ff");
    // window.localStorage.setItem("myfavoritecolor", "#0000ff");
  });
  $("#colorp-yellow").click(function (e) {
    currentDrawingData["canvas"].freeDrawingBrush.color = "#ffd700";
    saveFaveColor("#ffd700");
    // window.localStorage.setItem("myfavoritecolor", "#ffd700");
  });
  $("#colorp-black").click(function (e) {
    currentDrawingData["canvas"].freeDrawingBrush.color = "#000000";
    saveFaveColor("#000000");
    // window.localStorage.setItem("myfavoritecolor", "#000000");
  });


  $("body").keypress(function (e) {
    console.log(e.which);
    switch(e.which) {
    case 97: //a
      currentDrawingData["canvas"].freeDrawingBrush.color = "#000000";
      break;
    case 115: //s
      currentDrawingData["canvas"].freeDrawingBrush.color = "#ff0000";
      break;
    case 100: ///d
      currentDrawingData["canvas"].freeDrawingBrush.color = "#0000ff";
      break;
    case 102: //f
      currentDrawingData["canvas"].freeDrawingBrush.color = "#ffd700";
      break;

      // save
    case 119: //w
      saveDrawing();
      break;
    case 113: //q
      clearAndQuitDrawing();
      break;
    }
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
      // console.log(res);
      $("#pen-" + nid).remove(); //takes everythign inside too
      $("#deleteDrawing-" + nid).hide();
      $("#createDrawing-" + nid).show();
      $("#createDrawing-" + nid).click(buildDrawing);
    },
    error: function (res) {
        alert(res, JSON.parse(res));
      // console.log(res);
    }
  });
}

function saveDrawing() {
    showLoading();
    stopDrawingUI();
  // currentDrawingData["canvas"].selectable = false;
  // fabric.util.removeListener(fabric.document, 'mousedown', this.onMouseDown); fabric.util.removeListener(fabric.document, 'mousemove', this.onMouseMove);
  // currentDrawingData["canvas"].set({selectable:false});
  if (typeof currentDrawingData["canvas"] == "undefined") {
    console.log("canvas was undefined. returning on save");
    return
  }

  // currentDrawingData["imageData"] = JSON.stringify(currentDrawingData["canvas"].toJSON());

    // store drawing as png data instead of as "redrawable" canvas drawing json
    var drawingPNGData = currentDrawingData["canvas"].toDataURL("image/png");
    currentDrawingData["imageData"] = drawingPNGData;

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
      // console.log(res);
      $("#deleteDrawing-" + res.nid).show();
      $("#deleteDrawing-" + res.nid).click(deleteDrawing);
      $("#createDrawing-" + res.nid).hide();
      stopDrawingUI();
        hideLoading();
    },
    error: function (res) {
        hideLoading();
        alert(res, JSON.parse(res));
      // console.log(res);
    }
  });
}

function clearAndQuitDrawing() {
    //clearcurrentdrawing data
    stopDrawingUI();
  if (typeof( currentDrawingData["canvasJQ"] ) !== "undefined") {
    currentDrawingData["canvasJQ"].remove();
  }
    currentDrawingData.canvas.clear();
    currentDrawingData = {};
}
function getSavedDrawings(idsarray) {
    showLoading();
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
      // console.log("got saved darwing", res);
      for (i in res) {
        // console.log("drawing", res[i]);
        var trash = $("#deleteDrawing-" + res[i].nid);
        renderDrawing(res[i]);
        trash.show();
        trash.click(deleteDrawing);
      }
      $('.feed-pen').css({'pointer-events': "none"});
        hideLoading();
    },
    error: function (res) {
        hideLoading();
        alert("couldn't get saved drawings", res);
      // console.log("couldnt get saved darwing", res);
    }
  });
}


$(function() {
  if (location.pathname == "/" || location.pathname.search("dashboard") > -1) {
    var feedItems = $(".news-box");
    var feedItemsIds = getAllFoodIds(feedItems);

    getSavedDrawings(feedItemsIds);

    // console.log(feedItemsIds);
    //btw these don't work
    authorName = '{{.SignedUser.Name}}';
    authorId = '{{.SignedUser.ID}}';

    $(".pencilIcon").click(buildDrawing);

    $("#clearAndQuit").click(clearAndQuitDrawing);
    $("#saveDrawing").click(saveDrawing);
  }
});
