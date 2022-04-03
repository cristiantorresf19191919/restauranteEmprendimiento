<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Bienvenido admin management"/>
    <Counter />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Counter from "@/components/Counter.vue"

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
    Counter
  }
}
</script>
