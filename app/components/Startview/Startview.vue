<template>
  <Page loaded="pageLoaded" >
      <ActionBar>
          <GridLayout width="100%" columns="auto, *">
              <SearchBar col="0" hint="Sök..." @submit="search" v-model="searchQuery" style="width: 90%" />
              <Label class="fa" :text="'fa-bars' | fonticon" @tap="openDrawer" col="1" />
          </GridLayout>
      </ActionBar>

    <RadSideDrawer ref="drawer">
        <StackLayout ~drawerContent class="sideStackLayout">
            <Button text="Logga ut" @tap="logout" />
            <Label text="Close Drawer" color="lightgray" padding="10" style="horizontal-align: center" @tap="onCloseDrawerTap"></Label>
        </StackLayout>

        <StackLayout ~mainContent class="mainStackLayout">
            <SearchResults/>

            <StackLayout class="recent">
                <Label text="Senast besökta (test)" color="black"/>
                <ListView col="1" row="1" if="this.$store.getters.getSearchFocused" separatorColor="transparent" class="list-group" for="item in this.$store.getters.getRecentVisit">
                    <v-template>
                        <Label :text="item.Name.Value" class="list-item" col="1"/>
                    </v-template>
                </ListView>
            </StackLayout>

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
          showRecent() {
            console.log(this.$store.getters.getRecentVisit)
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
              this.$store.commit('setToken', '')
              this.$navigateTo(Login, {
                  clearHistory: true
              })
          }
      },
      components: {
          SearchResults: SearchResults
      },
      created() {
          this.$store.dispatch('recentVisit')
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

    .list-item {
        font-size: 20vw;
        color: white;
        padding: 2vw;
        margin-bottom: 1vw;
    }

    ListView {
        background: #9068b9;
    }

    .recent {
        margin: 20vh 20vw;
    }
</style>
