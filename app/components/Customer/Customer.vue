<template>
  <Page loaded="pageLoaded">
      <ActionBar>
          <GridLayout columns="*, auto, *">
              <GridLayout col="1" class="searchBar" columns="*, auto">
                  <TextField col="0" hint="Sök..." returnKeyType="search" @submit="search" v-model="searchQuery" @focus="onFocus" @blur="onBlur" @textChange="searchQ" class="inputField"/>
                  <TextField col="1" v-if="this.$store.getters.getSearchBarActive" class="fas emptyQuery" :text="'fa-times-circle' | fonticon" @tap="emptySearchQuery"/>
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

              <StackLayout row="0" class="heading vCenter">
                  <Label v-if="customerInfo.Name" :text="customerInfo.Name.Value" fontSize="24" textAlignment="center" />
                  <Label v-if="customerInfo.SocialSecurityNumber" row="1" col="1" textWrap="true" :text="customerInfo.SocialSecurityNumber.Value" fontSize="16" textAlignment="center"/>
              </StackLayout>
              <GridLayout row="1">
                  <keep-alive >
                      <component :is="component" :customerInfo="customerInfo" :id="id"/>
                  </keep-alive>
              </GridLayout>

              <GridLayout row="2" columns="*, *, *" class="tabs">
                  <FlexboxLayout flexDirection="column" justifyContent="center" col="0" @tap="component = 'customer-info'" :class="[component == 'customer-info' ? 'orange' : 'none']" >
                      <Label class="fas icon vCenter" :text="'fa-address-card' | fonticon"/>
                      <Label class="tabText vCenter" v-if="component == 'customer-info'" text="Kontakt" textAlignment="center" />
                  </FlexboxLayout>
                  <FlexboxLayout flexDirection="column" justifyContent="center" col="1"  @tap="component = 'customer-documents'" :class="[component == 'customer-documents' ? 'orange' : 'none']" >
                      <Label class="fas icon vCenter" :text="'fa-file' | fonticon"/>
                      <Label class="tabText vCenter" v-if="component == 'customer-documents'" text="Dokument" textAlignment="center"/>
                  </FlexboxLayout>
                  <FlexboxLayout flexDirection="column" justifyContent="center" col="2"  @tap="gotoMeeting" :class="[component == 'meeting' ? 'orange' : 'none']" >
                      <Label class="fas icon vCenter" :text="'fa-users' | fonticon" />
                      <Label class="tabText vCenter" v-if="component == 'meeting'" text="Möte" textAlignment="center"/>
                  </FlexboxLayout>
              </GridLayout>

          </GridLayout>
          <SearchResults row="0" col="0" :searchQuery="searchQuery"/>
        </GridLayout>
      </RadSideDrawer>
  </Page>
</template>

<script>
import * as application from 'tns-core-modules/application'
  import CustomerInfo from './CustomerInfo.vue'
  import CustomerDocuments from './CustomerDocuments.vue'
  import Meeting from './Meeting.vue'
  import SearchResults from '../SearchResults/SearchResults'
  import Menu from '../SideDrawer/Menu.vue'
  export default {
      data() {
          return {
              customerInfo: this.$store.getters.getCustomerInformation || null,
              component: 'customer-info',
              activeClass: 'info',
              searchQuery: '',
              searchResults: this.$store.getters.getSearchResults,
              id: this.$store.getters.getCustomerInformation.Id.Value || null
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
                  this.$store.dispatch('search', {
                      searchQuery: this.searchQuery
                  })
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
      },
  }
</script>

<style scoped lang="scss">
    .icon {
        text-align: center;
        font-size: 24;
        vertical-align: center;
    }

    .tabs {
        background: #513270;
        color: #fff;
    }

    .tabText {
        font-size: 12;
    }
</style>
