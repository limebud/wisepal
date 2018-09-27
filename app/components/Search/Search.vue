<template>
  <Page loaded="pageLoaded" actionBarHidden="true">
      <StackLayout>
      <SearchBar hint="Sök..." @submit="search" v-model="searchQuery" />
      <ScrollView>
            <ListView v-if="searchResult" class="list-group" for="item in searchResult" @itemTap="onItemTap" style="height:1250px">
              <v-template>
                <FlexboxLayout flexDirection="row" class="list-group-item">
                  <Label :text="item.Name.Value" class="list-group-item-heading" style="width: 60%"/>
                </FlexboxLayout>
              </v-template>
            </ListView>
      </ScrollView>
  </StackLayout>
  </Page>
</template>

<script>
  import axios from 'axios'
  import Customer from '../Customer/Customer'
  export default {
      data() {
          return {
              searchQuery: '',
              searchResult: false,
              id: ''
          }
      },
      methods: {
          search() {
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
            }
          }
         }
</script>

<style scoped lang="scss">
</style>
