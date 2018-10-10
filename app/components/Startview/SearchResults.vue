<template>
    <ListView row="1" separatorColor="transparent" v-if="searchResult" class="list-group" for="item in searchResult" @itemTap="onItemTap">
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
      props: {
          searchResult: Array
      },
      methods: {
          onItemTap(event) {
              this.id = event.item.Id.Value

              if (event.item.PartyType.Value === "Person") {
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
              } else {
                  alert("Company")
              }
          },
      }
  }
</script>

<style scoped lang="scss">
    Label {
        color: white;
    }
</style>
