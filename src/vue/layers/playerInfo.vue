<template>
  <div class="player-info">
    <v-touch tag="div" :key="player.getId()"
             @tap="reveal(player)" class="other-player"
             v-for="player in otherPlayers"
             :position="player.getPosition()"
             :playing="isPlaying(player)"
             :show-name="show.indexOf(player.getId()) !== -1">
      <i class="badge" :available="player.isAvailable()"></i>
      <span class="name">
        {{ player.getName() }}
      </span>
    </v-touch>
  </div>
</template>
<script>
  const timeout = 1500;
  export default {
    data () {
      return {
        show: []
      };
    },
    store: global.store,
    computed: {
      otherPlayers () {
        const players = this.$store.getters.players;
        const me = this.$store.getters.me;
        const others = {};
        for (const id in players) {
          if (players.hasOwnProperty(id) && id !== me) others[id] = players[id];
        }
        return others;
      }
    },
    methods: {
      reveal (player) {
        const index = this.show.indexOf(player.getId());
        if (index !== -1) {
          this.show.splice(index, 1);
        } else {
          clearTimeout(global.__timeoutNames);
          const self = this;
          self.show = self.show.concat(player.getId());
          global.__timeoutNames = setTimeout(() => { self.show = []; }, timeout);
        }
      },
      isPlaying (player) {
        return this.$store.getters.game.getWhosTurn() === player.getId();
      }
    },
    mounted () {
      Object.values(this.otherPlayers).map((player) => this.reveal(player));
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  .player-info {
    .other-player {
      width: 100px;
      height: 100px;
      position: fixed;
      pointer-events: auto;
      i.badge {
        position: absolute;
        &:after {
          content: ''; display: inline-block;
          box-shadow: $players-status-box-shadow;
          background: $inactive-player-color;
          width: 12px; height: 12px; border-radius: 50%;
        }
        &[available]:after { background: $active-player-color; }
      }
      &[playing] i.badge:after {
        border: 2px solid transparent;
        border-right-color: $default-text-color;
        animation: turn linear .5s infinite;
        @keyframes turn {
         to {
           transform: rotate(360deg);
         }
        }
      }
      .name {
        position: absolute;
        white-space: nowrap;
        opacity: 0;
        height: 30px;
        line-height: 30px;
        border-radius: 3px;
        padding: 0 10px;
        background-color: $lighter-background;
        box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
        transition: opacity 200ms;
        border: 1px solid $default-border-color;
        &:after {
          content: '';
          border: 6px solid transparent;
          position: absolute;
        }
        &:before {
          content: '';
          border: 8px solid transparent;
          position: absolute;
        }
      }

      &[show-name] .name {
        opacity: 1;
      }
      &[position='3'] {
        top: 50%; left: 0; transform: translate(0, -50%);
        > * {
          top: 50%; left: 10px; transform: translate(0, -50%);
        }
        .name { left: 35px; }
        .name:after {
          height: 2px;
          top: 50%; left: -12px; margin-top: -8px;
          border-right-color: $lighter-background
        }
        .name:before {
          height: 2px;
          top: 50%; left: -16px; margin-top: -10px;
          border-right-color: $default-border-color
        }
      }
      &[position='2'] {
        top: 0; left: 50%; transform: translate(-50%, 0);
        > * {
          top: 5px; left: 50%; transform: translate(-50%, 0);
        }
        .name { top: 35px; }
        .name:after {
          width: 2px;
          top: -12px; left: 50%; margin-left: -8px;
          border-bottom-color: $lighter-background
        }
        .name:before {
          width: 2px;
          top: -16px; left: 50%; margin-left: -10px;
          border-bottom-color: $default-border-color
        }
      }
      &[position='1'] {
        top: 50%; right: 0; transform: translate(0, -50%);
        > * {
          top: 50%; right: 10px; transform: translate(0, -50%);
        }
        .name { right: 30px; }
        .name:after {
          height: 2px;
          top: 50%; right: -12px; margin-top: -8px;
          border-left-color: $lighter-background
        }
        .name:before {
          height: 2px;
          top: 50%; right: -16px; margin-top: -10px;
          border-left-color: $default-border-color
        }
      }
    }
  }
</style>
