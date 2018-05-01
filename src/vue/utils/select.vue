<template>
  <v-touch tag="a"
           class="cube-btn"
           @pressup.prevent="openSelect"
           @tap.prevent="openSelect">
    <slot></slot>
  </v-touch>
</template>
<script>
  export default {
    data () {
      return {
        picker: null
      };
    },
    methods: {
      openSelect () {
        const self = this;
        (self.picker) ? self.picker.hide() : null;
        setTimeout(() => {
          self.picker = self.$createPicker({
            data: self.options,
            cancelTxt: self.$t('utils.cancel'),
            confirmTxt: self.$t('utils.ok'),
            selectedIndex: self.default,
            onValueChange (val) {
              self.$emit('select', val);
            }
          });
          self.picker.show();
        }, 100);
      }
    },
    props: {
      default: {
        default () {
          return [];
        },
        type: Array
      },
      options: {
        type: Array,
        required: true
      }
    }
  };
</script>