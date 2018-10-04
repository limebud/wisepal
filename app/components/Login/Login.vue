<template>
    <Page loaded="pageLoaded" actionBarHidden="true">
        <StackLayout>

            <StackLayout class="header">
                <Image  src="res://logo" class="logo" />
                <Label text="Välkommen" class="welcome" />
            </StackLayout>

            <StackLayout class="form">
                <TextField v-model="pin" hint="PIN" />
                <TextField v-model="username" hint="Username" />
                <TextField v-model="password" hint="Password" secure="true" />
            </StackLayout>

            <StackLayout class="buttons">
                <Button @tap="login">Logga in</Button>
            </StackLayout>

        </StackLayout>
    </Page>
</template>

<script>
  import axios from 'axios'
  import Startview from '../Startview/Startview'
  import * as Toast from 'nativescript-toast';
  import * as appSettings from 'tns-core-modules/application-settings'

  let $savedPin = appSettings.getString("pin") || ''
  let $savedUsername = appSettings.getString("username") || ''

  export default {
      data() {
          return {
              pin: $savedPin,
              username: $savedUsername,
              password: '',
              rememberMe: true
          }
      },
      methods: {
          login() {
              console.log("login in")
              axios.get('/Account/BrokerLogin/', {
                  params: {
                      pin: this.pin,
                      username: this.username,
                      password: this.password
                  }
              })
              .then(res => {
                  if (res.data.Success) {
                      this.$store.commit('setToken', res.data.ClientToken)

                      appSettings.setString("pin", this.pin)
                      appSettings.setString("username", this.username)
                      appSettings.setString("token", res.data.ClientToken)

                      this.$navigateTo(Startview, {
                          clearHistory: true
                      })
                  } else {
                      Toast.makeText(res.data.Messages[0], "long").show()
                  }
              })
              .catch(err => { console.log(err )})
          }
      }
  }
</script>


<style scoped>
    Page {
        background-color: #513270;
        padding: 30%;
        text-align: center;
    }

    Textfield {
        text-align: left;
        color: white;
    }


    Label {
        color: white;
    }

    .header {
        margin-bottom: 10%;
    }

    .logo {
        width: 40%;
        margin: 5% auto 8%;
    }

    .welcome {
        font-size: 36vw;
        font-weight: bold;
    }

    .forgotPassword {
        margin: 10%;
    }

</style>
