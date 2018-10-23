<template>
    <Page loaded="pageLoaded" actionBarHidden="true">
        <GridLayout rows="*, *, 2*" class="loginView">

            <ActivityIndicator row="0" rowSpan="3" verticalAlignment="center" color="#ff9c00" :busy="busy"></ActivityIndicator>

            <StackLayout row="0" class="header">
                <Image  src="res://logo" class="logo" />
            </StackLayout>

            <StackLayout row="1">
                <Label text="Välkommen" class="welcome" />
            </StackLayout>

            <StackLayout row="2" class="form">
                <TextField v-model="pin" hint="PIN"/>
                <TextField v-model="username" hint="Username"/>
                <TextField v-model="password" hint="Password" secure="true" @returnPress="login" returnKeyType="go"/>
                <Button @tap="login" class="loginButton">Logga in</Button>
            </StackLayout>

        </GridLayout>
    </Page>
</template>

<script>
  import axios from 'axios'
  import * as Toast from 'nativescript-toast';
  import * as appSettings from 'tns-core-modules/application-settings'
  import Startview from '../Startview/Startview'

  export default {
      data() {
          return {
              pin: appSettings.getString("pin") || '',
              username: appSettings.getString("username") || '',
              password: 'admin',
              busy: false
          }
      },
      methods: {
          login() {
              if (this.busy == false) {
                  this.busy = true
                  let pin = this.pin
                  let username = this.username
                  let password = this.password
                  this.$store.dispatch('authRequest', { pin, username, password }).
                  then(() => {
                      if (this.$store.getters.getToken) {
                          this.$navigateTo(Startview, {
                              clearHistory: true
                          })
                      } else {
                          this.busy = false
                      }
                  })
              }
          }
      }
  }
</script>


<style scoped lang="scss">

    Page {
        background: #513270;
        text-align: center;
    }

    .loginView {
        padding: 30;
    }

    Textfield {
        text-align: left;
        color: white;
    }

    StackLayout {
        vertical-align: center;
    }


    Label {
        color: white;
    }

    .logo {
        width: 100;
    }

    .welcome {
        font-size: 36;
        font-weight: bold;
    }

    .loginButton {
        height: 48;
    }
</style>
