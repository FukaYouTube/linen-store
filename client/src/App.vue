<template>
  <div id="app">
    <Headers />
    <router-view/>
    <Footer />
  </div>
</template>

<script>
import Headers from './components/header.component'
import Footer from './components/footer.component'

export default {
  name: 'App',
  components: {
    Headers, Footer
  },
}
</script>