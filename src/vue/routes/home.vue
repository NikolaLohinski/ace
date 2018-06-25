<template>
  <div class="home">
    <table class="name">
      <tr class="title">
        <td>A</td>
        <td>
          <div class="logo"></div>
        </td>
        <td>E</td>
      </tr>
      <tr class="subtitle">
        <td>Awesome</td>
        <td class="red">Coinche</td>
        <td>Entertainer</td>
      </tr>
    </table>
    <section>
      <v-link tag="div" to="/play?type=offline" class="bubble bubble-big">
        <table>
          <tr>
            <td><i class="fa fa-user"></i></td>
            <td><i class="fa fa-plus"></i></td>
            <td><i class="fa fa-microchip"></i></td>
          </tr>
          <tr><td colspan="3">vs</td></tr>
          <tr>
            <td><i class="fa fa-microchip"></i></td>
            <td><i class="fa fa-plus"></i></td>
            <td><i class="fa fa-microchip"></i></td>
          </tr>
        </table>
        <div class="name">
          {{ $t('home.playOffline') }}
        </div>
      </v-link>
    </section>
    <footer>
      <v-link tag="div" to="/questions" class="small-nav">
        <i class="fa fa-question"></i>
      </v-link>
      <v-link tag="div" to="/settings" class="small-nav">
        <i class="fa fa-cog"></i>
      </v-link>
    </footer>
  </div>
</template>
<script>
  import vLink from '../utils/link.vue';
  export default {
    store: global.store,
    components: {
      vLink
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  $img-path: '../../img';
  @import '../../scss/images';
  @import '../../scss/sizes';
  .home {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: $general-background;
    table.name {
      width: 50vw;
      max-width: 100%;
      min-width: 280px;
      margin: 15px auto;
      tr.title {
        td {
          font-family: BoldFont;
          text-align: center;
          width: 33.33333%;
          vertical-align: middle;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
          .logo {
            display: inline-block;
            width: 15vw;
            height: 15vw;
            max-width: 150px;
            max-height: 150px;
            min-width: 90px;
            min-height: 90px;
            background: $ace-logo 50% 50%;
            background-size: 135% 135%;
            vertical-align: bottom;
          }
          font-size: 135px;
          line-height: 135px;
          @include answer-to-width ('l') {
            font-size: 13vw;
            line-height: 15vw;
          }
          @include answer-to-width ('m') {
            font-size: 70px;
            line-height: 70px;
          }
          @include answer-to-height ('s') {
            font-size: 60px;
            line-height: 60px;
            .logo {
              max-width: 10vh;
              max-height: 10vh;
              min-width: 70px;
              min-height: 70px;
            }
          }
        }
      }
      tr.subtitle {
        td {
          font-size: 13px;
          color: $lighter-text-color;
          text-align: center;
          width: 33.33333%;
          &.red {
            color: $link-text-color;
          }
          @include answer-to-height ('s') {
            font-size: 10px;
          }
        }
      }
    }
    section {
      position: fixed;
      left: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      text-align: center;
      .bubble {
        position: relative;
        display: inline-block;
        padding: 5px;
        background-color: $bubble-background;
        border: 1px solid $default-border-color;
        border-radius: 50%;
        cursor: pointer;
        color: $default-text-color;
        text-align: center;
        transition: all 200ms ease;
        font-size: 20px;
        width: 96px;
        height: 96px;
        &:active {
          background-color: $active-button-background-color;
          box-shadow: inset 1px 1px 5px $default-text-color;
        }
        table {
          width: 70px;
          height: 70px;
          margin: 0;
          padding: 0;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          td {
            padding-top: 3px;
          }
        }
        .name {
          position: absolute;
          bottom: -25px;
          font-size: 15px;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          text-align: center;
        }
      }
      @include answer-to-height ('m') {
        transform: translateY(-35%);
      }
      @include answer-to-height ('s') {
        .bubble {
          width: 76px;
          height: 76px;
          table {
            width: 50px;
            height: 50px;
            font-size: 13px;
          }
          .name {
            font-size: 15px;
            bottom: -20px;
          }
        }
      }
    }
    footer {
      position: fixed;
      right: 0;
      left: 0;
      bottom: 15px;
      text-align: center;
      height: 50px;
      .small-nav {
        display: inline-block;
        font-size: 30px;
        line-height: 40px;
        width: 40px;
        height: 40px;
        margin: 5px;
        border-radius: 50%;
        cursor: pointer;
        color: $default-text-color;
        text-shadow: 1px 1px 2px $bubble-text-color;
        text-align: center;
      }
    }
  }
</style>
