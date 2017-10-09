# Liveshow

A real-time collaborative presenter view and presentation editor. Currently in development. Editor mostly functional.



## Installation

1. Install Redis  
  [Redis](http://redis.io)  
  [Redis for Windows](https://github.com/MSOpenTech/redis)
2. Clone the repo (`git clone https://github.com/ncarr/liveshow`)
3. `npm install` will install Liveshow and build the client side JS from source.
4. For production, set the `DB` environment variable to a MongoDB URL (for example `mongodb://localhost:27017/liveshow`). You can leave this out for testing, although all data will be wiped when you restart the server.

## Running the server

`npm start`

Liveshow will be hosted at `localhost:8000` unless your `PORT` environment variable states otherwise.

## Building from source

On installation everything should be built for you, but if you make edits to client.js you will need to `npm run build` to expose your changes to the browser.
