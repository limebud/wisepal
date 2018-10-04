<template>
  <Page loaded="pageLoaded">

      <ActionBar>
          <GridLayout width="100%" columns="5*, *">
              <Label  col="1" class="fa" :text="'fa-bars' | fonticon" @tap="openDrawer"/>
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
  export default {
      data() {
          return {
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
    }

    .fa {
      font-family: FontAwesome, fontawesome-webfont;
      color: white;
      font-size: 30vw;
      vertical-align: center;
      text-align: center;
    }

</style>
