Vue.component('liveshow-slide', {
  props: ['data', 'service'],
  template: `
  <div class="aspect">
    <div class="stretch">
      <div class="mdl-card mdl-shadow--2dp slide" v-bind:class="data.style">
      <template v-for="(content, i) in data.content">
        <div v-if="content.style == 'title'" class="mdl-card__title mdl-card--expand" v-bind:class="(data.content.length > i + 1 && data.content[i + 1].style == 'subheading') ? 'subheading': ''">
          <textarea rows="1" class="mdl-card__title-text" placeholder="Add a title" v-model="content.content"></textarea>
          <textarea v-if="content.slides == 'subheading'" rows="1" class="subheading" v-model="content.content"></textarea>
        </div>
        <textarea v-else class="mdl-card__supporting-text" v-model="content.content"></textarea>
      </template>
      </div>
    </div>
  </div>
  `,
  data() {
    return {
      serverData: {},
      slide: {
        "style": "presentation-title",
        "content": [
          {
            "style": "title",
            "content": "Feathers did not initialize"
          }
        ]
      },
    }
  },
  watch: {
    data: function () {
      presentationService.patch(presentationId, this.data);
      serverData = this.data
      console.log("patched from slide component");
    }
  }
});
