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
            <Label text="Senast besökta" class="gray" background="#eee" textAlignment="center"/>
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
              this.goToCustomer()

          },
          goToSearch(event) {
              this.id = event.item.Id.Value
              this.partyType = event.item.PartyType.Value
              this.goToCustomer()
          },
          goToCustomer() {
              if (!this.$store.getters.getRecordingStatus)
              {
                  if (this.partyType === "Person") {
                      this.url = '/person/Get/'
                      this.$store.commit('setPartyType', 'Person')
                  } else {
                      this.url = '/company/Get'
                      this.$store.commit('setPartyType', 'Company')
                  }

                  this.$store.dispatch('goToCustomer', {
                      id: this.id,
                      url: this.url
                  })
                  .then(res => {
                      this.$store.dispatch('recentVisit')
                      this.$store.commit('setSearchResults', [])
                      this.$navigateTo(Customer)
                  })
              } else {
                  alert("Du måste avsluta inspelningen innan du kan lämna den")
              }
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
