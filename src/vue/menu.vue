<template>
  <div class="menu">
    <div class="header">
      <table>
        <tr class="title">
          <td>A</td><td><div class="logo"></div></td><td>E</td>
        </tr>
        <tr class="subtitle">
          <td>Awesome</td><td>Coinche</td><td>Entertainer</td>
        </tr>
      </table>
    </div>
    <nav class="nav-bar">
      <v-touch class="link"
               v-for="link in links"
               :key="link.name"
               tag="div"
               @tap="goTo(link.destination)">
        {{link.name}}
      </v-touch>
    </nav>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        links: [
          { name: 'join room', destination: 'join' },
          { name: 'create room', destination: 'create' },
          { name: 'rules', destination: 'rules' },
          { name: 'about', destination: 'about' }
        ]
      };
    },
    methods: {
      goTo (destination) {
        this.$emit('redirect', destination);
      }
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../scss/general';
  .menu {
    font-family: DefaultFont;
    color: $default-text-color;
    overflow-x: hidden;
    overflow-y: auto;
    width: 100vw;
    height: 100vh;
    .header {
      text-align: center;
      table {
        width: 100vw;
        max-width: 400px;
        margin: 15px auto;
        tr {
          &.title {
            font-size: 60px;
            line-height: 45px;
            text-shadow: 0.5px 0.5px 5px gray;
          }
          &.subtitle {
            font-size: 15px;
            line-height: 0;
            color: $lighter-text-color;
          }
          td {
            width: 33%;
            .logo {
              display: inline-block;
              background-image: $logo;
              background-size: 100% 100%;
              width: 80px;
              height: 80px;
            }
          }
        }
      }
    }
    .nav-bar {
      text-align: center;
      margin: 20px 0;
      @media screen and (min-height: 600px),
      screen and (min-device-height: 600px) {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .link {
        font-size: 20px;
        cursor: pointer;
        padding: 5px 0;
        &:hover, &:active {
          color: $link-text-color;
        }
        &:first-letter {
          text-transform: capitalize;
        }
      }
    }
  }
</style>
