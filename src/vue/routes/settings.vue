<template>
  <div class="settings">
    <v-header back-to="/">
      <i class="fa fa-cog"></i>{{ $t('settings.title') }}
    </v-header>
    <table>
      <tr>
        <td>
          <v-select :default="[languages.indexOf(language)]"
                    :options="[languageOptions]"
                    @select="(val) => $store.commit('language', val[0])"
                    class="option">
            <span class="text-language">{{ $t('settings.changeLanguage') }}</span>
            <span class="show-language">
              <i class="fa fa-hand-o-right"></i>{{ $t('currentLanguage') }}
            </span>
          </v-select>
        </td>
      </tr>
      <tr><td style="vertical-align: bottom">
        <v-touch tag="div" class="cube-btn danger" @tap="reset">
          {{ $t('settings.reset') }}
        </v-touch>
      </td></tr>
    </table>
  </div>
</template>
<script>
  import vHeader from '../utils/header.vue';
  import vSelect from '../utils/select.vue';
  export default {
    store: global.store,
    computed: {
      language () {
        return this.$store.getters.language;
      },
      languages () {
        return this.$store.getters.languages;
      },
      languageOptions () {
        const languageOptions = [];
        for (let k = 0; k < this.languages.length; k++) {
          const languageCode = this.languages[k];
          languageOptions.push({
            text: this.$i18n.translateIn(languageCode, 'currentLanguage'),
            value: languageCode
          });
        }
        return languageOptions;
      }
    },
    methods: {
      reset () {
        const self = this;
        self.$createDialog({
          type: 'confirm',
          icon: 'cubeic-danger',
          title: self.$t('utils.warning'),
          content: self.$t('settings.confirmReset'),
          confirmBtn: self.$t('utils.ok'),
          cancelBtn: self.$t('utils.cancel'),
          onConfirm: () => {
            localStorage.clear();
            self.$router.replace('/');
          }
        }).show();
      }
    },
    components: {
      vHeader,
      vSelect
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  @import '../../scss/variables';
  @import '../../scss/sizes';
  .settings {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    table {
      width: 100%;
      margin: 15px auto 0 auto;
      height: calc(100% - #{$header-height} - 45px);
      max-width: 500px;
      td {
        margin: 15px auto;
        .option {
          position: relative;
          display: block;
          height: 50px;
          line-height: 50px;
          font-size: 16px;
          margin: -1px auto 0 auto;
          padding: 0;
          &:first-child {
            margin-top: 0;
          }
          .text-language {
            float: left;
            margin-left: 15px;
          }
          .show-language {
            float: right;
            margin-right: 15px;
            opacity: 0.6;
            font-style: italic;
          }
          @include answer-to-width ('s') {
            border-radius: 0;
          }
        }
      }
    }
  }
</style>
