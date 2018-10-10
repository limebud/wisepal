<template>
  <StackLayout>
      <FlexboxLayout justifyContent="space-around" class="icons">
          <Label class="fa" :text="'fa-camera' | fonticon" @tap="useCamera" />
          <Label class="fas" :text="'fa-pen' | fonticon" />
          <Label class="fa" :text="'fa-microphone' | fonticon" @tap="useRecorder"/>
      </FlexboxLayout>
      <StackLayout >
          <Label text="Inspelningar" fontSize="20vw"/>
          <ListView separatorColor="transparent" for="recording in recordings">
            <v-template>
              <GridLayout columns="*, auto, *">
                <GridLayout col="1" columns="auto, *" class="document">
                  <Label class="fa" :text="'fa-file-alt' | fonticon" col="0" fontSize="20vw"/>
                  <Label :text="recording.split('-')[3]" @tap="playRecording(recording)" col="1" class="filename"/>
                </GridLayout>
              </GridLayout>
            </v-template>
          </ListView>
      </StackLayout>

  </StackLayout>
</template>


<script>
  import * as fs from 'tns-core-modules/file-system'
  import * as camera from "nativescript-camera"
  import { AudioPlayerOptions, AudioRecorderOptions, TNSPlayer, TNSRecorder } from 'nativescript-audio'
  import { Image } from "ui/image"
  import Recorder from './Recorder.vue'
  import Player from './Player.vue'



  export default {
      name: "meeting",
      data() {
          return {
              image: null,
              fa: true,
              recordings: this.$store.getters.getRecordedFiles,
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
          },
          useRecorder() {
              this.$navigateTo(Recorder)
          },
          playRecording(filename) {
              this.$store.commit('setPlayFile', filename)
              this.$navigateTo(Player)
          },
          getFiles() {
              return
          }
    },
    created() {
        let folder = fs.knownFolders.currentApp().getFolder('recordings')
        folder.getEntities()
        .then(entities => {
            entities.forEach(entity => {
                if (entity.name.split("-")[0] == this.$store.getters.getCustomerInformation.Id.Value) {
                    this.$store.commit('appendRecordedFiles', entity.name)
                }
            })
        })
    }
}
</script>

<style scoped lang="scss">
.icons {
    padding: 20vw;
    font-size: 60vw;
}

ListView {
    margin-top: 1vw;
}

.document {
    width: 95%;
    font-size: 20vw;
    padding: 20vw;
    border-radius: 3%;
    border-width: 3px;
    border-color: #ddd;
    margin-top: 10vw;
    vertical-align: center;
}

.filename {
    padding-left: 10vw;
}
</style>
