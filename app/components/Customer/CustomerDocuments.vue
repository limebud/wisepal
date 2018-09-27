<template>
  <StackLayout>
      <ScrollView>
            <ListView class="list-group" for="document in documents" style="height:1250px">
              <v-template>
                <FlexboxLayout flexDirection="row" class="list-group-item">
                  <Label :text="document.Title.Value" class="list-group-item-heading" style="width: 60%"/>
                </FlexboxLayout>
              </v-template>
            </ListView>
      </ScrollView>
  </StackLayout>
</template>

<script>
  export default {
      name: "customer-documents",
      data() {
          return {
              documents: null
          }
      },
      created() {
          this.documents = this.$store.getters.getCustomerDocuments

      }
    }
</script>

<style scoped lang="scss">
</style>
