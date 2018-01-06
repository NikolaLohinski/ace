<template>
  <div class="join">
    <div class="title">
      Please choose a name
    </div>
    <form @submit.prevent="joinGame">
      <input type="text" v-model="name" maxlength="10" v-focus/>
    </form>
      <div class="title">
        Enter the ID of the game you wish to join
      </div>
    <form @submit.prevent="joinGame">
      <input type="text" v-model="roomId" maxlength="6"/>
    </form>
    <v-touch tag="div"
             :disabled="name.length === 0 || roomId.length === 0"
             class="continue"
             @tap="joinGame">
      Continue
    </v-touch>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        name: '',
        roomId: ''
      };
    },
    methods: {
      getMessageFromServer (data) {
        const head = data['head'];
        const body = data['body'];
        if (head === 'ROOM') {
          this.$store.commit('setRoomId', body['id']);
          this.$store.commit('setPlayers', body['players']);
          this.$store.commit('setLoading', false);
          this.$emit('redirect', 'room');
        } else {
          this.$store.commit('killSocket');
        }
      },
      joinGame () {
        if (this.name.length > 0 && this.roomId.length !== 0) {
          // Set loading status
          this.$store.commit('setLoading', true);
          // Initialize socket
          this.$store.dispatch('initPlayer', this.name).then(/* Success handler */ () => {
            // When it is done, register listener for the room
            this.$store.dispatch('registerListener', {
              callback: this.getMessageFromServer,
              once: true
            }).then(() => {
              // Finally create game
              this.$store.dispatch('send', {
                head: 'JOIN',
                body: {
                  player: this.$store.getters.player,
                  roomId: this.roomId
                }
              }).then(null, (err) => {
                window.console.error(err);
              });
            });
          }, /* Error handler */ (err) => {
            window.console.error(err);
          });
        }
      }
    },
    store: global.store
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../scss/general';
  .join {
    position: absolute;
    top:0;
    left: 0;
    width: 100vw;
    height: 100vh;
    .title {
      margin-top: 5vh;
      font-size: 20px;
      text-align: center;
    }
    form {
      width: 100%;
      text-align: center;
      input {
        background: none;
        border: none;
        border-bottom: 1px solid #434343;
        color: $default-text-color;
        font-size: 5vh;
        max-width: 250px;
        margin-top: 15px;
        text-align: center;
      }
    }
    .continue {
      position: absolute;
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
