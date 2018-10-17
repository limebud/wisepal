<template>
    <StackLayout>
        <ScrollView>
            <StackLayout >
                <GridLayout v-if="idNumber" columns="*, auto" rows="auto, auto" class="info top">
                    <Label text="Personnummer" col="0" row="0" class="label"/>
                    <Label :text="idNumber" col="0" row="1" class="value"/>
                </GridLayout>
                <GridLayout v-if="phoneNr" columns="*, auto" rows="auto, auto" class="info">
                    <Label text="Telefon" col="0" row="0" class="label"/>
                    <Label :text="phoneNr" col="0" row="1" class="value"/>
                    <Label class="fa" :text="'fa-phone' | fonticon" col="1" row="0" rowSpan="2" @tap="doCall(customerInfo.PhoneNumber.Value)" />
                </GridLayout>
                <GridLayout v-if="phoneNrWork" columns="*, auto" rows="auto, auto" class="info ">
                    <Label text="Telefon, arbete" col="0" row="0" class="label"/>
                    <Label :text="phoneNrWork" col="0" row="1" class="value"/>
                    <Label class="fa" :text="'fa-phone' | fonticon" col="1" row="0" rowSpan="2" @tap="doCall(customerInfo.PhoneNumberWork.Value)" />
                </GridLayout>
                <GridLayout v-if="streetAddress" columns="*, auto" rows="auto, auto, auto, auto" class="info ">
                    <Label text="Adress" row="0" col="0" />
                    <Label :text="streetAddress" row="1" col="0" />
                    <Label :text="postort" row="2" col="0" />
                    <Label :text="postnummer" row="3" col="0" />
                    <Label class="fas" :text="'fa-map-marker-alt' | fonticon" col="1" row="0" rowSpan="4" @tap="showMap"/>
                </GridLayout>
                <GridLayout v-if="email" columns="*, auto" rows="auto, auto" class="info last">
                    <Label :text="customerInfo.EmailAddress.Label" col="0" row="0" class="label"/>
                    <Label :text="email" col="0" row="1" class="value" />
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
.img  {
    margin: 30;
}

.fa,
.fas {
    padding: 10%;
    font-size: 40;
    color: #007AFF;
    vertical-align: center;
}

.info {
    font-size: 16;
    width: 90%;
    border-bottom-width: 1;
    border-color: #ddd;

}

.top {
    margin-top: 20;
}

.last {
    border-bottom-width: 0;
    border-color: transparent;
}

.id {
    font-size: 15;
}

.label {
    font-size: 15;
    margin: 0;
    padding: 0;
}

.value {
    font-size: 25;
    font-weight: bold;
    margin: 0;
    padding: 0;
}
</style>
