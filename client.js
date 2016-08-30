var sharedb = require('sharedb/lib/client');

// Open WebSocket connection to ShareDB server
if (window.location.protocol == "https:") {
  var socket = new WebSocket('wss://' + window.location.host);
} else {
  var socket = new WebSocket('ws://' + window.location.host);
}

var connection = new sharedb.Connection(socket);

// Create local Doc instance mapped to 'examples' collection document with id 'counter'
var doc = connection.get('liveshow', 'home');

// Get initial value of document and subscribe to changes
doc.subscribe();
// When document changes (by this client or any other, or the server)
doc.on('op', callback);

function callback(op) {
  console.log(op);
  if (op) {
    for (var i = 0; i < op.length; i++) {
      if (op[i].p[0] == "background") {
        updateSlideColour("primary", op[i].oi);
      } else if (op[i].p[0] == "accent") {
        updateSlideColour("accent", op[i].oi);
      } else if (op[i].p[0] == "foreground") {
        updateSlideColour("text", op[i].oi);
      } else if (op[i].p[0] == "title") {
        $('#title').val(doc.data.title).trigger('autogrow');
      } else if (op[i].p.length == 4 && op[i].p[1] == "slides" && op[i].p[2] == 0 && op[i].li) {
        showNewSlide();
      } else if (op[i].p.length == 3 && op[i].p[1] == "slides" && op[i].li) {
        showNewDisplay();
      } else if (op[i].p.length == 6 && op[i].p[1] == "slides" && op[i].p[3] == $(".main-slides .slide:first").data("slide") && op[i].p[5] == "background") {
        updateSlideColour("primary", op[i].oi);
      } else if (op[i].p.length == 6 && op[i].p[1] == "slides" && op[i].p[3] == $(".main-slides .slide:first").data("slide") && op[i].p[5] == "accent") {
        updateSlideColour("accent", op[i].oi);
      } else if (op[i].p.length == 6 && op[i].p[1] == "slides" && op[i].p[3] == $(".main-slides .slide:first").data("slide") && op[i].p[5] == "foreground") {
        updateSlideColour("text", op[i].oi);
      } else if (op[i].p.length == 7 && op[i].p[1] == "slides" && op[i].p[3] == $(".main-slides .slide:first").data("slide") && op[i].p[5] == 0) {
        $(".main-slides .slide:nth-child(" + (op[i].p[2] + 1) + ") .mdl-card__title-text").not(".subheading").val(op[i].oi);
      } else if (op[i].p.length == 7 && op[i].p[1] == "slides" && op[i].p[3] == $(".main-slides .slide:first").data("slide") && (op[i].p[5] == 1 || op[i].p[5] == 3)) {
        if (doc.data.content.slides[op[i].p[2]][op[i].p[3]].content[op[i].p[5]].style == "subheading") {
          $(".main-slides .slide:nth-child(" + (op[i].p[2] + 1) + ") textarea.subheading:nth-child(" + (op[i].p[5] + 1) + ")").val(op[i].oi);
        } else {
          $(".main-slides .slide:nth-child(" + (op[i].p[2] + 1) + ") .mdl-card__supporting-text").val(op[i].oi);
        }
      } else if (op[i].p.length == 7 && op[i].p[1] == "slides" && op[i].p[3] == $(".main-slides .slide:first").data("slide") && op[i].p[5] == 2) {
        $(".main-slides .slide:nth-child(" + (op[i].p[2] + 1) + ") textarea.subheading:nth-child(" + (op[i].p[5] + 1) + ")").val(op[i].oi);
      } else if (op[i].p.length == 5 && (op[i].od === undefined || op[i].oi === undefined) && op[i].p[4] == "background") {
        if (op[i].oi) {
          $("#global-colours-label")[0].MaterialSwitch.off();
        } else {
          $("#global-colours-label")[0].MaterialSwitch.on();
          updateSlideColour("primary", doc.data.background);
          updateSlideColour("accent", doc.data.accent);
          updateSlideColour("text", doc.data.foreground);
        }
      } else if (op[i].p.length == 5 && op[i].oi && op[i].od && (op[i].p[4] == "background" || op[i].p[4] == "accent" || op[i].p[4] == "foreground")) {
        if (op[i].p[4] == "background") {
          updateSlideColour("primary", op[i].oi);
        } else if (op[i].p[4] == "accent") {
          updateSlideColour("accent", op[i].oi);
        } else if (op[i].p[4] == "foreground") {
          updateSlideColour("text", op[i].oi);
        }
      }
    }
  }
}

