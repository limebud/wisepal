<template>
  <StackLayout>
    <ListView for="document in documents" class="list-group">
      <v-template>
          <Label :text="document.Title.Value" class="list-group-item" />
      </v-template>
    </ListView>
  </StackLayout>
</template>


<script>
  export default {
      name: "customer-documents",
      data() {
          return {
              documents: this.$store.getters.getCustomerDocuments ? this.$store.getters.getCustomerDocuments : null
          }
      },
      created() {
          this.documents = this.$store.getters.getCustomerDocuments
      }
    }
</script>

<style scoped lang="scss">
    ListView {
        margin-top: 1vw;
    }

</style>
