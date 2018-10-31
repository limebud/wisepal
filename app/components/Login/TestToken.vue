<template>
    <Page actionBarHidden="true">
        <ActivityIndicator textAlignment="center" class="orange vCenter" busy="true"></ActivityIndicator>
    </Page>
</template>

<script>
  import Login from './Login'
  import Startview from '../Startview/Startview'

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
