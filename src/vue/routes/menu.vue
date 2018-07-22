<template>
  <div class="menu">
    <v-header back-to="/play/offline">
      <i class="fa fa-bars"></i>{{ $t('menu.title') }}
    </v-header>
    <table>
      <tr>
        <td style="vertical-align: top">
          <v-switch v-model="config.sortCards" class="item" @change="sortCards">
            {{ $t('menu.sortCards') }}
          </v-switch>
          <v-switch v-model="config.goClockwise" class="item" @change="goClockwise">
            {{ $t('menu.goClockwise') }}
          </v-switch>
        </td>
      </tr>
      <tr>
        <td style="vertical-align: bottom">
          <v-link to="/" class="cube-btn item danger">
            {{ $t('menu.quit') }}
          </v-link>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
  import vLink from '../utils/link.vue';
  import vHeader from '../utils/header.vue';
  import vSwitch from '../utils/switch.vue';
  export default {
    methods: {
      sortCards (bool) {
        this.$store.commit('setConfig', {
          key: 'sortCards',
          value: bool
        });
      },
      goClockwise (bool) {
        this.$store.commit('setConfig', {
          key: 'goClockwise',
          value: bool
        });
      }
    },
    computed: {
      config () {
        return this.$store.getters.config;
      }
    },
    components: {
      vHeader,
      vLink,
      vSwitch
    },
    store: global.store,
    beforeRouteLeave (to, from, next) {
      const self = this;
      if (to.path === '/') {
        self.$createDialog({
          type: 'confirm',
          icon: 'cubeic-danger',
          title: self.$t('utils.warning'),
          content: self.$t('menu.youWillLoseYourCurrentProgress'),
          confirmBtn: self.$t('menu.quit'),
          cancelBtn: self.$t('utils.cancel'),
          onConfirm: () => {
            this.$store.dispatch('clear').then(next);
          }
        }).show();
      } else {
        next();
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  @import '../../scss/variables';
  @import '../../scss/sizes';
  .menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    table {
      width: 100%;
      height: calc(100% - #{$header-height} - 30px);
      margin: 15px auto 0 auto;
      max-width: $max-width-main;
      td {
        margin: 15px auto;
        .item {
          display: block;
          position: relative;
          height: 50px;
          line-height: 50px;
          font-size: 16px;
          margin: -1px auto 0 auto;
          padding: 0;
          &:first-child {
            margin-top: 0;
          }
          @include answer-to-width ('s') {
            border-radius: 0;
          }
        }
      }
    }
  }
</style>
