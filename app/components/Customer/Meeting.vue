<template>
  <StackLayout>
      <GridLayout columns="*, auto, *" class="tasks">
          <FlexboxLayout col="1">
              <Label class="fas" :text="'fa-pen' | fonticon" col="1" />
              <Label class="fa" :text="'fa-camera' | fonticon" col="1" @tap="useCamera"/>
              <Label class="fa" :text="'fa-microphone' | fonticon" col="1" />
          </FlexboxLayout>
          <StackLayout>
              <Image v-if="image" :src="image.src" />
          </StackLayout>
      </GridLayout>
  </StackLayout>
</template>


<script>
  import * as camera from "nativescript-camera";
  import { Image } from "ui/image";

  export default {
      name: "meeting",
      data() {
          return {
              image: null
          }
      },
      methods: {
          useCamera() {
            if (camera.isAvailable()) {
                    
                camera.requestPermissions()
                .then(() => {
                    camera.takePicture()
                })
                .then((imageAsset) => {
                    console.log("Result is an image asset instance");
                    var image = new Image();
                    image.src = imageAsset;
                    console.log("IMAGE SOURCE: " + image)
                    this.image = image.src
                }).catch((err) => {
                    console.log("Error -> " + err.message);
                });
            }
          }
      }
    }
</script>

<style scoped lang="scss">
.fa,
.fas {
    padding: 20vw;
    font-size: 60vw;
}

.tasks {
    margin-top: 10vh;
}

</style>
