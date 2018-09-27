<template>
  <GridLayout rows="*, 4*, *, 3*">
      <StackLayout row="1"  class="header">
        <Image src="~/images/userphoto@2x.png" class="img" />
      </StackLayout>
      <StackLayout row="3">
        <Label :text="customerInfo.Name.Value" class="name" />
        <Label :text="customerInfo.SocialSecurityNumber.Value" />
      </StackLayout>
</GridLayout>
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
GridLayout {
    text-align: center;
}

.img  {
    margin: 30px;
}

.name {
    font-size: 20vw;
    font-weight: bold;
}

.id {
    font-size: 15vw;
}
</style>
