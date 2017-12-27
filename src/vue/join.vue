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
      <input type="text" v-model="gameId" maxlength="6"/>
    </form>
    <v-touch tag="div"
             :disabled="name.length == 0 || gameId.length != 6"
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
        gameId: ''
      };
    },
    methods: {
      joinGame () {
        if (this.name.length > 0 && this.gameId.length === 6) {
          this.$store.commit('setLoading', true);
          console.log(`Player ${this.name} wants to join game ${this.gameId}.`);
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
