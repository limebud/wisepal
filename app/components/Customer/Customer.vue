<template>
  <Page loaded="pageLoaded" actionBarHidden="true">
    <StackLayout>
        <Label text="Hello there" />
    </StackLayout>
  </Page>
</template>

<script>
  import axios from 'axios'
  export default {
      data() {
          return {
          }
      },
      methods: {
      },
      created() {
          console.log(this.$store.getters.getCustomer)
      }
  }
</script>

<style scoped lang="scss">
</style>
