<template>
  <div class="settings">
    <v-header :title="$t('settings.title')"></v-header>
    <section>
      <cube-button @click="showPicker" class="option">
        <span class="text-language">
          {{ $t('settings.changeLanguage') }}
        </span>
        <span class="show-language">
          <i class="fa fa-hand-o-right"></i>
          {{ $t('currentLanguage') }}
        </span>
      </cube-button>
    </section>
  </div>
</template>
<script>
  import vHeader from '../utils/header.vue';
  export default {
    data () {
      return {
        languageOptions: [
          { text: 'English', value: 'en-EN' },
          { text: 'Français', value: 'fr-FR' }
        ]
      };
    },
    store: global.store,
    methods: {
      showPicker () {
        this.picker.show();
      },
      createPicker () {
        const self = this;
        self.picker = self.$createPicker({
          data: [self.languageOptions],
          cancelTxt: self.$t('settings.cancel'),
          confirmTxt: self.$t('settings.set'),
          selectedIndex: [self.languages.indexOf(self.language)],
          onValueChange (selectedVal) {
            self.$store.commit('language', selectedVal[0]);
            self.createPicker();
          }
        });
      }
    },
    computed: {
      language () {
        return this.$store.getters.language;
      },
      languages () {
        return this.$store.getters.languages;
      }
    },
    components: {
      vHeader
    },
    mounted () {
      this.createPicker();
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  .settings {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    section {
      padding: 15px 0;
      width: 100%;
      margin: 0 auto;
      max-width: 500px;
      .option {
        display: block;
        height: 50px;
        font-size: 15px;
        margin: 5px auto;
        .text-language {
          float: left;
        }
        .show-language {
          float: right;
          opacity: 0.6;
          font-style: italic;
        }
        @media screen and (max-width: 500px),
        screen and (max-device-width: 500px) {
          border-radius: 0;
        }
      }
    }
  }
</style>
