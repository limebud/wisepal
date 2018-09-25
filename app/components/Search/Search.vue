<template>
  <Page loaded="pageLoaded" actionBarHidden="true">
      <StackLayout>
      <SearchBar hint="Sök..." @submit="search" v-model="searchQuery" />
      <ScrollView>
            <ListView class="list-group" for="item in searchResult" @itemTap="onItemTap" style="height:1250px">
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
              searchResult: ''
          }
      },
      methods: {
          search() {
              console.log("searching...")
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
                  console.log(res.data.Result)
                  this.searchResult = res.data.Result
              })
          },
          onItemTap(event) {
              this.$store.commit('setCustomerData', event.item)
              this.$navigateTo(Customer)
          }
      }
  }
</script>

<style scoped lang="scss">
</style>
