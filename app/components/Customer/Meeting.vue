<template>
  <GridLayout rows="auto, *" >
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
          <StackLayout>
          <GridLayout v-if="notes.length == 0 && recordings.length == 0" columns="*, 8*, *">
              <Label text="Inga anteckningar eller inspelningar" col="1" textWrap="true" margin="5" color="#ccc"/>
          </GridLayout>
           <GridLayout columns="*, 4*" rows="*, *, *, *"  v-for="note in notes" class="row" :key="note" @tap="readNote(note)">
              <Label col="0" row="0" rowSpan="4" class="fas" :text="'fa-sticky-note' | fonticon" color="#ffdb24"/>
              <Label col="1" row="1" rowSpan="2" :text="note.split('-')[1].split('.')[0]"  textAlignment="left" class="title"/>
          </GridLayout>
          <GridLayout columns="*, 4*" rows="*,*,*,*" v-for="recording in recordings" class="row" :key="recording" @tap="playRecording(recording)">
              <Label col="0" row="0" rowSpan="4" class="fas" :text="'fa-headphones' | fonticon" />
              <Label col="1" row="1" rowSpan="2" :text="recording.split('-')[2]" textAlignment="left" class="title"/>
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
  import WrapperNoteRecord from './WrapperNoteRecord.vue'
  export default {
      name: "meeting",

      data() {
          return {
              image: null,
              notes: this.$store.getters.getNotes ? this.$store.getters.getNotes : null,
              recordings: this.$store.getters.getRecordedFiles ? this.$store.getters.getRecordedFiles : null,
          }
      },
      created() {
          this.$store.dispatch('getFiles', { id: this.id , folder: 'recordings' })
          this.$store.dispatch('getFiles', { id: this.id, folder: 'notes' })
      },
      props: [
         'id'
      ],
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
              this.$store.commit('setTempId', this.id)
              this.$navigateTo(WrapperNoteRecord, {
                  props: {
                      comp: 'recorder'
                  }
              })
          },
          playRecording(filename) {
              this.$store.commit('setTempId', this.id)
              this.$store.commit('setPlayFile', filename)
              this.$navigateTo(WrapperNoteRecord, {
                  props: {
                      comp: 'player'
                  }
              })
          },
          addNote() {
              this.$store.commit('setTempId', this.id)
              this.$navigateTo(WrapperNoteRecord, {
                  props: {
                      comp: 'note'
                  }
              })
          },
          getFiles() {
              return
          },
          readNote(filename) {
              this.$store.commit('setTempId', this.id)
              this.$store.commit('setReadFile', filename)
              this.$navigateTo(WrapperNoteRecord, {
                  props: {
                      comp: 'note'
                  }
              })
          }
    }
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
    justify-content: space-around;
    font-size: 40;
    color: #fff;
}

.icon {
    width: 100;
    height: 100;
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