function escapeHtml(text) {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function renderSlide(index) {
  var slidewrapper = $(".main-slides > .slide-wrapper:first").clone();
  $(".main-slides").empty();
  doc.fetch(function (err) {
    if (err) throw err;
    for (var i = 0; i < doc.data.content.slides.length; i++) {
      slidewrapper = slidewrapper.clone();
      $(".pagenum", slidewrapper).html("Display " + (i + 1).toString());
      slide = doc.data.content.slides[i][index];
      $(".stretch", slidewrapper).empty();
      $('<div class="mdl-card mdl-shadow--2dp slide" data-slide="' + index + '" data-display="' + i + '"></div>').addClass(slide.style).appendTo($(".stretch", slidewrapper));
      for (var j = 0; j < slide.content.length; j++) {
        if (slide.content[j]["style"] == "title") {
          slidewrapper.find(".slide").append('<div class="mdl-card__title mdl-card--expand"><textarea rows="1" class="mdl-card__title-text" placeholder="Add a title">' + escapeHtml(slide.content[j]["content"]) + '</textarea></div>');
        } else if (slide.content[j]["style"] == "subheading") {
          slidewrapper.find(".mdl-card__title").addClass("subheading").append('<textarea rows="1" class="subheading mdl-card__title-text">' + escapeHtml(slide.content[j]["content"]) + '</textarea>');
        } else {
          slidewrapper.find(".slide").append('<textarea class="mdl-card__supporting-text">' + escapeHtml(slide.content[j]["content"]) + '</textarea>');
        }
      }
      slidewrapper.appendTo($(".main-slides"));
    }
    updateSlideColour("primary", doc.data.content.slides[0][index].background || doc.data.background);
    updateSlideColour("accent", doc.data.content.slides[0][index].accent || doc.data.accent);
    updateSlideColour("text", doc.data.content.slides[0][index].foreground || doc.data.foreground);
    if (doc.data.content.slides[0][index].background) {
      $("#global-colours-label")[0].MaterialSwitch.off();
    } else {
      $("#global-colours-label")[0].MaterialSwitch.on();
    }
    $(".main-slides .mdl-card__title-text").not(".subheading").blur(function() {
      uploadSlideTitle($(this).parents(".slide").data("display"), $(this).parents(".slide").data("slide"), $(this).val());
    });
    $(".main-slides .mdl-card__supporting-text").blur(function() {
      uploadSlideContent($(this).parents(".slide").data("display"), $(this).parents(".slide").data("slide"), ($(this).parents(".slide").hasClass("speaker") ? 3 : 1), $(this).val());
    });
    $(".main-slides .subheading").blur(function() {
      uploadSlideContent($(this).parents(".slide").data("display"), $(this).parents(".slide").data("slide"), $(this).index(), $(this).val());
    });
  });
}
global.renderSlide = renderSlide

function renderSlideList(slides) {
  for (var i = 0; i < slides[0].length; i++) {
    $('<a class="mdl-navigation__link" href="#">Slide ' + (i + 1).toString() + '</a>').appendTo($(".mdl-navigation")).click(function(e) {
      renderSlide(i);
    });
  }
}

function uploadSlideTitle(display, slide, content) {
  doc.fetch(function (err) {
    if (err) throw err;
    doc.submitOp([{p: ["content", "slides", display, slide, "content", 0, "content"], od: doc.data.content.slides[display][slide].content[0].content,  oi: content}]);
  });
}
global.uploadSlideTitle = uploadSlideTitle;
function uploadSlideContent(display, slide, pos, content) {
  doc.fetch(function (err) {
    if (err) throw err;
    doc.submitOp([{p: ["content", "slides", display, slide, "content", pos, "content"], od: doc.data.content.slides[display][slide].content[pos].content,  oi: content}]);
  });
}
global.uploadSlideContent = uploadSlideContent;

function pushTitle() {
  doc.fetch(function (err) {
    if (err) throw err;
    doc.submitOp([{p: ["title"], od: doc.data.title,  oi: $("#title").val()}]);
  });
}
$("#title").blur(pushTitle);
$("#title").keypress(function(event) {
  if (event.keyCode === 13) {
    title.blur();
    pushTitle();
  }
});

function showNewSlide() {
  $('.mdl-navigation').each(function(){
    var new_data = $('a:last', this).clone();
    new_data.html("Slide " + ($(this).children().length + 1).toString());
    new_data.appendTo(this).click(function(e) {
      renderSlide($(this).children().length);
    });
  });
}
$(".new-slide").click(function() {
  showNewSlide();
  doc.fetch(function (err) {
    if (err) throw err;
    screens = doc.data.content.slides;
    for (var i = 0; i < screens.length; i++) {
      doc.submitOp([{p: ['content', 'slides', i, screens.length], li: {"style": "content", "content": [{"style": "title", "content": "Add a title"}, {"style": "supporting-text", "content": "Add some content"}]}}]);
    }
  });
});

function showNewDisplay() {
  var new_data = $('.main-slides > .slide-wrapper:last').clone();
  $(new_data).children("span.pagenum").html("Display " + ($(".main-slides").children().length + 1).toString());
  new_data.appendTo($(".main-slides"));
}
$(".new-screen").click(function() {
  showNewDisplay();
  doc.fetch(function (err) {
    if (err) throw err;
    screens = doc.data.content.slides;
    doc.submitOp([{p: ["content", "slides", screens.length], li: screens[screens.length - 1]}]);
  });
});

function updateSlideColour(type, colour) {
  if (type == "primary") {
    $("#primary-colour-menu").css("background-color", colour);
    $("main .slide").css("background-color", colour);
  }
  if (type == "accent") {
    $("#accent-colour-menu").css("background-color", colour);
    $(".mdl-button--colored").not(".colours .mdl-button--colored").css("background-color", colour);
  }
  if (type == "text") {
    $("#text-colour-menu").css("background-color", colour);
    $("main .slide").css("color", colour);
  }
}
function uploadSlideColour(type, colour) {
  updateSlideColour(type, colour);
  if (type == "primary") {
    type = "background";
  } else if (type == "text") {
    type = "foreground";
  }
  doc.fetch(function (err) {
    if (err) throw err;
    var slide = $(".main-slides .slide:first").data("slide");
    if (doc.data.content.slides[0][slide][type]) {
      for (var i = 0; i < doc.data.content.slides.length; i++) {
        doc.submitOp([{p: ["content", "slides", i, slide, type], od: doc.data.content.slides[i][slide][type], oi: colour}]);
      }
    } else {
      doc.submitOp([{p: [type], od: doc.data[type], oi: colour}]);
    }
  });
}
$(".primary-colour-list > li").click(function() {
  uploadSlideColour("primary", $("button", this).css("background-color"));
});
$(".accent-colour-list > li").click(function() {
  uploadSlideColour("accent", $("button", this).css("background-color"));
});
$(".text-colour-list > li").click(function() {
  uploadSlideColour("text", $("button", this).css("background-color"));
});

$("#global-colours").change(function(e) {
  slide = $(".main-slides .slide:first").data("slide");
  doc.fetch(function (err) {
    if (err) throw err;
    if ($("#global-colours-label").hasClass("is-checked")) {
      for (var i = 0; i < doc.data.content.slides.length; i++) {
        doc.submitOp([{p: ["content", "slides", i, slide, "background"], od: doc.data.content.slides[i][slide].background}, {p: ["content", "slides", i, slide, "accent"], od: doc.data.content.slides[i][slide].accent}, {p: ["content", "slides", i, slide, "foreground"], od: doc.data.content.slides[i][slide].foreground}]);
        updateSlideColour("primary", doc.data.background);
        updateSlideColour("accent", doc.data.accent);
        updateSlideColour("text", doc.data.foreground);
      }
    } else {
      for (var i = 0; i < doc.data.content.slides.length; i++) {
        doc.submitOp([{p: ["content", "slides", i, slide, "background"], oi: doc.data.background}, {p: ["content", "slides", i, slide, "accent"], oi: doc.data.accent}, {p: ["content", "slides", i, slide, "foreground"], oi: doc.data.foreground}]);
      }
    }
  });
});

$("#title").autoGrowInput();
