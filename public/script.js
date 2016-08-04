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
    });
};
