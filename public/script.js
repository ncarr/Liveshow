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
        };

        function pullTitle() {
          title.value = name.get();
        };

        function pushTitle() {
          name.set(title.value);
        };

        pullTitle();

        $(".new-slide").click(function() {
          $('.mdl-navigation').each(function(){
            var new_data = $('a:last', this).clone();
            new_data.html("Slide " + ($(this).children().length + 1).toString())
            new_data.appendTo(this);
          });
        });
        $(".new-screen").click(function() {
          var new_data = $('.main-slides > .slide-wrapper:last').clone();
          $(new_data).children("span.pagenum").html("Display " + ($(".main-slides").children().length + 1).toString())
          new_data.appendTo($(".main-slides"));
        });
    });
};
