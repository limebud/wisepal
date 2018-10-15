<template>
  <GridLayout rows="*, 3*">
      <FlexboxLayout row="0" justifyContent="space-around" class="icons">
          <Label class="fa" :text="'fa-camera' | fonticon" @tap="useCamera" />
          <Label class="fas" :text="'fa-pen' | fonticon" />
          <Label class="fa" :text="'fa-microphone' | fonticon" @tap="useRecorder"/>
      </FlexboxLayout>

      <StackLayout row="2">
          <ListView for="recording in recordings" class="list-group">
            <v-template>
              <Label :text="recording.split('-')[3]" @tap="playRecording(recording)" class="list-group-item" />
            </v-template>
          </ListView>
      </StackLayout>

  </GridLayout>
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
                    console.log("Source: " + image)
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
    font-size: 40;
    padding: 10;
    vertical-align: center;
}

ListView {
    text-align: left;
}

</style>
