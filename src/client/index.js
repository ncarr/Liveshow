import _ from 'lodash';
import Vue from 'vue';
import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';
import hooks from 'feathers-hooks';
import io from 'socket.io-client';
import VueSyncersFeathers from 'vue-syncers-feathers';
import LiveshowSlide from './liveshow-slide.vue';

var serverData;
// Establish a Socket.io connection
const socket = io();

// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
  .configure(socketio(socket))
  .configure(hooks());

Vue.use(VueSyncersFeathers, {
  feathers: app,
  idField: '_id' // 'id' by default. This feather is to be committed.
});

// Get the Feathers services we want to use
/*const userService = app.service('users');
const presentationService = app.service('presentations');*/
const presentationId = '0';
var vm = new Vue({
  el: '#app',
  data: {
    currentSlide: 0,
    presentation: { "title": "", "presentations": {}, "background": "#00bcd4", "foreground": "#ffffff", "accent": "#ff4081", "accent-foreground": "#ffffff", "slides": [["0"]], "_id": "0" }
  },/*
  data: {
    user: {
      authenticated: false
    },
    service: presentationService,
    data: {
      "title": "",
      "presentations": {},
      "background": "#00bcd4",
      "foreground": "#000000",
      "accent": "#ff4081",
      "accent-foreground": "#ffffff",
      "slides": [["Jcs7adSPkOFb8qNY"], ["UpyaPGyQkls45SCE"], ["uUg0oTagRLi7oV8O"]]
    },
    currentSlide: 0
  },

  created() {
    vueModel = this;
    presentationService.get(presentationId).then(function (data) {
      vueModel.data = data;
      serverData = data;
    });

    presentationService.on('updated', function (data) {
      if (!_.isEqual(vueModel.data, data)) {
        console.log(_.isEqual(vueModel.data, data));
        console.log("Updated from web");
        vueModel.data = data;
      }
    });
    presentationService.on('patched', function (data) {
      if (_.isEqual(vueModel.data, data)) {
        console.log("Updated from web");
        console.log(_.isEqual(vueModel.data, data));
        vueModel.data = data;
      }
    });
  },

  watch: {
    data: function (newData) {
      if (!_.isEqual(this.data, serverData)) {
        presentationService.update(presentationId, this.data);
        serverData = this.data
        console.log("updated from DOM");
        console.log("this.data == serverData", _.isEqual(this.data, serverData));
      }
    }
  },*/
  components: {
    LiveshowSlide
  },
  sync: {
    presentation: { // referred as this.item in methods and hooks and computed expression, one single database record, both sync to view and sync to database
      service: 'presentations',
      idField: '_id', // 'id' by default
      id() {
        return presentationId // the id string of the item in database. can be calculated from anything reactive sources, say, data, props and computed, etc.
      },
      loaded() {
        // called when data are laoded or reloaded
        console.log("loaded");
      },
      errored(error) {
        // called when loading is failed
        console.log("errored", error)
      }
    }
  }

});
