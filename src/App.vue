<template>
  <router-view />
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Roboto', sans-serif;
  color: #2b2b2b;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}
</style>