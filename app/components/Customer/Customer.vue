<template>
  <Page loaded="pageLoaded">

      <ActionBar>
          <GridLayout width="100%" columns="*, auto, *">
              <Label col="0" class="fa" :text="'fa-arrow-left' | fonticon" @tap="backToStartview" />
              <Label col="1" :text="customerInfo.Name.Value" class="name" />
              <Label col="2" class="fa" :text="'fa-bars' | fonticon" @tap="openDrawer"/>
          </GridLayout>
      </ActionBar>

      <RadSideDrawer ref="drawer">
          <StackLayout ~drawerContent class="sideStackLayout">
              <Button text="Logga ut" @tap="logout" />
              <Label text="Close Drawer" color="lightgray" padding="10" style="horizontal-align: center" @tap="onCloseDrawerTap"></Label>
          </StackLayout>

          <StackLayout ~mainContent class="mainStackLayout">
              <StackLayout>
                  <TabView androidTabsPosition="bottom">
                    <TabViewItem title="Info" iconSource="~/assets/images/personal_icon.png" >
                        <customer-info />
                    </TabViewItem>
                    <TabViewItem title="Dokument" iconSource="~/assets/images/file_icon.png">
                       <customer-documents />
                    </TabViewItem>
                    <TabViewItem title="Möte" iconSource="~/assets/images/meeting_icon.png">
                       <meeting />
                    </TabViewItem>
                  </TabView>
              </StackLayout>
          </StackLayout>
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
              customerInfo: []
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
          },
          backToStartview() {
              this.$navigateTo(Startview, {
                  clearHistory: true
              })
          }
      },
      created() {
          this.customerInfo = this.$store.getters.getCustomerInformation
      }
  }
</script>

<style scoped lang="scss">
    Page {
        color: #513270;
    }

    ActionBar {
        background: #9068b9;
        color: #fff;
        font-size: 25vw;
    }

    .fa {
      font-family: FontAwesome, fontawesome-webfont;
      vertical-align: center;
      text-align: center;
    }

    .name {
        text-align: center;
        width: 80%;
    }

</style>
