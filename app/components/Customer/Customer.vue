<template>
  <Page loaded="pageLoaded">

      <ActionBar>
          <GridLayout width="100%" columns="*, auto, *">
              <Label col="0" class="fa" :text="'fa-bars' | fonticon" @tap="openDrawer"/>
              <Label col="1" :text="customerInfo.Name.Value" class="name" />
          </GridLayout>
      </ActionBar>

      <RadSideDrawer ref="drawer">
          <StackLayout ~drawerContent class="sideStackLayout">
              <Button text="Logga ut" @tap="logout" />
          </StackLayout>

          <GridLayout rows="*, 60" ~mainContent class="mainStackLayout">
              <StackLayout row="0">
                  <customer-info v-if="component == 'info'" :customerInfo="customerInfo" />
                  <customer-documents v-else-if="component == 'documents'" />
                  <meeting v-else-if="component == 'meeting'" />

              </StackLayout>
              <GridLayout row="1" columns="*, *, *">
                  <StackLayout col="0" @tap="component = 'info'">
                      <Label class="fas icon" :text="'fa-address-card' | fonticon" />
                      <Label text="Info" textAlignment="center" fontSize="12"/>
                  </StackLayout>
                  <StackLayout col="1" @tap="component = 'documents'">
                      <Label class="fas icon" :text="'fa-file' | fonticon" />
                      <Label text="Dokument" textAlignment="center" fontSize="12"/>
                  </StackLayout>
                  <StackLayout col="2" @tap="component = 'meeting'">
                      <Label class="fas icon" :text="'fa-users' | fonticon" />
                      <Label text="Möte" textAlignment="center" fontSize="12"/>
                  </StackLayout>
              </GridLayout>
          </GridLayout>
      </RadSideDrawer>
  </Page>
</template>

<script>
  import axios from 'axios'
  import CustomerInfo from './CustomerInfo.vue'
  import CustomerDocuments from './CustomerDocuments.vue'
  import Meeting from './Meeting.vue'
  import Login from '../Login/Login.vue'
  import Startview from '../Startview/Startview.vue'

  export default {
      data() {
          return {
              customerInfo: this.$store.getters.getCustomerInformation,
              component: 'info'
          }
      },
      components: {
          'customer-info': CustomerInfo,
          'customer-documents': CustomerDocuments,
          'meeting': Meeting
      },
      methods: {
          openDrawer() {
              this.$refs.drawer.nativeView.showDrawer();
          },
          onCloseDrawerTap() {
              this.$refs.drawer.nativeView.closeDrawer();
          },
          logout() {
              this.$store.commit('setToken', '')
              this.$navigateTo(Login, {
                  clearHistory: true
              })
          }
      },
      destroyed() {
          this.$store.commit('emptyRecordedFiles')
          this.$store.commit('emptyNotes')
          this.$store.commit('setCustomerInformation', [])
          this.$store.commit('setCustomerDocuments', [])
      },
      updated() {
          console.log("Updated")
      }
  }
</script>

<style scoped lang="scss">

    .icon {
        text-align: center;
        vertical-align: center;
        font-size: 24;
        border-top-width: 1;
        border-top-color: #ddd;
    }

    .fa {
      vertical-align: center;
      text-align: left;
      font-size: 25;
    }

    .name {
        text-align: center;
        width: 80%;
    }

</style>
