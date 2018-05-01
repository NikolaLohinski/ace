<template>
  <div class="menu">
    <v-header back-to="/offline">
      <i class="fa fa-bars"></i>{{ $t('menu.title') }}
    </v-header>
    <table>
      <tr>
        <td style="vertical-align: bottom">
          <v-link to="/" class="cube-btn item danger">
            {{ $t('menu.quit') }}
          </v-link>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
  import vLink from '../utils/link.vue';
  import vHeader from '../utils/header.vue';
  export default {
    components: {
      vHeader,
      vLink
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../../scss/colors';
  @import '../../scss/variables';
  .menu {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    table {
      width: 100%;
      height: calc(100% - #{$header-height} - 30px);
      margin: 1px auto 0 auto;
      max-width: 500px;
      td {
        margin: 15px auto;
        .item {
          display: block;
          position: relative;
          height: 70px;
          line-height: 70px;
          font-size: 18px;
          margin: -1px auto 0 auto;
          padding: 0;
          &:first-child {
            margin-top: 0;
          }
          @media screen and (max-width: 500px),
          screen and (max-device-width: 500px) {
            border-radius: 0;
          }
        }
      }
    }
  }
</style>
