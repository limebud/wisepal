<template>
  <StackLayout>
      <ScrollView>
          <StackLayout>
        <GridLayout v-if="customerInfo.SocialSecurityNumber.Value" columns="*, auto" rows="auto, auto" class="info top">
            <Label :text="customerInfo.SocialSecurityNumber.Label" col="0" row="0" class="label"/>
            <Label :text="customerInfo.SocialSecurityNumber.Value" col="0" row="1" class="value"/>
        </GridLayout>

        <GridLayout v-if="customerInfo.PhoneNumber.Value" columns="*, auto" rows="auto, auto" class="info">
            <Label :text="customerInfo.PhoneNumber.Label" col="0" row="0" class="label"/>
            <Label :text="customerInfo.PhoneNumber.Value" col="0" row="1" class="value"/>
            <Label class="fa" :text="'fa-phone' | fonticon" col="1" row="0" rowSpan="2" @tap="doCall(customerInfo.PhoneNumber.Value)" />
        </GridLayout>

        <GridLayout v-if="customerInfo.PhoneNumberWork.Value" columns="*, auto" rows="auto, auto" class="info ">
            <Label :text="customerInfo.PhoneNumberWork.Label" col="0" row="0" class="label"/>
            <Label :text="customerInfo.PhoneNumberWork.Value" col="0" row="1" class="value"/>
            <Label class="fa" :text="'fa-phone' | fonticon" col="1" row="0" rowSpan="2" @tap="doCall(customerInfo.PhoneNumberWork.Value)" />
        </GridLayout>

        <GridLayout v-if="customerInfo.EmailAddress.Value" columns="*, auto" rows="auto, auto, auto" class="info ">
            <Label :text="customerInfo.StreetAddress.Value" row="0" col="0" />
            <Label :text="customerInfo.Postort.Value" row="1" col="0" />
            <Label :text="customerInfo.Postnummer.Value" row="2" col="0" />
            <Label class="fas" :text="'fa-map-marker-alt' | fonticon" col="1" row="0" rowSpan="3" />
        </GridLayout>

        <GridLayout v-if="customerInfo.EmailAddress.Value" columns="*, auto" rows="auto, auto" class="info last">
            <Label :text="customerInfo.EmailAddress.Label" col="0" row="0" class="label"/>
            <Label :text="customerInfo.EmailAddress.Value" col="0" row="1" class="value" />
        </GridLayout>
    </StackLayout>
</ScrollView>

    </StackLayout>
</template>


<script>
  import phone from 'nativescript-phone'

  export default {
      name: "customer-info",
      created() {
          this.customerInfo = this.$store.getters.getCustomerInformation
      },
      methods: {
          doCall(nr) {
              phone.dial(nr, true)
          }
      }
  }
</script>

<style scoped lang="scss">
.img  {
    margin: 30px;
}

.fa,
.fas {
    padding: 10%;
    font-size: 40vh;
    color: #007AFF;
    vertical-align: center;
}

.info {
    font-size: 20vw;
    width: 90%;
    padding: 10%;
    border-bottom-width: 2px;
    border-color: #9068b9;

}

.top {
    margin-top: 20vh;
}

.last {
    border-bottom-width: 0;
    border-color: transparent;
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
