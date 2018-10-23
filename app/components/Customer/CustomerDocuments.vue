<template>
      <ScrollView>
          <StackLayout>
              <GridLayout columns="*, 4*" rows="*, *, *, *" class="row" v-for="(doc, index) in documents" :key="index">
                  <Label row="0" col="0" rowSpan="4" class="far" :text="'fa-file-alt' | fonticon" color="#509aaf"/>
                  <Label row="1" col="1" :text="doc.Title.Value" class="title"/>
                  <Label row="2" col="1" :text="doc.Date.Value" class="date"/>
            </GridLayout>
    </StackLayout>
      </ScrollView>
</template>

<script>
  import axios from 'axios'
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
          axios.get('/Document/GetDocumentsByPartyId/', {
              params: {
                  Id: this.id
              },
              headers: {
                  'Authorization': this.$store.getters.getToken,
                  'Culture': 'sv-se'
              }
          })
          .then(res => {
              console.log(res.data.Result)
              this.documents = res.data.Result
          })

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
