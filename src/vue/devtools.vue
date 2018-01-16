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
    <nav class="devtools-menu" :hide="inputOpen || openErrors">
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
      <v-touch tag="div" class="tool" @tap="openErrors = true">
        See last console errors
      </v-touch>
      <v-touch tag="div" class="tool" @tap="openInput('setCurrentView')">
        Go to view
      </v-touch>
      <v-touch tag="div" class="tool" @tap="opened = false">
        Cancel
      </v-touch>
    </nav>
    <nav class="devtools-menu input" :hide="!inputOpen">
      <form @submit.prevent="commit">
        <input type="text" v-model="textInput" v-if="inputOpen" v-focus>
      </form>
        <v-touch tag="div" class="tool" @tap="commit">
        Set
      </v-touch>
      <v-touch tag="div" class="tool" @tap="inputOpen = false">
        Back
      </v-touch>
    </nav>
    <nav class="devtools-menu input" :hide="!openErrors">
      <ul>
        <li v-for="e in errors">{{ e }}</li>
      </ul>
      <v-touch tag="div" class="tool" @tap="openErrors = false">
        Back
      </v-touch>
    </nav>
  </v-touch>
</template>
<script>
  export default {
    data () {
      let x = 0;
      let y = 0;
      if (localStorage['devtools']) {
        const devtoolsOptions = JSON.parse(localStorage['devtools']);
        x = devtoolsOptions['x'];
        y = devtoolsOptions['y'];
      }
      return {
        max: {
          x: window.innerWidth,
          y: window.innerHeight
        },
        x: x,
        y: y,
        toggled: false,
        opened: false,
        idDraggable: 'devtools-menu-id',
        textInput: '',
        inputOpen: false,
        setter: '',
        openErrors: false,
        errors: []
      };
    },
    store: global.store,
    methods: {
      logError (error) {
        if (this.errors.length > 10) {
          this.errors.pop();
          this.errors.splice(0, 0, error);
        } else {
          this.errors.push(error);
        }
      },
      commit () {
        this.$store.commit(this.setter, this.textInput);
        this.inputOpen = false;
        this.opened = false;
      },
      openInput (setter) {
        this.setter = setter;
        this.inputOpen = true;
      },
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
      const originalLog = console.error;
      console.error = (error) => {
        this.logError(error);
        originalLog(error);
      };
      window.addEventListener('error', (e) => console.log(e));
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
      position: fixed;
      left: 0;
      transform: translateY(100%);
      bottom: 0;
      opacity: 0;
      width: 100vw;
      max-height: 100vh;
      pointer-events: none;
      transition: opacity 200ms ease, transform 200ms ease;
      text-align: center;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      &[hide] {
        transform: translateY(100%) !important;
      }
      input {
        font-size: 30px;
        max-width: 90vw;
        width: 250px;
        margin: 15px auto;
        border-radius: 5px;
        color: $lighter-text-color;
        border: none;
        border-bottom: 1px solid $lighter-text-color;
        padding: 15px;
        background: none;
        text-align: center;
      }
      ul {
        text-align: center;
        color: red;
        font-size: 15px;
        padding: 0;
        max-width: 600px;
        margin: 15px auto;
        li {
          margin: 5px auto;
        }
      }
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
