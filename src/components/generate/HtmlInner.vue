<template>
  <div class="container">
    <iframe class="inner-container" :src="url" scrolling="false"></iframe>
  </div>
</template>
<script>
  export default {
    name: "HtmlInner",
    data() {
      return {
        url: '',
      }
    },

    props: ["url"],

    methods: {},
    created() {
      this.url = this.$route.query.url;

    }
  }
</script>

<style scoped>

  .container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: fixed;
  }

  .inner-container {
    width: 100%;
    height: 100%;
    position: relative;
  }


</style>
