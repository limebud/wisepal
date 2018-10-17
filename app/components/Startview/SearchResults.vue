<template>
    <StackLayout>
        <StackLayout>
            <ListView separatorColor="transparent" class="list-group" for="item in this.$store.getters.getSearchResults" @itemTap="goToSearch">
                <v-template>
                  <GridLayout columns="*, 10*, *" class="list-group-item">
                    <Label :text="item.Name.Value" class="list-item" col="1"/>
                </GridLayout>
                </v-template>
            </ListView>
        </StackLayout>
        <StackLayout v-if="this.$store.getters.getSearchBarActive && searchQuery.length <= 1">
            <Label text="Senast besökta" color="gray" textAlignment="center"/>
            <ListView  separatorColor="transparent" class="list-group" for="item in this.$store.getters.getRecentVisit" @itemTap="goToRecent" >
                <v-template>
                  <GridLayout columns="*, 10*, *" class="list-group-item">
                    <Label :text="item.Name.Value" class="list-item" col="1"/>
                  </GridLayout>
                </v-template>
            </ListView>
        </StackLayout>
</StackLayout>
</template>

<script>
  import axios from 'axios'
  import Customer from '../Customer/Customer'

  export default {
      name: "searchResults",
      data() {
          return {
            searchResults: this.$store.getters.getSearchResults,
            url: '',
            id: '',
            partyType: ''
          }
      },
      props: [
          'searchQuery'
      ],
      methods: {
          goToRecent(event) {
              this.id = event.item.PartyId.Value
              this.partyType = event.item.RecentActivityType.List[0].Selected ? "Person" : "Company"
              this.onItemTap()

          },
          goToSearch(event) {
              this.id = event.item.Id.Value
              this.partyType = event.item.PartyType.Value
              this.onItemTap()
          },
          onItemTap() {
              if (this.partyType === "Person") {
                  this.url = '/person/Get/'
                  this.$store.commit('setPartyType', 'Person')
              } else {
                  this.url = '/company/Get'
                  this.$store.commit('setPartyType', 'Company')
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
                  this.$store.commit('setSearchResults', [])
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
        color: #492645;
    }

    .list-group {
        width: 90%;
        background: #eee;
    }
</style>
