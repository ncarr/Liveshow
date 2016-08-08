window.onload = function() {
    var title = document.getElementById('title');

    sharejs.open('home', 'json', function(error, doc) {
        if (error) {
          return;
        }
        var name = doc.at('title');
        doc.on('remoteop', pullTitle);
        title.onblur = pushTitle;
        title.onkeypress = function(event) {
          if (event.keyCode === 13) {
            title.blur();
            pushTitle();
          }
        }

        function pullTitle() {
          title.value = name.get();
        }

        function pushTitle() {
          name.set(title.value);
        }

        pullTitle();

        var content = doc.at('content').get();
        var slides = content.slides;

        function renderSlideList(slides) {
          $.each(slides[0], function(index, value) {
            $('<a class="mdl-navigation__link" href="#">Slide ' + (index + 1).toString() + '</a>').appendTo($(".mdl-navigation")).click(function(e) {
              renderSlide(index);
            });
          });
        }

        renderSlideList(slides);

        function renderSlide(index) {
          var slidewrapper = $(".main-slides > .slide-wrapper:first").clone();
          $(".main-slides").empty();
          $.each(slides, function(key, value) {
            $(".pagenum", slidewrapper).html("Display " + (key + 1).toString());
            slide = value[index];
            $(".slide", slidewrapper).addClass(slide["style"]).empty();
            $.each(slide["content"], function(index, val) {
              if (val["style"] == "title") {
                slidewrapper.find(".slide").append('<div class="mdl-card__title mdl-card--expand"><h2 class="mdl-card__title-text" contenteditable>' + val["content"] + '</h2></div>')
              } else if (val["style"] == "subheading") {
                slidewrapper.find(".mdl-card__title").addClass("subheading").append('<h6 class="flush" contenteditable>' + val["content"] + '</h6>')
              } else {
                slidewrapper.find(".slide").append('<div class="mdl-card__supporting-text" contenteditable>' + val["content"] + '</div>')
              }
            });
            slidewrapper.appendTo($(".main-slides"));
          });
        }

        renderSlide(0);

        $(".new-slide").click(function() {
          $('.mdl-navigation').each(function(){
            var new_data = $('a:last', this).clone();
            new_data.html("Slide " + ($(this).children().length + 1).toString());
            new_data.appendTo(this);
            screens = doc.at(['content', 'slides']).get();
            $.each(screens, function(index, value) {
              doc.at(['content', 'slides', index]).push({"style": "content", "content": [{"style": "title", "content": "Add a title"}, {"style": "supporting-text", "content": "Add some content"}]});
            });
          });
        });
        $(".new-screen").click(function() {
          var new_data = $('.main-slides > .slide-wrapper:last').clone();
          $(new_data).children("span.pagenum").html("Display " + ($(".main-slides").children().length + 1).toString());
          new_data.appendTo($(".main-slides"));
          screens = doc.at(['content', 'slides']);
          snapshot = screens.get();
          screens.push(snapshot[snapshot.length - 1]);
        });
    });
};
