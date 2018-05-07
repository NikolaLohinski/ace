<template>
  <div class="play">
    <v-header back-to="/">
      <i class="fa fa-play"></i>{{ $t('play.title') }}
    </v-header>
    <div class="container">
      <table>
        <tr>
          <td style="vertical-align: top">
            <div class="item title">
              <span class="name">
              {{ $t('play.players') }}
              </span>
            </div>
            <div class="item you">
              <i class="fa fa-user"></i>
              <cube-input :maxlength="8"
                          v-model="name"
                          :placeholder="$t('play.pleaseChooseAName')"
                          class="input"
                          clearable>
              </cube-input>
            </div>
            <v-select :default="[AI.level]"
                      :options="[AILevels]"
                      @select="(selection) => updateAI(selection, AI)"
                      class="item"
                      :key="index"
                      v-for="(AI, index) in AIs">
              <span class="name">
                <i class="fa fa-microchip"></i>
                {{ $t('play.ai.name') + ` ${index + 1}`}}</span>
              <span class="value">
                {{ $t(`play.ai.${AI.level}`) }}
              </span>
            </v-select>
          </td>
        </tr>
        <tr>
          <td style="vertical-align: bottom">
            <v-link to="/play/offline" class="cube-btn item success" :disabled="name.length === 0">
              {{ $t('play.start') }}
            </v-link>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
  import Player from '../../js/engine/Player.js';

  import saveState from 'vue-save-state';

  import vLink from '../utils/link.vue';
  import vHeader from '../utils/header.vue';
  import vSelect from '../utils/select.vue';
  export default {
    data () {
      return {
        name: this.$t('utils.you'),
        id: null,
        AIs: [
          { level: 'basic' },
          { level: 'basic' },
          { level: 'basic' }
        ],
        possibleLevels: ['basic']
      };
    },
    mixins: [saveState],
    methods: {
      updateAI (args, AI) {
        AI.level = args[0];
        AI.id = null;
      },
      generateId () {
        let d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
          d += performance.now();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          const r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
      },
      initGame () {
        const players = [{
          'name': this.name,
          'id': this.id,
          'type': 'USR'
        }].concat(this.AIs);
        for (let k = 0; k < players.length; k++) {
          const playerObj = players[k];
          if (!playerObj.id) {
            playerObj.id = this.generateId();
          }
          if (playerObj.level) {
            playerObj.name = `Bot ${k}`;
            playerObj.type = 'BOT';
          }
          players[k] = new Player(playerObj);
        }
        if (players.findIndex((p) => p.dealer) === -1) {
          players[Math.floor(Math.random() * players.length)].dealer = true;
        }
        this.$store.commit('setPlayers', players);
      },
      getSaveStateConfig () {
        return {
          cacheKey: 'play-config',
          saveProperties: ['name', 'id', 'AIs']
        };
      }
    },
    components: {
      vHeader,
      vLink,
      vSelect
    },
    computed: {
      AILevels () {
        const AILevels = [];
        for (let k = 0; k < this.possibleLevels.length; k++) {
          const level = this.possibleLevels[k];
          AILevels.push({
            text: this.$t(`play.ai.${level}`),
            value: level
          });
        }
        return AILevels;
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.fullPath.indexOf('play/offline') !== -1) {
        this.initGame();
      }
      next();
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  @import '../../scss/variables';
  @import '../../scss/sizes';
  .play {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .container {
      position: absolute;
      top: $header-height + 17px;
      width: 100%;
      height: calc(100% - #{$header-height} - 17px);
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      text-align: center;
      table {
        width: 100%;
        height: 100%;
        max-width: 500px;
        margin: 0 auto;
        td {
          &:last-child {
            padding: 15px 0;
          }
          margin: 15px auto;
          .item {
            &.title {
              color: $lighter-text-color;
              font-style: italic;
            }
            position: relative;
            display: block;
            height: 50px;
            line-height: 50px;
            font-size: 16px;
            padding: 0;
            border-bottom-color: $lighter-background;
            &:last-child {
              margin-top: 0;
              border-bottom-color: $default-border-color;
            }
            &.you {
              pointer-events: none;
              border: 1px solid $default-border-color;
              border-bottom: none;
              border-radius: 4px;
              .input {
                pointer-events: auto;
                width: calc(100% - 32px);
                padding-left: 32px;
                height: 100%;
                font-size: 16px;
                z-index: 0;
              }
              i.fa-user {
                position: absolute;
                left: 17px;
                top: 0;
                height: 100%;
                line-height: 50px;
                z-index: 1;
              }
            }
            .name {
              float: left;
              margin-left: 15px;
            }
            .value {
              float: right;
              margin-right: 15px;
              opacity: 0.6;
              font-style: italic;
            }
            i.fa {
              margin-right: 10px;
            }
            @include answer-to-width ('s') {
              border-radius: 0;
            }
          }
        }
      }
    }
  }
</style>
