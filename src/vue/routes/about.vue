<template>
  <div class="about">
    <v-header back-to="/">
      <i class="fa fa-question"></i>{{ $t('about.title') }}
    </v-header>
  </div>
</template>
<script>
  import vHeader from '../utils/header.vue';
  export default {
    store: global.store,
    components: {
      vHeader
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  .about {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
