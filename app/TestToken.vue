<template>
    <Page actionBarHidden="true">
        <Image  src="res://logo" class="logo" />
    </Page>
</template>

<script>
  import Login from './components/Login/Login'
  import Startview from './components/Startview/Startview'

  export default {
      beforeCreate() {
          this.$store.dispatch('recentVisit')
          .then(() => {
              if (this.$store.getters.getRecentVisit.length > 0) {
                  this.$navigateTo(Startview, {
                      clearHistory: true
                  })
              } else {
                  this.$navigateTo(Login, {
                      clearHistory: true
                  })
              }
          })
      },
  }
</script>

<style scoped>
Page {
    background: blue;
    color: #fff;
}
