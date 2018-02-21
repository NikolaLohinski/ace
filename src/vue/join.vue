<template>
  <div class="join">
    <div class="title">
        {{ $t('join.chooseNickname') }}
    </div>
    <form @submit.prevent="join">
      <input type="text" v-model="name" maxlength="10" v-focus/>
    </form>
      <div class="title">
        {{ $t('join.chooseRoomId') }}
      </div>
    <form @submit.prevent="join">
      <input type="tel" v-model="gameId" maxlength="6"/>
    </form>
    <v-touch tag="div" :disabled="!authorize" class="continue" @tap="join">
      <span v-if="!spin">{{ $t('join.join') }}</span>
      <div v-else class="small-loader">
        <div class="small-spinner"></div>
      </div>
    </v-touch>
    <v-touch tag="div" class="back" @tap="$emit('back')">
      {{ $t('back') }}
    </v-touch>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        name: '',
        gameId: '',
        spin: false
      };
    },
    computed: {
      authorize () {
        return this.name.length > 0 && this.gameId.length > 0;
      }
    },
    store: global.store,
    methods: {
      listener (H, B) {
        this.spin = false;
        if (H === 'GAME') {
          this.$store.commit('setSession', B);
          this.$emit('redirect', 'room');
        }
      },
      join () {
        if (this.authorize) {
          this.spin = true;
          this.$store.dispatch('initSocket').then(() => {
            this.$store.dispatch('registerListener', {
              callback: this.listener,
              H: 'GAME||ERROR',
              once: true
            }).then(() => {
              this.$store.dispatch('send', {
                'H': 'JOIN',
                'B': {
                  'player_name': this.name,
                  'game_id': this.gameId
                }
              }).then(null);
              this.$store.commit('setSettings', {
                setting: 'name',
                value: this.name
              });
            });
          });
        }
      }
    },
    mounted () {
      this.name = this.$store.getters.settings.name;
    }
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
    .back,
    .continue {
      &.back {
        left: 15px;
      }
      &.continue {
        right: 15px;
        min-width: 30px;
        min-height: 20px;
        text-align: right;
        .small-loader {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          position: absolute;
          transition: opacity 200ms;
          > .small-spinner {
            display: block;
            margin: 2.5px auto;
            width: 15px;
            height: 15px;
            border-radius: 50%;
            background: 0 0;
            border: 4px solid #ddd;
            border-bottom-color: #777;
            animation: loading 1.2s infinite linear;
          }
          @keyframes loading {
            to {
              transform: rotate(360deg)
            }
          }
        }
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
