<template>
      <ScrollView>
          <StackLayout>
              <GridLayout columns="*, 4*" rows="*, *, *, *" class="row" v-for="doc in documents" key="doc">
                  <Label row="0" col="0" rowSpan="4" class="far" :text="'fa-file-alt' | fonticon" color="#509aaf"/>
                  <Label row="1" col="1" :text="doc.Title.Value" class="title"/>
                  <Label row="2" col="1" :text="doc.Date.Value" class="date"/>
            </GridLayout>
    </StackLayout>
      </ScrollView>
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
    .row {
        border-bottom-width: 1;
        border-color: #ddd;
        color: #333;
        height: 80;
    }

    .date {
        color: #999;
        font-size: 14;
        vertical-align: center;
    }

    .title {
        font-size: 16;
        vertical-align: center;
        font-weight: bold;
    }

    .far {
        font-size: 34;
        vertical-align: center;
        text-align: center;
    }


</style>
