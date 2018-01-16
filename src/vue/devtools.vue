<template>
  <v-touch tag="div" class="devtools" :toggled="toggled"
           :opened="opened"
           @tap="set">
    <div class="draggable" :id="idDraggable">
      <v-touch class="pin" tag="div"
               @press="toggleMove"
               @tap="tap"
               :pan-options="{threshold: 30}"
               @panend="set"
               @panmove="drag">
      </v-touch>
    </div>
    <nav class="devtools-menu">
      <v-touch tag="div" class="tool" @tap="reload">
        Reload
      </v-touch>
      <v-touch tag="div" class="tool" @tap="reload(true)">
        Hard reload
      </v-touch>
      <v-touch tag="div" class="tool" @tap="clear('settings')">
        Clear settings
      </v-touch>
      <v-touch tag="div" class="tool" @tap="clear('session')">
        Clear session
      </v-touch>
      <v-touch tag="div" class="tool" @tap="clear('devtools')">
        Clear devtools
      </v-touch>
      <v-touch tag="div" class="tool" @tap="opened = false">
        Cancel
      </v-touch>
    </nav>
  </v-touch>
</template>
<script>
  export default {
    data () {
      return {
        max: {
          x: window.innerWidth,
          y: window.innerHeight
        },
        x: 0,
        y: 0,
        toggled: false,
        opened: false,
        idDraggable: 'devtools-menu-id'
      };
    },
    store: global.store,
    methods: {
      reload (hard) {
        window.location.reload(hard);
      },
      clear (section) {
        localStorage[section] = '';
        this.$store.commit('setError', `dev-notification:\n section '${section}' was cleared from localStorage.`);
      },
      toggleMove () {
        this.toggled = !this.toggled;
      },
      tap () {
        if (this.toggled) {
          this.toggled = false;
        } else {
          this.opened = true;
        }
      },
      set ($event) {
        if (this.toggled) {
          this.toggled = false;
          this.move($event.center.x, $event.center.y);
          localStorage['devtools'] = JSON.stringify({ x: this.x, y: this.y });
        }
      },
      move (x, y) {
        const el = document.getElementById(this.idDraggable);
        const elW2 = Math.round(el.clientWidth / 2) + 5;
        const elH2 = Math.round(el.clientHeight / 2) + 5;
        this.x = (x < this.max.x - elW2 && x > elW2) ? x : (x < elW2) ? elW2 : this.max.x - elW2;
        this.y = (y < this.max.y - elH2 && y > elH2) ? y : (y < elH2) ? elH2 : this.max.y - elH2;
        el.style.left = `${this.x - elW2 + 5}px`;
        el.style.top = `${this.y - elH2 + 5}px`;
      },
      drag ($event) {
        if (this.toggled) {
          this.move($event.center.x, $event.center.y);
        }
      }
    },
    watch: {
      max: {
        deep: true,
        handler () {
          this.move(this.x, this.y);
        }
      }
    },
    mounted () {
      if (localStorage['devtools']) {
        const devtoolsOptions = JSON.parse(localStorage['devtools']);
        this.x = devtoolsOptions['x'];
        this.y = devtoolsOptions['y'];
      }
      this.move(this.x, this.y);
      window.addEventListener('resize', () => {
        this.max.x = window.innerWidth;
        this.max.y = window.innerHeight;
      });
    }
  };
</script>
<style lang="sass" type="text/scss" rel="stylesheet/scss" scoped>
  @import '../scss/general';
  .devtools {
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 998;
    width: 100vw;
    height: 100vh;
    transition: background-color 200ms;
    background-color: rgba(0, 0, 0, 0);
    &[toggled] {
      background-color: rgba(0, 0, 0, 0.9);
      pointer-events: auto;
      .draggable {
        transform: scale(1.2);
      }
    }
    &[opened] {
      background-color: rgba(0, 0, 0, 0.9);
      .draggable {
        opacity: 0;
        pointer-events: none;
      }
      .devtools-menu {
        transform: translateY(0%);
        opacity: 1;
        pointer-events: auto;
      }
    }
    .devtools-menu {
      position: absolute;
      left: 0;
      transform: translateY(100%);
      bottom: 0;
      opacity: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      transition: opacity 200ms ease, transform 200ms ease;
      text-align: center;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .tool {
        cursor: pointer;
        font-size: 20px;
        max-width: 90vw;
        width: 250px;
        margin: 15px auto;
        border-radius: 5px;
        color: $lighter-text-color;
        border: 1px solid $lighter-text-color;
        padding: 15px;
        &:hover, &:active {
          background-color: $default-text-color;
          color: #ddd;
        }
        &:last-child {
          margin-bottom: 30px;
        }
        &:first-child {
          margin-top: 30px;
        }
      }
    }
    .draggable {
      transition: opacity 200ms;
      position: absolute;
      pointer-events: auto;
      width: 45px;
      height: 45px;
      left: 15px;
      top: 15px;
      .pin {
        position: relative;
        pointer-events: auto;
        width: 45px;
        height: 45px;
        border: 1px solid $default-text-color;
        border-radius: 50%;
        background: $devtool lightgray;
        background-size: 100% 100%;
        cursor: pointer;
      }
    }
  }
</style>
