<template>
    <ListView separatorColor="transparent" class="list-group" for="item in this.$store.getters.getSearchResults" @itemTap="onItemTap">
        <v-template>
          <GridLayout columns="*, 10*, *" class="list-group-item">
            <Label :text="item.Name.Value" class="list-item" col="1"/>
        </GridLayout>
        </v-template>
    </ListView>
</template>


<script>
  import phone from 'nativescript-phone'
  import axios from 'axios'
  import Customer from '../Customer/Customer'

  export default {
      name: "searchResults",
      data() {
          return {
            searchResults: this.$store.getters.getSearchResults,
            url: ''
          }
      },
      methods: {
          onItemTap(event) {
              this.id = event.item.Id.Value

              if (event.item.PartyType.Value === "Person") {
                  this.url = '/person/Get/'
                  this.$store.commit('setPartyType', 'person')
              } else {
                  this.url = '/company/Get'
                  this.$store.commit('setPartyType', 'company')
              }

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
                  axios.get(this.url, {
                      params: {
                          Id: this.id
                      },
                      headers: {
                          'Authorization': this.$store.getters.getToken,
                          'Culture': 'sv-se',
                      }
                  }),
                  axios.post('/Broker/SaveRecentVisit/?partyId=' + this.id, {}, {
                      headers: {
                          'Authorization': this.$store.getters.getToken,
                          'Culture': 'sv-se',
                      }
                  })
              ])
              .then(axios.spread((documentRes, personRes) => {
                  this.$store.commit('setCustomerDocuments', documentRes.data.Result)
                  this.$store.commit('setCustomerInformation', personRes.data.Result)
                  this.$store.dispatch('recentVisit')

                  this.$navigateTo(Customer)
              }))
              .catch(error => {
                  console.log("Error: " + error.response.data.Message)
              })
          },
      }
  }
</script>

<style scoped lang="scss">
    Label {
        color: white;
    }
</style>
