<template>
    <StackLayout>
        <ScrollView>
            <StackLayout>
                <GridLayout v-if="phoneNr" columns="*, 4*" rows="*, *, *, *" class="row iconSize">
                    <Label class="fa green" row="0" rowSpan="4" :text="'fa-phone' | fonticon" @tap="doCall(customerInfo.PhoneNumber.Value)" />
                    <Label text="Telefon" col="1" row="1" class="type" />
                    <Label :text="phoneNr" col="1" row="2" class="value"/>
                </GridLayout>
                <GridLayout v-if="phoneNrWork" columns="*, 4*" rows="*, *, *, *" class="row iconSize" >
                    <Label class="fa green" row="0" rowSpan="4" :text="'fa-phone' | fonticon" @tap="doCall(customerInfo.PhoneNumberWork.Value)" />
                    <Label text="Telefon, arbete" col="1" row="1" class="type"/>
                    <Label :text="phoneNrWork" col="1" row="2" class="value"/>
                </GridLayout>
                <GridLayout v-if="streetAddress" columns="*, 4*" rows="*, auto, *" class="row iconSize">
                    <Label class="fas red" col="0" row="0" rowSpan="3" :text="'fa-map-marker-alt' | fonticon" @tap="showMap"/>
                    <StackLayout row="1" col="1">
                        <Label text="Adress" class="type"/>
                        <Label :text="streetAddress" class="value" />
                        <Label :text="postnummer + ' ' + postort" class="value" />
                    </StackLayout>
                </GridLayout>
                <GridLayout v-if="email" columns="*, 4*" rows="*, *, *, *" class="row iconSize" >
                    <Label class="fas blue" col="0" row="0" rowSpan="4" :text="'fa-envelope' | fonticon"/>
                    <Label text="Epost" col="1" row="1" class="type" />
                    <Label :text="email" col="1" row="2" class="value"/>
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
              name: this.customerInfo.Name ? this.customerInfo.Name.Value : null,
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
    vertical-align: center;
    text-align: center;
}

.row {
    border-bottom-width: 1;
    border-color: #ddd;
    color: #333;
    height: 80;
}

.value {
    color: #999;
    font-size: 14;
    vertical-align: center;
}

.type {
    font-size: 16;
    vertical-align: center;
    font-weight: bold;
}
</style>
