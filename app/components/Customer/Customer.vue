<template>
  <Page loaded="pageLoaded">
      <ActionBar>
          <GridLayout columns="*, auto, *">
              <GridLayout col="1" class="searchBar" columns="*, auto">
                  <TextField col="0" hint="Sök..." returnKeyType="search" @submit="search" v-model="searchQuery" @focus="onFocus" @blur="onBlur" @textChange="searchQ" class="inputField"/>
                  <TextField col="1" v-if="this.$store.getters.getSearchBarActive" class="fas emptyQuery" :text="'fa-times-circle' | fonticon" @tap="emptySearchQuery" borderRadius="100"/>
              </GridLayout>
              <Label class="fa menu" :text="'fa-bars' | fonticon" @tap="openDrawer" col="0" />
          </GridLayout>
      </ActionBar>

      <RadSideDrawer ref="drawer">
          <StackLayout ~drawerContent class="sideStackLayout">
              <appMenu />
          </StackLayout>

          <GridLayout rows="*, auto" columns="*" ~mainContent class="mainStackLayout">

          <GridLayout rows="80, *, 60">

              <StackLayout row="0" class="heading" verticalAlignment="center">
                  <Label :text="customerInfo.Name.Value" fontSize="24" textAlignment="center" />
                  <Label v-if="customerInfo.SocialSecurityNumber" row="1" col="1" textWrap="true" :text="customerInfo.SocialSecurityNumber.Value" fontSize="16" textAlignment="center"/>
              </StackLayout>
              <GridLayout row="1">
                  <keep-alive >
                      <component :is="component" :customerInfo="customerInfo" :id="id"/>
                  </keep-alive>
              </GridLayout>

              <GridLayout row="2" columns="*, *, *" class="tabs">
                  <FlexboxLayout flexDirection="column" justifyContent="center" col="0" @tap="component = 'customer-info'" :class="[component == 'customer-info' ? 'active' : 'none']" >
                      <Label class="fas icon" :text="'fa-address-card' | fonticon" verticalAlignment="center" />
                      <Label v-if="component == 'customer-info'" text="Kontakt" textAlignment="center" fontSize="12" verticalAlignment="center"/>
                  </FlexboxLayout>
                  <FlexboxLayout flexDirection="column" justifyContent="center" col="1"  @tap="component = 'customer-documents'" :class="[component == 'customer-documents' ? 'active' : 'none']" >
                      <Label class="fas icon" :text="'fa-file' | fonticon" verticalAlignment="center" />
                      <Label v-if="component == 'customer-documents'" text="Dokument" textAlignment="center" fontSize="12" verticalAlignment="center"/>
                  </FlexboxLayout>
                  <FlexboxLayout flexDirection="column" justifyContent="center" col="2"  @tap="gotoMeeting" :class="[component == 'meeting' ? 'active' : 'none']" >
                      <Label class="fas icon" :text="'fa-users' | fonticon" verticalAlignment="center" />
                      <Label v-if="component == 'meeting'" text="Möte" textAlignment="center" fontSize="12" verticalAlignment="center"/>
                  </FlexboxLayout>
              </GridLayout>

          </GridLayout>
          <SearchResults row="0" col="0" :searchQuery="searchQuery"/>
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
  import SearchResults from '../Startview/SearchResults'
  import Menu from '../SideDrawer/Menu.vue'
  import * as application from 'tns-core-modules/application'



  export default {
      data() {
          return {
              customerInfo: this.$store.getters.getCustomerInformation,
              component: 'customer-info',
              activeClass: 'info',
              searchQuery: '',
              searchResults: this.$store.getters.getSearchResults,
              id: this.$store.getters.getCustomerInformation.Id.Value
          }
      },
      components: {
          'customer-info': CustomerInfo,
          'customer-documents': CustomerDocuments,
          'meeting': Meeting,
          'SearchResults': SearchResults,
          'appMenu': Menu
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
          },
          goHome() {
              this.$navigateTo(Startview)
          },
          searchQ() {
              setTimeout(() => {
                  this.search()
              }, 200)
          },
          search() {
              if (this.searchQuery.length > 1) {
                  axios.get('/Broker/SearchParties/', {
                      params: {
                          searchQuery: this.searchQuery
                      },
                      headers: {
                          'Authorization': this.$store.getters.getToken,
                          'Culture': 'sv-se'
                      }
                  })
                  .then(res => {
                      this.$store.commit('setSearchResults', res.data.Result)
                  })
                  .catch(error => { console.log(error)})
              } else {
                  this.$store.commit('setSearchResults', [])
              }
          },
          onFocus() {
              this.$store.commit('setSearchBarActive', true)
          },
          onBlur() {
              this.$store.commit('setSearchBarActive', false)
              this.emptySearchQuery()
          },
          emptySearchQuery() {
              this.searchQuery = ''
          },
          gotoMeeting() {
              this.component = 'meeting'
              this.$store.commit('setTempId', this.id)
          },
      },
      created() {
          application.android.on(application.AndroidApplication.activityBackPressedEvent, (args) => {
              this.$store.commit('emptyRecordedFiles')
              this.$store.commit('emptyNotes')
          });
      },
      beforeMount() {
          this.$store.commit('emptyRecordedFiles')
          this.$store.commit('emptyNotes')
          // this.$store.commit('setCustomerInformation', [])
          // this.$store.commit('setCustomerDocuments', [])
      },
  }
</script>

<style scoped lang="scss">
    .active {
        color: #ff9c00;
    }

    .icon {
        text-align: center;
        font-size: 24;
    }
    .tabs {
        background: #513270;
        color: #fff;
    }

    .name {
        text-align: center;
        width: 80%;
    }



    .fa {
        text-align: left;
        vertical-align: center;
        font-size: 25;
    }

    .searchBar {
        width: 80%;
        height: 40;
        font-size: 16;
        border-radius: 10;
        background: #fff;
        color: black;
    }

    .inputField {
        background: #fff;
        border-radius: 10;
    }

    .emptyQuery {
        background: #fff;
    }

</style>
