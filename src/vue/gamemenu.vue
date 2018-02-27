<template>
  <div class="gamemenu">
    <v-touch tag="div" class="menu-open menu-button" @tap="pauseGame('menu')">
      {{ $t('game.menu') }}
    </v-touch>
    <v-touch tag="div" class="menu-open score-button" @tap="pauseGame('scores')">
      {{ $t('game.scores') }}
    </v-touch>
    <div class="pause" :opened="pause !== ''">
      <nav class="nav-pause menu" :opened="pause === 'menu'">
        <v-touch tag="div" class="nav-menu-button" @tap="$emit('quit')">
          {{ $t('quit') }}
        </v-touch>
        <v-touch tag="div" class="nav-menu-button" @tap="unPause">
          {{ $t('back') }}
        </v-touch>
      </nav>
      <nav class="nav-pause score" :opened="pause === 'scores'">
        <v-touch tag="div" class="nav-menu-button" @tap="unPause">
          {{ $t('back') }}
        </v-touch>
      </nav>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        pause: ''
      };
    },
    methods: {
      unPause () {
        this.pause = '';
        this.$emit('pause', false);
      },
      pauseGame (pause) {
        this.pause = pause;
        this.$emit('pause', true);
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../scss/general';
  .gamemenu {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 10;
    .menu-open {
      position: absolute;
      top: 25px;
      cursor: pointer;
      pointer-events: auto;
      &:hover, &:active {
        color: $link-text-color;
      }
      &.menu-button {
        right: 25px;
      }
      &.score-button {
        left: 25px;
      }
      @media screen and (max-device-width: $max-xs-width),
       screen and (max-width: $max-xs-width) {
        &.menu-button {
          right: 15px;
        }
        &.score-button {
          left: 15px;
        }
      }
    }
    .pause {
      pointer-events: none;
      position: absolute;
      z-index: 50;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
      transition: background-color 200ms;
      background-color: rgba(0, 0, 0, 0);
      &[opened] {
        pointer-events: auto;
        background-color: rgba(0, 0, 0, 0.9);
      }
      .nav-pause {
        position: fixed;
        left: 0;
        transform: translateY(100%);
        bottom: 0;
        opacity: 0;
        width: 100vw;
        max-height: 100vh;
        transition: opacity 200ms ease, transform 200ms ease;
        text-align: center;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        &[opened] {
          opacity: 1;
          transform: translateY(0%);
        }
        .nav-menu-button {
          cursor: pointer;
          font-size: 20px;
          max-width: 90vw;
          width: 250px;
          margin: 15px auto;
          border-radius: 5px;
          color: $lighter-text-color;
          border: 1px solid $lighter-text-color;
          padding: 15px;
          &:hover, &:active {
            background-color: $default-text-color;
            color: #ddd;
          }
          &:last-child {
            margin-bottom: 30px;
          }
          &:first-child {
            margin-top: 30px;
          }
        }
      }
    }
  }
</style>
