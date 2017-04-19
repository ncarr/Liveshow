'use strict';
const slidecontent = require('./slidecontent');
const slide = require('./slide');
const presentation = require('./presentation');
const authentication = require('./authentication');
const user = require('./user');

module.exports = function() {
  const app = this;


  app.configure(authentication);
  app.configure(user);
  app.configure(presentation);
  app.configure(slide);
  app.configure(slidecontent);
};
