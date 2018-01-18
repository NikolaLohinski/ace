<template>
  <div class="room">
    <div class="content">
      <header>
        <div class="definition">{{ $t('room.roomId') }}</div>
        <div class="room-id">{{ room['id'] }}</div>
      </header>
      <table class="players-list">
        <thead>
          <tr>
            <th>{{ $t('room.playerId') }}</th>
            <th>{{ $t('room.name') }}</th>
            <th class="ready-tag">{{ $t('room.ready') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in room['players']">
            <td>{{ p['id'] }}
              <span class="admin" v-if="p['id'] === room['adminId']">
                {{ `(${$t('room.admin')})` }}
              </span>
            </td>
            <td>{{ p['name'] }}</td>
            <td class="ready-tag">
              {{ (p['ready']) ? $t('room.yes') : $t('room.no') }}
            </td>
          </tr>
          <tr v-for="i in (4 - room['players'].length)">
            <td colspan="3" class="waiting-for-players">
              <div class="small-loader">
                <div class="small-spinner"></div>
              </div>
              {{ $t('room.waitingForPlayers') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <v-touch tag="div"
               class="continue"
               @tap="toggleReady">
      {{ (player['ready']) ? $t('room.cancel') : $t('room.ready') }}
    </v-touch>
    <v-touch tag="div"
             class="back"
             :disabled="player['ready']"
             @tap="$emit('back')">
      {{ $t('room.back') }}
    </v-touch>
  </div>
</template>
<script>
  import Spinner from './spinner.vue';
  export default {
    computed: {
      player () {
        return this.$store.getters.player;
      },
      room () {
        return this.$store.getters.room || {};
      }
    },
    store: global.store,
    methods: {
      keepAlive (timeout) {
        setTimeout(() => {
          this.$store.dispatch('send', {
            head: 'ALIVE',
            body: {
              player: this.player,
              roomId: this.room['id']
            }
          }).then(() => {
            this.keepAlive(timeout);
          }, (err) => {
            console.error(err);
          });
        }, timeout);
      },
      toggleReady (e) {
        e.preventDefault();
        this.$store.dispatch('send', {
          head: 'RDY',
          body: {
            player: this.player,
            ready: !this.player['ready'],
            roomId: this.room['id']
          }
        });
      },
      getMessageFromServer (data) {
        const head = data['head'];
        const body = data['body'];
        if (head === 'ROOM') {
          this.$store.commit('setRoom', body);
          this.$store.dispatch('saveSession');
          this.$store.commit('setLoading', false);
        } else if (head === 'GAME') {
          this.$store.commit('setGame', body);
          this.$store.dispatch('saveSession');
          this.$store.commit('setLoading', false);
          this.$emit('setCurrentView', 'game');
        }
      }
    },
    components: {
      Spinner
    },
    mounted () {
      this.$store.dispatch('registerListener', {
        callback: this.getMessageFromServer
      }).then(() => {
        this.$store.dispatch('saveSession');
      });
      this.keepAlive(30000);
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import './../scss/general';
  .room {
    position: absolute;
    height: 100vh;
    width: 100vw;
    .content {
      @media screen and (max-device-height: 400px),
      screen and (max-height: 400px) {
        height: 100vh;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
      }
      header {
        margin-top: 15px;
        text-align: center;
        > * {
          margin: 0 15px;
        }
        .definition {
          color: $lighter-text-color;
          font-size: 15px;
          line-height: 30px;
          display: inline-block;
        }
        .room-id {
          font-size: 30px;
          display: inline-block;
        }
        @media screen and (min-width: $min-m-width),
        screen and (min-device-width: $min-m-width) {
          .definition {
            font-size: 30px;
            line-height: 60px;
          }
          .room-id {
            font-size: 60px;
          }
        }
      }
      table.players-list {
        text-align: center;
        margin: 15px auto 30px auto;
        width: 75%;
        thead th {
          font-size: 15px;
          color: $lighter-text-color;
          font-weight: normal;
          width: 45%;
          &.ready-tag {
            width: 10%;
          }
        }
        tbody td {
          position: relative;
          padding: 15px;
          width: 45%;
          &.ready-tag {
            width: 10%;
          }
          .admin {
            color: $lighter-text-color
          }
          &.waiting-for-players {
            font-style: italic;
            color: $lighter-text-color;
          }
          .small-loader {
            transform: translateY(-3px);
            text-align: center;
            display: inline-block;
            vertical-align: middle;
            margin: 0 15px;
            > .small-spinner {
              display: block;
              margin: 2.5px auto;
              width: 15px;
              height: 15px;
              border-radius: 50%;
              background: 0 0;
              border: 4px solid #ddd;
              border-bottom-color: #777;
              animation: loading 1.2s infinite linear
            }
            @keyframes loading {
              to {
                transform: rotate(360deg)
              }
            }
          }
        }
      }
    }
    .back,
    .continue {
      &.back {
        left: 15px;
      }
      &.continue {
        right: 15px;
      }
      position: absolute;
      bottom: 15px;
      cursor: pointer;
      &[disabled] {
        pointer-events: none;
        opacity: 0.3;
      }
      &:hover, &:active {
        color: $link-text-color;
      }
    }
  }
</style>
