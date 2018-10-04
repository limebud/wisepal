<template>
  <Page loaded="pageLoaded" >
      <ActionBar>
          <GridLayout width="100%" columns="5*, *">
              <SearchBar col="0" hint="Sök..." @submit="search" v-model="searchQuery" />
              <Label class="fa" :text="'fa-bars' | fonticon" @tap="openDrawer" col="1" />
          </GridLayout>
      </ActionBar>

    <RadSideDrawer ref="drawer">
        <StackLayout ~drawerContent class="sideStackLayout">
            <Button text="Logga ut" @tap="logout" />
            <Label text="Close Drawer" color="lightgray" padding="10" style="horizontal-align: center" @tap="onCloseDrawerTap"></Label>
        </StackLayout>

        <StackLayout ~mainContent class="mainStackLayout">
            <ListView row="1" separatorColor="transparent" v-if="searchResult" class="list-group" for="item in searchResult" @itemTap="onItemTap">
                <v-template>
                  <GridLayout columns="*, 10*, *" class="list-group-item">
                    <Label :text="item.Name.Value" class="list-item" col="1"/>
                </GridLayout>
                </v-template>
            </ListView>
        </StackLayout>
    </RadSideDrawer>
  </Page>
</template>

<script>
  import axios from 'axios'
  import Customer from '../Customer/Customer'
  import Login from '../Login/Login'
  export default {
      data() {
          return {
              searchQuery: '',
              searchResult: '',
              id: ''
          }
      },
      watch: {
          searchQuery(newSearch, oldSearch) {
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
          onItemTap(event) {
              this.id = event.item.Id.Value

              axios.all([
                  axios.get('/Document/GetDocumentsByPartyId/', {
                      params: {
                          Id: this.id
                      },
                      headers: {
                          'Authorization': this.$store.getters.getToken,
                          'Culture': 'sv-se'
                      }
                  }),
                  axios.get('/person/Get/', {
                      params: {
                          Id: this.id
                      },
                      headers: {
                          'Authorization': this.$store.getters.getToken,
                          'Culture': 'sv-se'
                      }
                  })
              ])
              .then(axios.spread((documentRes, personRes) => {
                  this.$store.commit('setCustomerDocuments', documentRes.data.Result)
                  this.$store.commit('setCustomerInformation', personRes.data.Result)
                  this.$navigateTo(Customer)
              }))
              .catch(error => console.log(error))
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
          },
          fastCall() {
              alert("Ja / Nej?")
          }

        }
    }
</script>

<style scoped>
    .fa {
      font-family: FontAwesome, fontawesome-webfont;
      color: white;
      font-size: 30vw;
      vertical-align: center;
      text-align: center;
    }

    ActionBar {
        background: #9068b9;
        color: #fff;
    }

    Page {
        color: #fff;
        background: #513270;
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
