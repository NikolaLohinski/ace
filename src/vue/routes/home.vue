<template>
  <div class="home">
    <section>
      <v-link tag="div" to="/offline" class="bubble bubble-big">
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
  .home {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $home-background-image-1920x1080 center;
    background-size: cover;
    @media screen and (max-device-width: 600px),
           screen and (max-width: 600px) {
      background: $home-background-image-400x600 center;
      background-size: cover;
    }
    @media screen and (max-device-width: 800px),
           screen and (max-width: 800px) {
      background: $home-background-image-800x600 center;
      background-size: cover;
    }
    @media screen and (max-device-width: 1280px),
           screen and (max-width: 1280px) {
      background: $home-background-image-1280x720 center;
      background-size: cover;
    }
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
      width: 106px;
      height: 106px;
      &:active {
        background-color: $active-button-background-color;
      }
      table {
        width: 80px;
        height: 80px;
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
        font-size: 18px;
        left: 50%;
        transform: translateX(-50%);
        white-space: nowrap;
        text-align: center;
      }
    }
    .small-nav {
      font-size: 35px;
      width: 30px;
      height: 30px;
      line-height: 28px;
      position: relative;
      display: inline-block;
      padding: 5px;
      border-radius: 50%;
      cursor: pointer;
      color: $bubble-text-color;
      text-shadow: 1px 1px 2px $bubble-text-color;
      text-align: center;
    }
    footer {
      position: absolute;
      width: 100%;
      bottom: 15px;
      left: 0;
      text-align: center;
    }
    section {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }
  }
</style>
