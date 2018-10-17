<template>
    <Page loaded="pageLoaded" actionBarHidden="true">
        <GridLayout rows="*, *, 2*">

            <StackLayout row="0" class="header">
                <Image  src="res://logo" class="logo" />
            </StackLayout>

            <StackLayout row="1">
                <Label text="Välkommen" class="welcome" />
            </StackLayout>

            <StackLayout row="2" class="form">
                <TextField v-model="pin" hint="PIN" />
                <TextField v-model="username" hint="Username" />
                <TextField v-model="password" hint="Password" secure="true" @returnPress="login"/>
                <Button @tap="login">Logga in</Button>
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
      },
      async beforeCreate() {
          // Skippar inloggning om token är giltig
          await this.$store.dispatch('recentVisit')
          .then(() => {
              if (this.$store.getters.getRecentVisit.length > 0) {
                  this.$navigateTo(Startview)
              }
          })
      }
  }
</script>


<style scoped lang="scss">
    Page {
        background: #513270;
        padding: 30;
        text-align: center;
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
</style>
