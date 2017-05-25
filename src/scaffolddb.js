'use strict'

const feathers = require('feathers');
const path = require('path');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const middleware = require('./middleware');
const services = require('./services');

const app = feathers();
app.configure(configuration(path.join(__dirname, '..')));

app.configure(hooks())
    .configure(services)
    .configure(middleware);
var content1;
app.service('slidecontents').create({
    "type": "title",
    "content": "Add a title"
}).then(data => {content1 = data._id});
var slide1;
app.service('slides').create({
    "type": "presentation-title",
    "content": [content1]
}).then(data => {slide1 = data._id});
var content2;
app.service('slidecontents').create({
    "type": "title",
    "content": "Add a title"
}).then(data => {content2 = data._id});
var slide2;
app.service('slides').create({
    "type": "presentation-title",
    "content": [content2]
}).then(data => {slide2 = data._id});
var content3;
app.service('slidecontents').create({
    "type": "title",
    "content": "Add a title"
}).then(data => {content3 = data._id});
var slide3;
app.service('slides').create({
    "type": "presentation-title",
    "content": [content3]
}).then(data => {slide3 = data._id});

app.service('presentations').create({
    "title": "",
    "presentations": {},
    "background": "#00bcd4",
    "foreground": "#000000",
    "accent": "#ff4081",
    "accent-foreground": "#ffffff",
    "slides": [[slide1], [slide2], [slide3]],
    "_id": "ZfZvffSZgRtVuTEH"
});
