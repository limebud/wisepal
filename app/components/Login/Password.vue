<template>
    <Page loaded="pageLoaded" actionBarHidden="true">
        <StackLayout>

            <StackLayout class="header">
                <Image  src="res://logo" class="logo" />
                <Label text="Forgot password" class="pass" />
                <Label textWrap="true" text="Enter details" class="msg" />
            </StackLayout>

            <StackLayout class="form">
                <TextField v-model="username" hint="Username" />
                <TextField v-model="email" hint="Email" />
            </StackLayout>

            <StackLayout class="buttons">
                <Button  @tap="newPassword">Get new password</Button>
            </StackLayout>

        </StackLayout>
    </Page>
</template>

<script>
  import axios from 'axios'
  import * as Toast from 'nativescript-toast';

  export default {
      data() {
          return {
          }
      },
      methods: {
          newPassword() {
              Toast.makeText("New password is on the way", "long").show()
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

    .pass {
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
