<template>
  <div class="aspect">
    <div class="stretch">
      <div class="mdl-card mdl-shadow--2dp slide" v-bind:class="slide.type">
        <slide-content v-for="(id, i) in slide.content" :id="id" :key="i"></slide-content>
      </div>
    </div>
  </div>
</template>

<script>
  import SlideContent from './slide-content.vue';
  export default {
    props: ['id'],
    data() {
      return {
        slide: {
          "type": "presentation-title",
          "content": [
            "gmLeKJRJ7fqaNwAr"
          ],
          "_id": "Jcs7adSPkOFb8qNY"
        }
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
          console.log(slide)
        },
        errored(error) {
          // called when loading is failed
          console.log("errored on slide", error)
        }
      }
    }
  }

</script>
