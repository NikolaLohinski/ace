<template>
  <div class="scores">
    <v-header back-to="/offline">
      <i class="fa fa-trophy"></i>{{ $t('scores.title') }}
    </v-header>
  </div>
</template>
<script>
  import vHeader from '../utils/header.vue';
  export default {
    components: {
      vHeader
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  .scores {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
