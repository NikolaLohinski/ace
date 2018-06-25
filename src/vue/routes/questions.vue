<template>
  <div class="about">
    <v-header back-to="/">
      <transition mode="out-in" name="fade">
      <span v-if="opened" key="opened">
          <i class="fa fa-question"></i> {{ $t(`questions.${opened}.title`) }}
      </span>
      <span v-else="opened" key="not-opened">
          <i class="fa fa-question"></i> {{ $t(`questions.title`) }}
      </span>
      </transition>
    </v-header>
    <transition name="down">
      <div class="container" v-if="opened">
        <vue-simple-markdown class="section"
                             :source="$t(`questions.${opened}.content`)">
        </vue-simple-markdown>
      </div>
    </transition>
    <transition name="up">
      <div class="container container-list" v-if="!opened">
        <v-touch tag="div" v-for="section in sections"
                 :key="section"
                 @tap="opened = section"
                 class="cube-btn section-link">
          {{ $t(`questions.${section}.title`) }}
        </v-touch>
      </div>
    </transition>
    <transition name="down">
    <v-touch tag="div" class="cube-btn back" v-if="opened"
             @tap="opened = null">
      {{ $t('utils.back') }}
    </v-touch>
    </transition>
  </div>
</template>
<script>
  import saveState from 'vue-save-state';
  import vHeader from '../utils/header.vue';
  export default {
    data () {
      return {
        sections: ['rules', 'about'],
        opened: null
      };
    },
    mixins: [saveState],
    methods: {
      getSaveStateConfig () {
        return {
          cacheKey: 'questions',
          saveProperties: ['opened']
        };
      }
    },
    store: global.store,
    components: {
      vHeader
    },
    beforeRouteLeave (to, from, next) {
      this.opened = null;
      this.saveState();
      next();
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss">
  @import '../../scss/variables';
  @import '../../scss/colors';
  .about {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .container {
      position: absolute;
      top: $header-height + 15px;
      left: 50%;
      height: calc(100% - #{$header-height} -  85px);
      width: 100%;
      &.container-list {
        height: calc(100% - #{$header-height} - 30px);
        padding-top: 15px;
      }
      -webkit-overflow-scrolling: touch;
      overflow-y: auto;
      max-width: $max-width-main;
      transform: translate(-50%, 0);
      img {
        display: block;
        margin: 15px auto;
        max-width: 100px;
        &[alt='icon'] {
          width: 20px;
          display: inline-block;
          margin: auto;
          vertical-align: middle;
        }
      }
      .cube-btn {
        border-bottom: none;
        &:last-child {
          border-bottom: 1px solid $default-border-color;
        }
      }
      .section {
        margin: 10px;
        text-align: justify;
        font-size: 15px;
        line-height: 20px;
      }
    }
    .back {
      position: fixed;
      bottom: 10px;
      width: 100%;
      left: 50%;
      transform: translate(-50%, 0);
      max-width: $max-width-main;
    }
  }
  .up-enter-active,
  .up-leave-active,
  .down-enter-active,
  .down-leave-active,
  .fade-enter-active,
  .fade-leave-active {
    transition: all 250ms ease;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .down-enter,
  .down-leave-to {
    transform: translate(-50%, 150vh) !important;
  }
  .up-enter,
  .up-leave-to {
    transform: translate(-50%, -150vh) !important;
  }
</style>
