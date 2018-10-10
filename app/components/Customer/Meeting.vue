<template>
  <StackLayout>
      <FlexboxLayout justifyContent="space-around">
          <Label class="fas" :text="'fa-pen' | fonticon" />
          <Label class="fa" :text="'fa-camera' | fonticon" @tap="useCamera"/>
          <Label class="fa" :text="'fa-microphone' | fonticon" @tap="useRecorder" />
      </FlexboxLayout>
      <StackLayout >
          <Label text="Inspelningar" fontSize="20vw"/>
          <ScrollView orientation="horizontal" scrollBarIndicatorVisible="false">
              <StackLayout orientation="horizontal">
                  <StackLayout v-for="recording in recordings" height="100vw">
                      <Label :text="recording.split('-')[3]" class="file" @tap="playRecording(recording)"/>
                  </StackLayout>
              </StackLayout>
          </ScrollView>

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
.fa,
.fas {
    padding: 20vw;
    font-size: 60vw;
}

.tasks {
    margin-top: 10vh;
}

.recording {
    color: red;
}

.audioRec {
    font-size: 2vw;
}

.file {
    height: 100vw;
    width: 100vw;
    background: #509aaf;
    margin: 0 4vw
}
</style>
