<!-- <StackLayout row="1"  class="header">
  <Image src="~/images/userphoto@2x.png" class="img" />
</StackLayout> -->

<template>
  <StackLayout>

        <Label :text="customerInfo.Name.Value" class="name" />

        <Label :text="customerInfo.SocialSecurityNumber.Value" />
        <Label :text="customerInfo.PhoneNumber.Value" />
        <Label :text="customerInfo.PhoneNumberWork.Value" />
        <Label :text="customerInfo.EmailAddress.Value" />
        <Label :text="customerInfo.StreetAddress.Value" />
        <Label :text="customerInfo.Postort.Value" />
        <Label :text="customerInfo.Postnummer.Value" />

  </StackLayout>
</template>


<script>
  export default {
      name: "customer-info",
      data() {
          return {
              customerInfo: []
          }
      },
      created() {
          this.customerInfo = this.$store.getters.getCustomerInformation
      }
  }
</script>

<style scoped lang="scss">
.img  {
    margin: 30px;
}

.name {
    text-align: center;
    margin-bottom: 10%;
    padding: 10%;
    font-size: 30vw;
    font-weight: bold;
}

.id {
    font-size: 15vw;
}
</style>
