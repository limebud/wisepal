<template>
    <Page loaded="pageLoaded" actionBarHidden="true">
        <GridLayout columns="*, 5*, *" rows="*, 4*, *, *, *, *, *, *">
            <Image row="1" col="1" src="~/images/logo.png" class="logo" />

            <TextField row="3" col="1" v-model="pin" hint="PIN" />
            <TextField row="4" col="1" v-model="username" hint="Användarnamn" />
            <TextField row="5" col="1" v-model="password" hint="Lösenord" />

            <Button row="6" col="1" @tap="login">Logga in</Button>
        </GridLayout>
    </Page>
</template>

<script>
  import axios from 'axios'
  export default {
      data() {
          return {
              pin: '',
              username: '',
              password: '',
              token: ''
          }
      },
      methods: {
          login() {
              axios.get('/Account/BrokerLogin/', {
                  params: {
                      pin: this.pin,
                      username: this.username,
                      password: this.password
                  }
              })
              .then(res => {
                  this.token = res.data.ClientToken
              })
          }
      }
  }
</script>

<style scoped lang="scss">
    Page {
        background-color: #9ec9e2;
    }
</style>
