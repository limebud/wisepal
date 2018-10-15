<template>
  <StackLayout >
      <FlexboxLayout row="0" class="icons">
          <StackLayout class="icon">
              <Label class="fa" :text="'fa-camera' | fonticon" @tap="useCamera" />
          </StackLayout>
          <StackLayout class="icon">
              <Label class="fas" :text="'fa-pen' | fonticon" />
          </StackLayout>
          <StackLayout class="icon">
              <Label class="fa" :text="'fa-microphone' | fonticon" @tap="useRecorder"/>
          </StackLayout>
      </FlexboxLayout>

      <StackLayout class="header">
          <Label text="Sparade filer" color="gray" fontSize="20"/>
          <Label class="hr-light" />
      </StackLayout>

      <StackLayout row="2">
          <ListView for="recording in recordings" separatorColor="transparent">
            <v-template>
                <GridLayout columns="*, 8*, *">
                    <Label col="1" :text="recording.split('-')[3]" @tap="playRecording(recording)" textAlignment="left" class="listItem"/>
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
    margin: 20 0;
    justify-content: space-around;
    font-size: 40;
    color: #fff;
}

.icon {
    width: 110;
    height: 110;
    vertical-align: center;
    text-align: center;
    background: linear-gradient(45deg, #509aaf, #7dd8c7);
    border-radius: 5;
}

.header {
    margin-bottom: 20;
}

.listItem {
    font-size: 20;

}

</style>
