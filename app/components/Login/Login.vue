<template>
    <Page loaded="pageLoaded" actionBarHidden="true">
        <StackLayout>

            <StackLayout class="header">
                <Image  src="res://logo" class="logo" />
                <Label text="Welcome" class="welcome" />
                <Label textWrap="true" text="See what's going on today" class="msg" />
            </StackLayout>

            <StackLayout class="form">
                <TextField v-model="pin" hint="PIN" />
                <TextField v-model="username" hint="Username" />
                <TextField v-model="password" hint="Password" secure="true" />
            </StackLayout>

            <GridLayout columns="*, *" rows="auto">
                <Label class="h3 m-15" text="Remember me" col="0"/>
                <Switch class="m-15" v-model="rememberMe" col="1"/>
            </GridLayout >

            <StackLayout class="buttons">
                <Button @tap="login">Log in</Button>
                <Label text="Lost your password?" class="forgotPassword" @tap="forgotPassword" />
            </StackLayout>

        </StackLayout>
    </Page>
</template>

<script>
  import axios from 'axios'
  import Search from '../Search/Search'
  import * as Toast from 'nativescript-toast';
  import * as appSettings from 'tns-core-modules/application-settings'

  let $savedPin = appSettings.getString("pin") ? appSettings.getString("pin") : ''
  let $savedUsername = appSettings.getString("username") ? appSettings.getString("username") : ''
  let $savedPassword = appSettings.getString("password") ? appSettings.getString("password") : ''

  export default {
      data() {
          return {
              pin: $savedPin,
              username: $savedUsername,
              password: $savedPassword,
              rememberMe: true
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
                  if (res.data.Success) {
                      this.$store.commit('setToken', res.data.ClientToken)

                      if(this.rememberMe) {
                          appSettings.setString("pin", this.pin)
                          appSettings.setString("username", this.username)
                          appSettings.setString("password", this.password)
                      } else {
                          appSettings.clear()
                      }

                      this.$navigateTo(Search)
                  } else {
                      Toast.makeText(res.data.Messages[0], "long").show()
                  }
              })
              .catch(err => { console.log(err )})
          },
          forgotPassword() {
              console.log("Password forgotten")
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

    .logo {
        width: 40%;
        margin: 5% auto 8%;
    }

    .welcome {
        font-size: 36vw;
        font-weight: bold;
    }

    .msg {
        font-size: 22vw;
        margin-bottom: 7%;
    }

    .forgotPassword {
        margin: 10%;
    }

</style>
