<template>
  <div v-if="content.type == 'title'" class="mdl-card__title mdl-card--expand" v-bind:class="beforeSubheading ? 'subheading': ''">
    <textarea rows="1" class="mdl-card__title-text" placeholder="Add a title" v-model="content.content"></textarea>
    <textarea v-if="content.type == 'subheading'" rows="1" class="subheading" v-model="content.content"></textarea>
  </div>
  <textarea v-else class="mdl-card__supporting-text" v-model="content.content"></textarea>
</template>

<script>
  export default {
    props: ['id', 'beforeSubheading'],
    data() {
      return {
        content: {
          "type": "title",
          "content": "Add a title",
          "_id": "gmLeKJRJ7fqaNwAr"
        }
      }
    },
    sync: {
      content: { // referred as this.item in methods and hooks and computed expression, one single database record, both sync to view and sync to database
        service: 'slidecontents',
        idField: '_id', // 'id' by default
        id() {
          return this.id // the id string of the item in database. can be calculated from anything reactive sources, say, data, props and computed, etc.
        },
        loaded() {
          // called when data are laoded or reloaded
          console.log("loaded slide content");
        },
        errored(error) {
          // called when loading is failed
          console.log("errored on slide content")
        }
      }
    }
  }

</script>
