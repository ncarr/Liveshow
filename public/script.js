window.onload = function() {
    var title = document.getElementById('title');

    sharejs.open('home', 'json', function(error, doc) {
        if (error) {
          return;
        }
        if (doc.get() === null) {
          doc.set({
            "title": "",
            "id": "0",
            "presentations": {},
            "background": "#00bcd4",
            "foreground": "#000000",
            "accent": "#ff4081",
            "accent-foreground": "#ffffff",
            "content":
            {
              "slides":
              [
                [
                  {
                    "style": "presentation-title",
                    "content":
                    [
                      {
                        "style": "title",
                        "content": "Add a title"
                      }
                    ]
                  },
                  {
                    "style": "speaker",
                    "content":
                    [
                      {
                        "style": "title",
                        "content": "John Doe"
                      },
                      {
                        "style": "subheading",
                        "content": "@example"
                      },
                      {
                        "style": "subheading",
                        "content": "Job Title"
                      },
                      {
                        "style": "supporting-text",
                        "content": "Add a short bio"
                      }
                    ]
                  },
                  {
                    "style": "content",
                    "content":
                    [
                      {
                        "style": "title",
                        "content": "Add a title"
                      },
                      {
                        "style": "supporting-text",
                        "content": "Add some content"
                      }
                    ]
                  }
                ]
              ]
            }
          });
        }
        var name = doc.at('title');
        doc.on('remoteop', applyChanges);
        title.onblur = pushTitle;
        title.onkeypress = function(event) {
          if (event.keyCode === 13) {
            title.blur();
            pushTitle();
          }
        }

        function pullTitle() {
          $('#title').val(name.get()).trigger('autogrow');
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

        function applyChanges(op) {
          console.log(op);
          $.each(op, function(index, value) {
            if (value.p[0] == "background") {
              updateSlideColour("primary", value.oi);
            }
            if (value.p[0] == "accent") {
              updateSlideColour("accent", value.oi);
            }
            if (value.p[0] == "foreground") {
              updateSlideColour("text", value.oi);
            }
            if (value.p[0] == "title") {
              pullTitle();
            }
            if (value.p.length == 4 && value.p[1] == "slides" && value.p[2] == 0 && value.li) {
              showNewSlide();
            }
            if (value.p.length == 3 && value.p[1] == "slides" && value.li) {
              showNewDisplay();
            }
            if (value.p.length == 7 && value.p[1] == "slides" && value.p[5] == 0) {
              $(".main-slides .slide:nth-child(" + (value.p[2] + 1) + ") .mdl-card__title-text").val(value.oi);
            }
            if (value.p.length == 7 && value.p[1] == "slides" && (value.p[5] == 1 || value.p[5] == 3)) {
              if (doc.at(value.p.slice(0, 6).concat("style")).get() == "subheading") {
                console.log("subheading");
                $(".main-slides .slide:nth-child(" + (value.p[2] + 1) + ") textarea.subheading:nth-child(" + (value.p[5] + 1) + ")").val(value.oi);
              } else {
                $(".main-slides .slide:nth-child(" + (value.p[2] + 1) + ") .mdl-card__supporting-text").val(value.oi);
              }
            }
            if (value.p.length == 7 && value.p[1] == "slides" && value.p[5] == 2) {
              console.log("subheading");
              $(".main-slides .slide:nth-child(" + (value.p[2] + 1) + ") textarea.subheading:nth-child(" + (value.p[5] + 1) + ")").val(value.oi);
            }
          });
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
            slidewrapper = slidewrapper.clone();
            $(".pagenum", slidewrapper).html("Display " + (key + 1).toString());
            slide = value[index];
            $(".stretch", slidewrapper).empty();
            $('<div class="mdl-card mdl-shadow--2dp slide" data-slide="' + index + '" data-display="' + key + '"></div>').addClass(slide["style"]).appendTo($(".stretch", slidewrapper))
            $.each(slide["content"], function(i, val) {
              if (val["style"] == "title") {
                slidewrapper.find(".slide").append('<div class="mdl-card__title mdl-card--expand"><textarea rows="1" class="mdl-card__title-text" placeholder="Add a title">' + escapeHtml(val["content"]) + '</textarea></div>')
              } else if (val["style"] == "subheading") {
                slidewrapper.find(".mdl-card__title").addClass("subheading").append('<textarea rows="1" class="subheading">' + escapeHtml(val["content"]) + '</textarea>')
              } else {
                slidewrapper.find(".slide").append('<textarea class="mdl-card__supporting-text">' + escapeHtml(val["content"]) + '</textarea>')
              }
            });
            slidewrapper.appendTo($(".main-slides"));
          });
          loadColours();
          function uploadSlideTitle(display, slide, content) {
            doc.at(["content", "slides", display, slide, "content", 0, "content"]).set(content);
          }
          $(".main-slides .mdl-card__title-text").blur(function() {
            uploadSlideTitle($(this).parents(".slide").data("display"), $(this).parents(".slide").data("slide"), $(this).val());
          });

          function uploadSlideContent(display, slide, pos, content) {
            doc.at(["content", "slides", display, slide, "content", pos, "content"]).set(content);
          }
          $(".main-slides .mdl-card__supporting-text").blur(function() {
            uploadSlideContent($(this).parents(".slide").data("display"), $(this).parents(".slide").data("slide"), ($(this).parents(".slide").hasClass("speaker") ? 3 : 1), $(this).val());
          });
          $(".main-slides .subheading").blur(function() {
            uploadSlideContent($(this).parents(".slide").data("display"), $(this).parents(".slide").data("slide"), $(this).index(), $(this).val());
          });
        }

        renderSlide(0);

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
          screens = doc.at(['content', 'slides']).get();
          $.each(screens, function(index, value) {
            doc.at(['content', 'slides', index]).push({"style": "content", "content": [{"style": "title", "content": "Add a title"}, {"style": "supporting-text", "content": "Add some content"}]});
          });
        });

        function showNewDisplay() {
          var new_data = $('.main-slides > .slide-wrapper:last').clone();
          $(new_data).children("span.pagenum").html("Display " + ($(".main-slides").children().length + 1).toString());
          new_data.appendTo($(".main-slides"));
        }
        $(".new-screen").click(function() {
          showNewDisplay();
          screens = doc.at(['content', 'slides']);
          snapshot = screens.get();
          screens.push(snapshot[snapshot.length - 1]);
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
        function loadColours() {
          updateSlideColour("primary", doc.at("background").get());
          updateSlideColour("accent", doc.at("accent").get());
          updateSlideColour("text", doc.at("foreground").get());
        }
        loadColours();
        function uploadColour(type, colour) {
          updateSlideColour(type, colour);
          if (type == "primary") {
            doc.at("background").set(colour);
          }
          if (type == "accent") {
            doc.at("accent").set(colour);
          }
          if (type == "text") {
            doc.at("foreground").set(colour);
          }
        }
        $(".primary-colour-list > li").click(function() {
          var colour = $("button", this).css("background-color");
          uploadColour("primary", colour)
        });
        $(".accent-colour-list > li").click(function() {
          var colour = $("button", this).css("background-color");
          uploadColour("accent", colour)
        });
        $(".text-colour-list > li").click(function() {
          var colour = $("button", this).css("background-color");
          uploadColour("text", colour)
        });
    });
    $("#title").autoGrowInput();
};
