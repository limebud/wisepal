<template>
      <ScrollView>
          <StackLayout>
              <GridLayout columns="*, 4*" rows="*, *, *, *" class="row" v-for="(doc, index) in documents" :key="index">
                  <Label row="0" col="0" rowSpan="4" class="far blue iconSize vCenter" :text="'fa-file-alt' | fonticon"/>
                  <Label row="1" col="1" :text="doc.Title.Value" class="title vCenter"/>
                  <Label row="2" col="1" :text="doc.Date.Value" class="date gray vCenter"/>
            </GridLayout>
    </StackLayout>
      </ScrollView>
</template>

<script>
  export default {
      name: "customer-documents",
      props: [
          'id'
      ],
      data() {
          return {
              documents: null
          }
      },
      created() {
          this.$store.dispatch('getDocuments', { id: this.id })
          .then(res => {
              this.documents = this.$store.getters.getCustomerDocuments
          })
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
        font-size: 14;
    }
    .title {
        font-size: 16;
        font-weight: bold;
    }
    .far {
        text-align: center;
    }
</style>
