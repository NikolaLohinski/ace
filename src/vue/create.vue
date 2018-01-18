<template>
  <div class="create">
    <div class="title">
      {{ $t('join.chooseNickname') }}
    </div>
    <form @submit.prevent="createGame">
      <input type="text" v-model="name" v-focus />
    </form>
    <v-touch tag="div"
             :disabled="name.length == 0"
             class="continue"
             @tap="createGame">
      {{ $t('join.continue') }}
    </v-touch>
    <v-touch tag="div"
             class="back"
             @tap="$emit('back')">
      {{ $t('join.back') }}
    </v-touch>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        name: ''
      };
    },
    methods: {
      getMessageFromServer (data) {
        const head = data['head'];
        const body = data['body'];
        if (head === 'ROOM') {
          this.$store.commit('setRoom', body);
          this.$store.commit('setLoading', false);
          this.$emit('redirect', 'room');
        }
      },
      createGame () {
        if (this.name.length > 0) {
          // Set loading status
          this.$store.commit('setLoading', true);
          // Initialize socket
          this.$store.dispatch('initPlayer', this.name).then(() => {
            // When it is done, register listener for the room
            this.$store.dispatch('registerListener', {
              callback: this.getMessageFromServer,
              once: true
            }).then(() => {
              // Finally create game
              this.$store.dispatch('send', {
                head: 'CREATE',
                body: this.$store.getters.player
              });
            });
          });
        }
      }
    },
    store: global.store,
    mounted () {
      if (this.$store.getters.name) {
        this.name = this.$store.getters.name;
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../scss/general';
  .create {
    position: absolute;
    top:0;
    left: 0;
    width: 100vw;
    height: 100vh;
    .title {
      margin-top: 45px;
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
        margin-top: 5px;
        text-align: center;
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
