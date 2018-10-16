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

          <StackLayout ~mainContent class="mainStackLayout">
              <StackLayout>
                  <TabView androidTabsPosition="bottom" tabBackgroundColor="#509aaf"  selectedTabTextColor="#fff">
                    <TabViewItem title="Info" iconSource="~/assets/images/personal_icon.png" >
                        <customer-info :customerInfo="customerInfo"/>
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
              customerInfo: this.$store.getters.getCustomerInformation
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
