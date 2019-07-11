<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <User/>
  </div>
</template>

<script>
import User from './components/user.vue'

export default {
  name: 'app',
  components: {
    User
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
