<template>
  <Page loaded="pageLoaded">

      <ActionBar>
          <GridLayout width="100%" columns="*, auto, *" rows=*, *>
              <Label col="0" row="0" rowspan="2" class="fa" :text="'fa-bars' | fonticon" @tap="openDrawer"/>
              <StackLayout col="1" row="0">
                  <Label :text="customerInfo.Name.Value" class="name" />
                  <Label v-if="customerInfo.SocialSecurityNumber" :text="customerInfo.SocialSecurityNumber.Value" fontSize="12" textAlignment="center"/>
              </StackLayout>
          </GridLayout>
      </ActionBar>

      <RadSideDrawer ref="drawer">
          <StackLayout ~drawerContent class="sideStackLayout">
              <Button text="Logga ut" @tap="logout" />
          </StackLayout>

          <GridLayout rows="*, 60" ~mainContent class="mainStackLayout">

              <StackLayout row="0">
                  <keep-alive>
                      <component :is="component" :customerInfo="customerInfo"/>
                  </keep-alive>
              </StackLayout>

              <GridLayout row="1" columns="*, *, *" class="tabs">
                  <FlexboxLayout flexDirection="column" justifyContent="center" col="0" @tap="component = 'customer-info'" :class="[component == 'customer-info' ? 'active' : 'none']" >
                      <Label class="fas icon" :text="'fa-address-card' | fonticon" verticalAlignment="center" />
                      <Label v-if="component == 'customer-info'" text="Info" textAlignment="center" fontSize="12" verticalAlignment="center"/>
                  </FlexboxLayout>
                  <FlexboxLayout flexDirection="column" justifyContent="center" col="1"  @tap="component = 'customer-documents'" :class="[component == 'customer-documents' ? 'active' : 'none']" >
                      <Label class="fas icon" :text="'fa-file' | fonticon" verticalAlignment="center" />
                      <Label v-if="component == 'customer-documents'" text="Dokument" textAlignment="center" fontSize="12" verticalAlignment="center"/>
                  </FlexboxLayout>
                  <FlexboxLayout flexDirection="column" justifyContent="center" col="2"  @tap="component = 'meeting'" :class="[component == 'meeting' ? 'active' : 'none']" >
                      <Label class="fas icon" :text="'fa-users' | fonticon" verticalAlignment="center" />
                      <Label v-if="component == 'meeting'" text="Möte" textAlignment="center" fontSize="12" verticalAlignment="center"/>
                  </FlexboxLayout>
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
              component: 'customer-info',
              activeClass: 'info'
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
              this.$store.commit('deleteToken')
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
  }
</script>

<style scoped lang="scss">
    .active {
        color: #ff9c00;
        // border-top-color: #ff9c00;
        // border-top-width: 2;
    }

    .icon {
        text-align: center;
        font-size: 24;
    }

    .fa {
      text-align: left;
      vertical-align: center;
      font-size: 25;
    }

    .name {
        text-align: center;
        width: 80%;
    }

    .tabs {
        background: #513270;
        color: #fff;
    }

</style>
