<template>
    <StackLayout>
        <StackLayout>
            <ListView class="list-group" for="item in this.$store.getters.getSearchResults" @itemTap="goToSearch">
                <v-template>
                  <GridLayout columns="*, 4*" class="list-group-item">
                    <Label v-if="item.PartyType.Value == 'Person'" class="fas person" :text="'fa-user' | fonticon" col="0"/>
                    <Label v-else class="fas company" :text="'fa-industry' | fonticon" col="0" />
                    <Label :text="item.Name.Value" class="list-item" col="1"/>
                </GridLayout>
                </v-template>
            </ListView>
        </StackLayout>
        <StackLayout v-if="this.$store.getters.getSearchBarActive && searchQuery.length <= 1">
            <Label text="Senast besökta" color="gray" background="#eee" textAlignment="center"/>
            <ListView class="list-group" for="item in this.$store.getters.getRecentVisit" @itemTap="goToRecent" >
                <v-template>
                    <GridLayout columns="*, 4*" class="list-group-item">
                        <Label v-if="item.RecentActivityType.List[0].Selected" class="fas person" :text="'fa-user' | fonticon" col="0" />
                        <Label v-else class="fas company" :text="'fa-industry' | fonticon" col="0" />
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
    .fas {
        font-size: 30;
        vertical-align: center;
        text-align: center;
    }

    .person {
        color: lightblue;
    }

    .company {
        color: gray;
    }

    .list-group {
        background: #eee;
    }

    .row {
        border-bottom-width: 1;
        border-color: #ddd;
        color: #333;
        height: 80;
    }

    .name {
        font-size: 16;
        vertical-align: center;
        font-weight: bold;
    }
</style>
