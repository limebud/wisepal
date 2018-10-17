<template>
  <GridLayout rows="*, 2*" >
      <FlexboxLayout row="0" class="icons">
          <StackLayout class="icon">
              <Label class="fa" :text="'fa-camera' | fonticon" @tap="useCamera" />
          </StackLayout>
          <StackLayout class="icon">
              <Label class="fas" :text="'fa-pen' | fonticon" @tap="addNote" />
          </StackLayout>
          <StackLayout class="icon">
              <Label class="fa" :text="'fa-microphone' | fonticon" @tap="useRecorder"/>
          </StackLayout>
      </FlexboxLayout>

      <ScrollView row="1">
          <StackLayout >
              <Label text="Anteckningar" fontSize="20" color="#333" />
              <Label class="hr-light" />
              <GridLayout v-if="notes.length == 0" columns="*, 8*, *">
                  <Label text="Inga anteckningar" col="1" textWrap="true" margin="5" color="#ccc"/>
              </GridLayout>
              <GridLayout v-else columns="*, 8*, *" v-for="note in notes">
                  <Label col="1" :text="note.split('-')[1].split('.')[0]" @tap="readNote(note)" textAlignment="left" class="listItem"/>
              </GridLayout>
              <Label text="Inspelningar" fontSize="20" color="#333" />
              <Label class="hr-light" />
              <GridLayout v-if="recordings.length == 0" columns="*, 8*, *">
                  <Label text="Inga inspelningar" col="1" textWrap="true" margin="5" color="#ccc"/>
              </GridLayout>
              <GridLayout v-else columns="*, 8*, *" v-for="recording in recordings">
                  <Label col="1" :text="recording.split('-')[2]" @tap="playRecording(recording)" textAlignment="left" class="listItem"/>
              </GridLayout>
          </StackLayout>

  </ScrollView>
  </GridLayout>
</template>


<script>
  import * as fs from 'tns-core-modules/file-system'
  import * as camera from "nativescript-camera"
  import { AudioPlayerOptions, AudioRecorderOptions, TNSPlayer, TNSRecorder } from 'nativescript-audio'
  import { Image } from "ui/image"
  import Recorder from './Recorder.vue'
  import Player from './Player.vue'
  import Note from './Note.vue'

  export default {
      name: "meeting",
      data() {
          return {
              image: null,
              recordings: this.$store.getters.getRecordedFiles,
              notes: this.$store.getters.getNotes,
              id: this.$store.getters.getCustomerInformation.Id.Value
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
          addNote() {
              this.$navigateTo(Note)
          },
          getFiles() {
              return
          },
          readNote(filename) {
              this.$store.commit('setReadFile', filename)
              this.$navigateTo(Note)
          }
    },
    created() {
        this.$store.dispatch('getFiles', { id: this.id , folder: 'recordings' })
        this.$store.dispatch('getFiles', { id: this.id, folder: 'notes' })
    },
    mounted() {
        console.log(this.recordings.length)
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
    width: 30%;
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
