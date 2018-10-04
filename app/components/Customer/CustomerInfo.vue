<template>
  <StackLayout>
      <ScrollView>
          <StackLayout>
        <GridLayout v-if="customerInfo.SocialSecurityNumber.Value" columns="*, auto" rows="auto, auto" class="info phonenr">
            <Label :text="customerInfo.SocialSecurityNumber.Label" col="0" row="0" class="label"/>
            <Label :text="customerInfo.SocialSecurityNumber.Value" col="0" row="1" class="value"/>
        </GridLayout>

        <GridLayout v-if="customerInfo.PhoneNumber.Value" columns="*, auto" rows="auto, auto" class="info phonenr">
            <Label :text="customerInfo.PhoneNumber.Label" col="0" row="0" class="label"/>
            <Label :text="customerInfo.PhoneNumber.Value" col="0" row="1" class="value"/>
            <Label class="fa" :text="'fa-phone' | fonticon" col="1" row="0" rowSpan="2" @tap="doCall" />
        </GridLayout>

        <GridLayout v-if="customerInfo.PhoneNumberWork.Value" columns="*, auto" rows="auto, auto" class="info ">
            <Label :text="customerInfo.PhoneNumberWork.Label" col="0" row="0" class="label"/>
            <Label :text="customerInfo.PhoneNumberWork.Value" col="0" row="1" class="value"/>
            <Label class="fa" :text="'fa-phone' | fonticon" col="1" row="0" rowSpan="2" @tap="doCall" />
        </GridLayout>

        <GridLayout v-if="customerInfo.EmailAddress.Value" columns="*, auto" rows="auto, auto, auto" class="info ">
            <Label :text="customerInfo.StreetAddress.Value" row="0" col="0" />
            <Label :text="customerInfo.Postort.Value" row="1" col="0" />
            <Label :text="customerInfo.Postnummer.Value" row="2" col="0" />
            <Label class="fa" :text="'fa-map-marker-alt' | fonticon" col="1" row="0" rowSpan="3" />
        </GridLayout>

        <GridLayout v-if="customerInfo.EmailAddress.Value" columns="*, auto" rows="auto, auto" class="info ">
            <Label :text="customerInfo.EmailAddress.Label" col="0" row="0" class="label"/>
            <Label :text="customerInfo.EmailAddress.Value" col="0" row="1" class="value" />
        </GridLayout>
    </StackLayout>
</ScrollView>

    </StackLayout>
</template>


<script>
  export default {
      name: "customer-info",
      created() {
          this.customerInfo = this.$store.getters.getCustomerInformation
      },
      methods: {
          doCall() {
              alert("Todo")
          }
      }
  }
</script>

<style scoped>
.img  {
    margin: 30px;
}

.fa {
    padding: 10%;
    font-size: 30vw;
}

.phonenr {
    margin-top: 20vw;
}

.info {
    font-size: 20vw;
    width: 90%;
    padding: 10%;
}

.id {
    font-size: 15vw;
}

.label {
    font-size: 15vw;
    margin: 0;
    padding: 0;
}

.value {
    font-size: 25vw;
    font-weight: bold;
    margin: 0;
    padding: 0;
}
</style>
