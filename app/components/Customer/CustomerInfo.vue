<template>
    <StackLayout>
        <ScrollView>
            <StackLayout>
                <GridLayout v-if="phoneNr" columns="*, 4*" rows="*, *, *" class="row">
                    <Label class="fa" :text="'fa-phone' | fonticon" col="0" row="0" rowSpan="3" @tap="doCall(customerInfo.PhoneNumber.Value)" />
                    <Label :text="phoneNr" col="1" row="1" class="value"/>
                </GridLayout>
                <GridLayout v-if="phoneNrWork" columns="*, 4*" rows="*, *, *" class="row">
                    <Label class="fa" :text="'fa-phone' | fonticon" col="0" row="0" rowSpan="3" @tap="doCall(customerInfo.PhoneNumberWork.Value)" />
                    <Label :text="phoneNrWork" col="1" row="1" class="value"/>
                </GridLayout>
                <GridLayout v-if="streetAddress" columns="*, 4*" rows="*, *, *" class="row">
                    <Label class="fas" :text="'fa-map-marker-alt' | fonticon" col="0" row="0" rowSpan="3" @tap="showMap"/>
                    <StackLayout row="1" col="1" class="value">
                        <Label :text="streetAddress" />
                        <Label :text="postnummer + ' ' + postort" row="2" col="1" />
                    </StackLayout>
                </GridLayout>
                <GridLayout v-if="email" columns="*, 4*" rows="*, *, *" class="row">
                    <Label class="fas" :text="'fa-map-marker-alt' | fonticon" col="0" row="0" rowSpan="3"/>
                    <Label :text="email" col="1" row="1" class="value"/>
                </GridLayout>
            </StackLayout>
        </ScrollView>
    </StackLayout>
</template>


<script>
  import phone from 'nativescript-phone'
  import * as utilsModule from 'tns-core-modules/utils/utils'

  export default {
      data() {
          return {
              idNumber: this.customerInfo.SocialSecurityNumber ? this.customerInfo.SocialSecurityNumber.Value : null,
              phoneNr: this.customerInfo.PhoneNumber ? this.customerInfo.PhoneNumber.Value : null,
              phoneNrWork: this.customerInfo.PhoneNumberWork ? this.customerInfo.PhoneNumberWork.Value : null,
              streetAddress: this.customerInfo.StreetAddress ? this.customerInfo.StreetAddress.Value : null,
              postort: this.customerInfo.Postort ? this.customerInfo.Postort.Value : null,
              postnummer: this.customerInfo.Postnummer ? this.customerInfo.Postnummer.Value : null,
              email: this.customerInfo.EmailAddress ? this.customerInfo.EmailAddress.Value : null
          }
      },
      name: "customer-info",
      props: [
          'customerInfo'
      ],
      methods: {
          doCall(nr) {
              phone.dial(nr, true)
          },
          showMap() {
              utilsModule.openUrl("https://www.google.com/maps/dir/?api=1&destination=" + this.streetAddress + "+" + this.postort)
          }
      }
  }
</script>

<style scoped lang="scss">
.fa,
.fas {
    font-size: 34;
    color: #333;
    vertical-align: center;
    text-align: center;
}

.row {
    height: 80;
    border-bottom-width: 1;
    border-color: #ddd;
}

.value {
    font-size: 16;
    vertical-align: center;
}
</style>
