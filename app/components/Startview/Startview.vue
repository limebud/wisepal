<template>
  <Page loaded="pageLoaded" >
      <ActionBar>
          <GridLayout columns="*, auto, *">
              <GridLayout col="1" class="searchBar" columns="*, auto">
                  <TextField col="0" hint="Sök..." @submit="search" v-model="searchQuery" @focus="onFocus" @blur="onBlur" class="inputField"/>
                  <TextField col="1" v-if="searchQuery.length > 0" class="fas emptyQuery" :text="'fa-times-circle' | fonticon" @tap="emptySearchQuery" />
              </GridLayout>
              <Label class="fa menu" :text="'fa-bars' | fonticon" @tap="openDrawer" col="0" />
          </GridLayout>
      </ActionBar>

    <RadSideDrawer ref="drawer">
        <StackLayout ~drawerContent class="sideStackLayout">
            <Button text="Logga ut" @tap="logout" />
        </StackLayout>

        <StackLayout ~mainContent class="mainStackLayout">
            <SearchResults :searchQuery="searchQuery"/>
        </StackLayout>
    </RadSideDrawer>
  </Page>
</template>

<script>
  import axios from 'axios'
  import Customer from '../Customer/Customer'
  import Login from '../Login/Login'
  import SearchResults from './SearchResults'



  export default {
      data() {
          return {
              searchQuery: '',
              searchResults: this.$store.getters.getSearchResults,
              id: ''
          }
      },
      watch: {
          searchQuery() {
              var vm = this
              setTimeout(() => {
                  vm.search()
              }, 200)
          }
      },
      methods: {
          emptySearchQuery() {
              this.searchQuery = ''
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
          onFocus() {
              this.$store.commit('setSearchBarActive', true)
          },
          onBlur() {
              this.$store.commit('setSearchBarActive', false)
          }
      },
      components: {
          SearchResults: SearchResults,
      },
      created() {
          this.$store.dispatch('recentVisit')
      },
      mounted() {
          this.emptySearchQuery()
      }

    }
</script>

<style scoped lang="scss">
    .fa {
      vertical-align: center;
      text-align: left;
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

    .list-item {
        font-size: 18;
        color: #492645;
    }

    .infoRecent {
        text-align: center;
        font-size: 20;
    }

    .inputField {
        background: #fff;
    }

    .emptyQuery {
        background: #fff;
    }

</style>
