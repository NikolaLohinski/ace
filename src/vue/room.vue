<template>
  <div class="room">
    <div class="content">
      <header>
        <div class="definition">Room ID</div>
        <div class="room-id">{{ idGame }}</div>
      </header>
      <table class="players-list">
        <thead>
          <tr>
            <th>Player ID</th><th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in players">
            <td class="idPlayer">{{ player['id'] }}</td>
            <td class="name">{{ player['name'] }}</td>
          </tr>
          <tr v-for="i in (4 - players.length)">
            <td colspan="2" class="waiting-for-players">
              <div class="small-loader">
                <div class="small-spinner"></div>
              </div>
              Waiting for players ...</td>
          </tr>
        </tbody>
      </table>
    </div>
    <v-touch tag="div"
               class="ready"
               @tap="toggleReady">
      {{ (ready) ? 'Cancel' : 'Ready' }}
    </v-touch>
  </div>
</template>
<script>
  import Spinner from './utils/spinner.vue';
  export default {
    data () {
      return {
        ready: false
      };
    },
    computed: {
      idGame () {
        return this.$store.getters.idGame;
      },
      idPlayer () {
        return this.$store.getters.idPlayer;
      },
      name () {
        return this.$store.getters.name;
      },
      players () {
        return this.$store.getters.players;
      }
    },
    store: global.store,
    methods: {
      toggleReady () {
        this.ready = !this.ready;
      }
    },
    components: {
      Spinner
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
        thead th {
          font-size: 15px;
          color: $lighter-text-color;
          font-weight: normal;
          width: 50%;
        }
        tbody td {
          position: relative;
          padding: 15px;
          width: 50%;
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
    .ready {
      position: fixed;
      bottom: 15px;
      right: 15px;
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
