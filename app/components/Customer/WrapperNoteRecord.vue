<template>
  <Page loaded="pageLoaded">
      <ActionBar>
          <GridLayout columns="*, auto, *">
              <GridLayout col="1" class="searchBar" columns="*, auto">
                  <TextField col="0" hint="Sök..." returnKeyType="search" @submit="search" v-model="searchQuery" @focus="onFocus" @blur="onBlur" @textChange="searchQ" class="inputField"/>
                  <TextField col="1" v-if="this.$store.getters.getSearchBarActive" class="fas emptyQuery" :text="'fa-times-circle' | fonticon" @tap="emptySearchQuery" />
              </GridLayout>
              <Label class="fa menu" :text="'fa-bars' | fonticon" @tap="openDrawer" col="0" />
          </GridLayout>
      </ActionBar>

      <RadSideDrawer ref="drawer">
          <StackLayout ~drawerContent class="sideStackLayout">
              <appMenu />
          </StackLayout>

          <GridLayout rows="*, auto" ~mainContent class="mainStackLayout">
              <StackLayout row="0" rowSpan="2" >
                  <component :is="component" />
              </StackLayout>
              <SearchResults row="0" col="0" :searchQuery="searchQuery"/>
          </GridLayout>
      </RadSideDrawer>
  </Page>
</template>

<script>
  import CustomerInfo from './CustomerInfo.vue'
  import CustomerDocuments from './CustomerDocuments.vue'
  import Meeting from './Meeting.vue'
  import Login from '../Login/Login.vue'
  import Startview from '../Startview/Startview.vue'
  import SearchResults from '../Startview/SearchResults'
  import Note from './Note.vue'
  import Recorder from './Recorder.vue'
  import Player from './Player.vue'
  import Menu from '../SideDrawer/Menu.vue'

  export default {
      data() {
          return {
              searchQuery: '',
              searchResults: this.$store.getters.getSearchResults,
              id: '',
              component: ''
          }
      },
      props: [ 'comp' ],
      created() {
          this.component = this.comp
      },
      components: {
          'player': Player,
          'note': Note,
          'recorder': Recorder,
          'SearchResults': SearchResults,
          'appMenu': Menu
      },
      methods: {
          openDrawer() {
              this.$refs.drawer.nativeView.showDrawer();
          },
          searchQ() {
              setTimeout(() => {
                  this.search()
              }, 200)
          },
          search() {
              if (this.searchQuery.length > 1) {
                  this.$store.dispatch('search', {
                      searchQuery: this.searchQuery
                  })
              } else {
                  this.$store.commit('setSearchResults', [])
              }
          },
          onFocus() {
              this.$store.commit('setSearchBarActive', true)
          },
          onBlur() {
              this.$store.commit('setSearchBarActive', false)
              this.emptySearchQuery()
          },
          emptySearchQuery() {
              this.searchQuery = ''
          },
      }

}
</script>

<style scoped lang="scss">
</style>
