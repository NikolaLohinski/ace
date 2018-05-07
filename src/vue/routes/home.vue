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
        <vue-simple-markdown class="name"
                             :source="$t('home.playOffline')">
        </vue-simple-markdown>
      </v-link>
    </section>
    <footer>
      <v-link tag="div" to="/about" class="small-nav">
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
    position: absolute;
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
            min-width: 80px;
            min-height: 80px;
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
            font-size: 70px;
            line-height: 70px;
            .logo {
              max-width: 20vh;
              max-height: 20vh;
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
        }
      }
    }
    section {
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      text-align: center;
      .bubble {
        position: relative;
        display: inline-block;
        padding: 5px;
        border: 2px solid $bubble-border-color;
        background-color: $bubble-background;
        box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.51);
        border-radius: 50%;
        cursor: pointer;
        color: $bubble-text-color;
        text-shadow: 1px 1px 2px $bubble-text-color;
        text-align: center;
        transition: all 200ms ease;
        font-size: 20px;
        width: 96px;
        height: 96px;
        &:active {
          background-color: $active-button-background-color;
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
        transform: none;
        top: auto;
        position: relative;
      }
      @include answer-to-height ('s') {
        .bubble {
          width: 76px;
          height: 76px;
          table {
            width: 65px;
            height: 65px;
            font-size: 15px;
          }
          .name {
            font-size: 15px;
            bottom: -20px;
          }
        }
      }
    }
    footer {
      position: absolute;
      right: 0;
      left: 0;
      bottom: 15px;
      text-align: center;
      height: 50px;
      @include answer-to-height ('s') {
        bottom: 0;
      }
      .small-nav {
        display: inline-block;
        font-size: 30px;
        line-height: 40px;
        width: 40px;
        height: 40px;
        margin: 5px;
        border-radius: 50%;
        cursor: pointer;
        color: $bubble-text-color;
        text-shadow: 1px 1px 2px $bubble-text-color;
        text-align: center;
      }
    }
  }
</style>
