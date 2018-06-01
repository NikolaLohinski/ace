<template>
  <div class="play">
    <v-header back-to="/">
      <i class="fa fa-play"></i>{{ $t('play.title') }}
    </v-header>
    <table>
      <tr><td>
        <table class="configuration">
          <tr>
            <th class="type">{{ $t('play.playerType') }}</th>
            <th class="name">{{ $t('play.players') }}</th>
            <th class="dealer">{{ $t('play.dealer') }}</th></tr>
          <tr class="player" v-for="(player, index) in players">
            <template v-if="player.type === 'USR'">
            <td class="type"><i class="fa fa-user"></i></td>
            <td class="name">
              <cube-input v-model="player.name" :maxlength="8" clearable>
              </cube-input>
            </td>
            </template>
            <template v-if="player.type === 'BOT'">
            <td class="type"><i class="fa fa-microchip"></i></td>
            <td class="name">
              <v-select :default="[[player.level]]"
                        :options="[[{ text: $t('play.ai.1'), value: 0 }]]"
                        @select="(val) => player.level = val[0]"
                        class="options">
              <span class="text">{{ player.name }}</span>
              <span class="value">
                <i class="fa fa-hand-o-right"></i>{{ $t(`play.ai.${player.level}`) }}
              </span>
            </v-select>
            </td>
            </template>
            <td class="dealer">
              <v-touch tag="div" class="radio"
                       :checked="player.dealer"
                       @tap.prevent="selectDealer(index)">
              </v-touch>
            </td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="vertical-align: bottom" :disabled="players.findIndex((p) => p.name.length === 0) !== -1">
        <v-link to="play/offline" class="cube-btn success">
          {{ $t('play.start') }}
        </v-link>
      </td></tr>
    </table>
  </div>
</template>
<script>
  import saveState from 'vue-save-state';

  import vLink from '../utils/link.vue';
  import vHeader from '../utils/header.vue';
  import vSelect from '../utils/select.vue';

  import utils from '../../js/utils.js';
  export default {
    data () {
      return {
        players: [
          { type: 'USR', name: this.$t('utils.you'), dealer: false, level: null },
          { type: 'BOT', name: `${this.$t('play.ai.name')} 1`, dealer: false, level: 1 },
          { type: 'BOT', name: `${this.$t('play.ai.name')} 2`, dealer: false, level: 1 },
          { type: 'BOT', name: `${this.$t('play.ai.name')} 3`, dealer: false, level: 1 }
        ]
      };
    },
    mixins: [saveState],
    methods: {
      confirmGameConfig () {
        for (let k = 0; k < this.players.length; k++) {
          const player = this.players[k];
          if (!player.id) {
            player.id = utils.generateId();
          }
        }
        if (this.players.findIndex((p) => p.dealer) === -1) {
          this.players[Math.floor(4 * Math.random())].dealer = true;
        }
        this.$store.commit('players', this.players);
      },
      getSaveStateConfig () {
        return {
          cacheKey: 'play-config',
          saveProperties: ['players']
        };
      },
      selectDealer (index) {
        for (let k = 0; k < this.players.length; k++) {
          this.players[k].dealer = (k === index) ? !this.players[k].dealer : false;
        }
      }
    },
    components: {
      vHeader,
      vLink,
      vSelect
    },
    beforeRouteLeave (to, from, next) {
      if (to.fullPath.indexOf('play/offline') !== -1) {
        this.confirmGameConfig();
      }
      next();
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  $img-path: '../../img';
  @import '../../scss/colors';
  @import '../../scss/variables';
  @import '../../scss/sizes';
  @import '../../scss/images';
  .play {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    >table {
      width: 100%;
      height: calc(100% - #{$header-height} - 45px);
      margin: 15px auto;
      max-width: 500px;
      td[disabled] {
        pointer-events: none;
        opacity: 0.2;
      }
      .configuration {
        text-align: center;
        margin: 0 auto;
        width: 100%;
        tr {
          &.player >td {
            height: 50px;
            padding: 0 10px;
            line-height: 50px;
            background-color: $lighter-background;
            border-top: 1px solid $default-border-color;
            border-bottom: 1px solid $default-border-color;
            &:first-child {
              border-radius: 4px 0 0 4px;
              border-left: 1px solid $default-border-color;
            }
            &:last-child {
              border-radius: 0 4px 4px 0;
              border-right: 1px solid $default-border-color;
            }
            vertical-align: middle;
          }
          th {
            color: $lighter-text-color;
            font-size: 15px;
            padding: 15px;
          }
          .type {
            width: 30px;
          }
          .name {
            text-align: left;
            .options {
              height: 50px;
              line-height: 50px;
              padding-top: 0;
              padding-bottom: 0;
              border: none;
              vertical-align: middle;
              span {
                display: inline-block;
                &.text {
                  float: left;
                  margin-left: -5px;
                }
                &.value {
                  float: right;
                  font-style: italic;
                  color: $lighter-text-color;
                }
              }
            }
          }
          .dealer {
            width: 50px;
            .radio {
              position: relative;
              top: -2px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: inline-block;
              border: 1px solid $default-border-color;
              vertical-align: middle;
              &[checked] {
                background: $dealer-coin -3px -3px;
                background-size: 46px 46px;
              }
            }
          }
        }
      }
    }
  }
</style>
