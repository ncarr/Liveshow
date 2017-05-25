<template>
  <div class="aspect">
    <div class="stretch">
      <div class="mdl-card mdl-shadow--2dp slide" :class="slide.type" :style="{'background-color': background, 'color': foreground}">
        <slide-content v-for="(id, i) in slide.content" :id="id" :key="i" :foreground="foreground" :accent="accent"></slide-content>
      </div>
    </div>
  </div>
</template>

<script>
  import SlideContent from './slide-content.vue';
  export default {
    props: ['id', 'presentationBackground', 'presentationForeground', 'presentationAccent'],
    data() {
      return {
        slide: {
          "type": "presentation-title",
          "content": [
            "0"
          ],
          "_id": "0"
        }
      }
    },
    computed: {
      background() {
        if (this.slide.background) {
          return this.slide.background;
        }
        return this.presentationBackground;
      },
      foreground() {
        if (this.slide.foreground) {
          return this.slide.foreground;
        }
        return this.presentationForeground;
      },
      accent() {
        if (this.slide.accent) {
          return this.slide.accent;
        }
        return this.presentationAccent;
      }
    },
    components: {
      SlideContent
    },
    sync: {
      slide: { // referred as this.item in methods and hooks and computed expression, one single database record, both sync to view and sync to database
        service: 'slides',
        idField: '_id', // 'id' by default
        id() {
          return this.id // the id string of the item in database. can be calculated from anything reactive sources, say, data, props and computed, etc.
        },
        loaded() {
          // called when data are laoded or reloaded
          console.log("loaded slide");
          console.log(this.slide)
        },
        errored(error) {
          // called when loading is failed
          console.log("errored on slide", error)
        }
      }
    }
  }

</script>
