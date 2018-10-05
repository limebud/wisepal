<template>
  <StackLayout>
    <ListView separatorColor="transparent" for="document in documents">
      <v-template>
        <GridLayout columns="*, auto, *">
          <GridLayout col="1" columns="auto, *" class="document">
            <Label class="fa" :text="'fa-file-alt' | fonticon" col="0" />
            <Label :text="document.Title.Value" col="1" class="filename"/>
          </GridLayout>
        </GridLayout>
      </v-template>
    </ListView>
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
    ListView {
        margin-top: 1vw;
    }
    .document {
        width: 95%;
        font-size: 20vw;
        padding: 20vw;
        border-radius: 3%;
        border-width: 3px;
        border-color: #ddd;
        margin-top: 10vw;
        vertical-align: center;
    }

    .filename {
        padding-left: 10vw;
    }
</style>
