<template>
  <div class="status">
    <v-touch tag="div" :key="player.getId()"
             class="other-player"
             v-for="player in otherPlayers"
             :position="where(player.getPosition())"
             :playing="isPlaying(player)">
      <i class="badge" :available="player.isAvailable()"></i>
    </v-touch>
  </div>
</template>
<script>
  export default {
    store: global.store,
    computed: {
      otherPlayers () {
        return Object.values(this.$store.getters.players).filter((p) => p.getId() !== this.$store.getters.me);
      },
      where () {
        return this.$store.getters.position;
      }
    },
    methods: {
      isPlaying (player) {
        return this.$store.getters.game.getWhosTurn() === player.getId() &&
          !this.$store.getters.game.isInter() &&
          !this.$store.getters.game.isEnd();
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  .status {
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
      &[position='3'] {
        top: 50%; left: 0; transform: translate(0, -50%);
        > * {
          top: 50%; left: 10px; transform: translate(0, -50%);
        }
      }
      &[position='2'] {
        top: 0; left: 50%; transform: translate(-50%, 0);
        > * {
          top: 15px; left: 50%; transform: translate(-50%, 0);
        }
      }
      &[position='1'] {
        top: 50%; right: 0; transform: translate(0, -50%);
        > * {
          top: 50%; right: 10px; transform: translate(0, -50%);
        }
      }
    }
  }
</style>
