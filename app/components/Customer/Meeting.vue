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

      <ScrollView row="1" >
          <StackLayout class="files">
              <GridLayout v-if="notes.length == 0 && recordings.length == 0" columns="*, 8*, *">
                  <Label text="Inga anteckningar eller inspelningar" col="1" textWrap="true" margin="5" color="#ccc"/>
              </GridLayout>
               <GridLayout columns="*, 4*" rows="*, *, *, *"  v-for="note in notes" class="row">
                  <Label col="0" row="0" rowSpan="4" class="fas" :text="'fa-sticky-note' | fonticon" color="#FFDB24"/>
                  <Label col="1" row="1" :text="note.split('-')[1].split('.')[0]" @tap="readNote(note)" textAlignment="left" class="title"/>
                  <Label col="1" row="2" text="2018-10-12" class="date" />
              </GridLayout>
              <GridLayout columns="*, 4*" rows="*,*,*,*" v-for="recording in recordings" class="row">
                  <Label col="0" row="0" rowSpan="4" class="fas" :text="'fa-headphones' | fonticon" />
                  <Label col="1" row="1" :text="recording.split('-')[2]" @tap="playRecording(recording)" textAlignment="left" class="title"/>
                  <Label col="1" row="2" text="2018-10-12" class="date" />
              </GridLayout>
          </StackLayout>
      </ScrollView>
  </GridLayout>
</template>


<script>
  import * as fs from 'tns-core-modules/file-system'
  import * as Toast from 'nativescript-toast';
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
              id: this.$store.getters.getCustomerInformation.Id.Value,
              cameraFolder: '',
          }
      },
      created() {
          this.cameraFolder = fs.knownFolders.currentApp().getFolder('images/' + this.id)
          this.$store.dispatch('getFiles', { id: this.id , folder: 'recordings' })
          this.$store.dispatch('getFiles', { id: this.id, folder: 'notes' })
      },
      methods: {
          useCamera() {
              if (camera.isAvailable()) {

                camera.requestPermissions()
                .then(() => {
                    camera.takePicture()
                    .then((imageAsset) => {
                        Toast.makeText("Fotot sparat i telefonens kameraalbum", "long").show()
                    }).catch((err) => {
                        console.log("Error -> " + err.message);
                    });
                })

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
}
</script>

<style scoped lang="scss">
.far,
.fas {
    font-size: 34;
    vertical-align: center;
    text-align: center;
}

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

.row {
    border-bottom-width: 1;
    border-color: #ddd;
    color: #333;
    height: 80;
}

.title {
    font-size: 16;
    vertical-align: center;
    font-weight: bold;
}

.date {
    color: #999;
    font-size: 14;
    vertical-align: center;
}

</style>
