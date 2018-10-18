<template>
    <Page actionBarHidden="true">
        <ActivityIndicator textAlignment="center" verticalAlignment="center" color="#ff9c00" busy="true"></ActivityIndicator>
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
