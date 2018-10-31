<template>
  <Page loaded="pageLoaded" >
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
            <GridLayout row="0" col="0" rowSpan="2" >
                <Label class="gray vCenter" text="Här är det tomt" textAlignment="center" fontSize="24" />
            </GridLayout>
            <SearchResults row="0" col="0" :searchQuery="searchQuery"/>
        </GridLayout>
    </RadSideDrawer>
  </Page>
</template>

<script>
  import Customer from '../Customer/Customer'
  import Login from '../Login/Login'
  import SearchResults from './SearchResults'
  import Menu from '../SideDrawer/Menu.vue'



  export default {
      data() {
          return {
              searchQuery: '',
              searchResults: this.$store.getters.getSearchResults,
              id: ''
          }
      },
      methods: {
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
          openDrawer() {
              this.$refs.drawer.nativeView.showDrawer();
          },
          logout() {
              this.$store.commit('deleteToken')
              this.$navigateTo(Login, {
                  clearHistory: true
              })
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
      },
      created() {
          this.$store.dispatch('recentVisit')
      },
      components: {
          SearchResults: SearchResults,
          appMenu: Menu
      },
    }
</script>

<style scoped lang="scss">
</style>
