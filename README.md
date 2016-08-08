# Liveshow

A real-time collaborative presenter view and presentation editor. Currently in development. Editor barely functional.

## Installation

1. Install Redis  
  [Redis](http://redis.io)  
  [Redis for Windows](https://github.com/MSOpenTech/redis)
2. `npm install`

## Running the server

`node server.js`

You currently need to provision the ShareJS instance by setting the 'home' document to the contents of emptypresentation.json because I haven't built a way to automate that yet. You can do this from the client's console once it loads and errors out.

```JS
sharejs.open('home', 'json', function(error, doc) {
  doc.set({"title":"Untitled document","id":"0","presentations":{},"background":"#00bcd4","foreground":"#000000","accent":"#ff4081","accent-foreground":"#ffffff","content":{"slides":[[{"style":"presentation-title","content":[{"style":"title","content":"Add a title"}]},{"style":"speaker","content":[{"style":"title","content":"John Doe"},{"style":"subheading","content":"@example"},{"style":"subheading","content":"Job Title"},{"style":"supporting-text","content":"Add a short bio"}]},{"style":"content","content":[{"style":"title","content":"Add a title"},{"style":"supporting-text","content":"Add some content"}]}]]}});
```
