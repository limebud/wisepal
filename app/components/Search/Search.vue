<template>
  <Page loaded="pageLoaded" actionBarHidden="true">
    <GridLayout rows="auto, *, auto">
        <GridLayout row="0" columns="auto,*,auto" class="header">
            <Image col="0" src="~/images/settings.png"/>
            <Label col="1" text="Latest" class="date" />
            <Image col="2" src="~/images/calendar.png"/>
        </GridLayout>
      <ScrollView row="1">
            <ListView v-if="searchResult" class="list-group" for="item in searchResult" @itemTap="onItemTap" style="height:1250px">
              <v-template>
                <FlexboxLayout flexDirection="row" class="list-group-item">
                  <Label :text="item.Name.Value" class="lalala" style="width: 60%"/>
                </FlexboxLayout>
              </v-template>
            </ListView>
      </ScrollView>
      <SearchBar row="2" hint="Search" @submit="search" v-model="searchQuery" />
    </GridLayout>
  </Page>
</template>

<script>
  import axios from 'axios'
  import Customer from '../Customer/Customer'
  export default {
      data() {
          return {
              searchQuery: '',
              searchResult: null,
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
              .catch(error => { console.log(error)})
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
        },
    }
</script>

<style scoped>
    Page {
        background: #9068b9;
        padding: 30%;
        color: #fff;
    }

    SearchBar {
        background: #eee;
        color: black;
    }

    .header {
        height: 7%;
        font-size: 30vw;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10%;
    }

    .lalala {
        color: white;
        padding-left: 0;
    }

</style>
