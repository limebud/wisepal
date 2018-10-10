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
                <TextField v-model="password" hint="Password" secure="true" @returnPress="login"/>
            </StackLayout>

            <StackLayout class="buttons">
                <Button @tap="login">Logga in</Button>
            </StackLayout>

        </StackLayout>
    </Page>
</template>

<script>
  import axios from 'axios'
  import * as Toast from 'nativescript-toast';
  import * as appSettings from 'tns-core-modules/application-settings'
  import Startview from '../Startview/Startview'

  let $savedPin = appSettings.getString("pin") || ''
  let $savedUsername = appSettings.getString("username") || ''

  export default {
      data() {
          return {
              pin: $savedPin,
              username: $savedUsername,
              password: '',
          }
      },
      methods: {
          login() {
              let pin = this.pin
              let username = this.username
              let password = this.password
              this.$store.dispatch('authRequest', { pin, username, password }).
              then(() => {
                  if (this.$store.getters.getToken) {
                      this.$navigateTo(Startview, {
                          clearHistory: true
                      })
                  }
              })
          }
      }
  }
</script>


<style scoped lang="scss">
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
