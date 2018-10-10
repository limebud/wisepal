<template>
  <Page loaded="pageLoaded" >
      <ActionBar>
          <GridLayout width="100%" columns="auto, *">
              <SearchBar col="0" hint="Sök..." @submit="search" v-model="searchQuery" style="width: 90%"/>
              <Label class="fa" :text="'fa-bars' | fonticon" @tap="openDrawer" col="1" />
          </GridLayout>
      </ActionBar>

    <RadSideDrawer ref="drawer">
        <StackLayout ~drawerContent class="sideStackLayout">
            <Button text="Logga ut" @tap="logout" />
            <Label text="Close Drawer" color="lightgray" padding="10" style="horizontal-align: center" @tap="onCloseDrawerTap"></Label>
        </StackLayout>

        <StackLayout ~mainContent class="mainStackLayout">
            <SearchResults :searchResult="searchResult" />
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
              searchResult: [],
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
                      this.searchResult = res.data.Result
                  })
                  .catch(error => { console.log(error)})
              } else {
                  this.searchResult = ''
              }
          },
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
      components: {
          SearchResults: SearchResults
      }
    }
</script>

<style scoped lang="scss">
    .fa {
      color: white;
      font-size: 25vw;
      vertical-align: center;
      text-align: center;
    }

    ActionBar {
        background: #9068b9;
        color: #fff;
    }

    Page {
        color: #fff;
    }

    SearchBar {
        color: white;
    }

    ListView {
        background: #9068b9;
    }

    .list-item {
        font-size: 20vw;
        color: white;
        padding: 2vw;
        margin-bottom: 1vw;
    }

</style>
