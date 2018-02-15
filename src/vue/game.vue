<template>
  <div class="game">
    <div class="center-logo">
    </div>
    <component :is="phase">
    </component>
    <cards></cards>
    <v-touch tag="div" class="menu-open menu-button" @tap="menuOpened = true">
      {{ $t('game.menu') }}
    </v-touch>
    <div class="pause" :opened="menuOpened || scoreOpened">
      <nav class="nav-pause menu" :opened="menuOpened">
        <v-touch tag="div" class="nav-menu-button" @tap="$emit('back')">
          {{ $t('quit') }}
        </v-touch>
        <v-touch tag="div" class="nav-menu-button" @tap="menuOpened = false">
          {{ $t('back') }}
        </v-touch>
      </nav>
      <nav class="nav-pause score" :opened="scoreOpened">
        <v-touch tag="div" class="nav-menu-button" @tap="scoreOpened = false">
          {{ $t('back') }}
        </v-touch>
      </nav>
    </div>
    <v-touch tag="div" class="menu-open score-button" @tap="scoreOpened = true">
      {{ $t('game.scores') }}
    </v-touch>
  </div>
</template>

<script>
  import Bets from './bets.vue';
  import Play from './play.vue';
  import Cards from './cards.vue';
  export default {
    data () {
      return {
        menuOpened: false,
        scoreOpened: false,
        phase: 'bets'
      };
    },
    components: {
      Play,
      Bets,
      Cards
    }
  };
</script>

<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import "../scss/general";
  .game {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .center-logo {
      position: absolute;
      background: $center-logo;
      background-size: 100% 100%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 200px;
      min-height: 200px;
      width: 25vw;
      height: 25vw;
      max-width: 300px;
      max-height: 300px;
      z-index: -3;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    .menu-open {
      position: absolute;
      top: 25px;
      cursor: pointer;
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
