<template>
  <Page loaded="pageLoaded" actionBarHidden="true">
    <StackLayout>
        <TabView>
          <TabViewItem title="Info">
              <customer-info />
          </TabViewItem>
          <TabViewItem title="Dokument">
             <customer-documents />
          </TabViewItem>
        </TabView>
    </StackLayout>
  </Page>
</template>

<script>
  import axios from 'axios'
  import CustomerInfo from './CustomerInfo.vue'
  import CustomerDocuments from './CustomerDocuments.vue'
  export default {
      data() {
          return {
          }
      },
      components: {
          'customer-info': CustomerInfo,
          'customer-documents': CustomerDocuments
      }
  }
</script>

<style scoped lang="scss">
</style>
