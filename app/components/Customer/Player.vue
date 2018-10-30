<template>
  <GridLayout rows="*, 60">
      <Label row="0" :text="clock + ' / ' + trackDuration"  fontSize="30"/>
      <FlexboxLayout row="1" justifyContent="space-around" verticalAlignment="center" class="buttons">
          <Label v-if="!playing" class="fas" :text="'fa-play' | fonticon" fontSize="34" @tap="togglePlay" color="#25a7de"/>
          <Label v-else class="fas" :text="'fa-pause' | fonticon" fontSize="34" @tap="togglePlay" color="#25a7de"/>
          <Label class="fas" :text="'fa-stop' | fonticon" fontSize="34" @tap="stopRecording" color="#bc1b27" />
          <Label class="fas" :text="'fa-times' | fonticon" fontSize="34" @tap="deleteRecording" color="#bbb" />
      </FlexboxLayout>
  </GridLayout>
</template>


<script>
  import * as fs from 'tns-core-modules/file-system'
  import { AudioPlayerOptions, AudioRecorderOptions, TNSPlayer, TNSRecorder } from 'nativescript-audio'
  import * as Toast from 'nativescript-toast';
  import * as application from "tns-core-modules/application";
  import * as dialogs from 'tns-core-modules/ui/dialogs'

  export default {
      data() {
          return {
              seconds: 0,
              minutes: 0,
              hours: 0,
              clock: '00:00',
              done: false,
              durationInSec: 0,
              playtimeInSec: 0,
              id: this.$store.getters.getTempId,
              folder: fs.knownFolders.currentApp().getFolder('recordings/' + this.$store.getters.getTempId),
              filepath: fs.knownFolders.currentApp().getFolder('recordings/' + this.$store.getters.getTempId).path + '/' + this.$store.getters.getPlayFile,
              filename: this.$store.getters.getPlayFile,
              trackDuration: null,
              player: new TNSPlayer(),
              playing: false,
          }
      },
      created() {
          // console.log(this.id)
          // this.filepath = this.folder.path + '/' + this.filename
          console.log(this.filepath)
          this.player.initFromFile({
              audioFile: this.filepath,
              loop: false,
              completeCallback: function() {
                  console.log('finished playing')
              }
          })

          this.player.getAudioTrackDuration()
          .then(res => {
              this.calcDurationTime(res)
          })
      },
      methods: {
          calcDurationTime(res) {
              this.durationInSec = Math.round(res / 1000)
              let d = Math.round(res / 1000)
              var h = Math.floor(d / 3600);
              var m = Math.floor(d % 3600 / 60);
              var s = Math.floor(d % 3600 % 60);

              if (s < 10) {
                  s = "0" + s
              }
              if (m < 10) {
                  m = "0" + m
              }
              if (h < 10) {
                  h = "0" + h
              }

              this.trackDuration = h > 0 ? (h + ":" + m + ":" + s) : (m + ":" + s)
          },
          addTime() {
              this.playtimeInSec++
              this.seconds++
              if (this.seconds >= 60) {
                  this.seconds = 0;
                  this.minutes++;
                  if (this.minutes >= 60) {
                      this.minutes = 0;
                      this.hours++;
                  }
              }

              if (this.hours > 0) {
                  this.clock = (this.hours ? (this.hours > 9 ? this.hours : "0" + this.hours) : "00") + ":" +
                  (this.minutes ? (this.minutes > 9 ? this.minutes : "0" + this.minutes) : "00") + ":" +
                  (this.seconds > 9 ? this.seconds : "0" + this.seconds);
              } else {
                  this.clock = (this.minutes ? (this.minutes > 9 ? this.minutes : "0" + this.minutes) : "00") + ":" +
                  (this.seconds > 9 ? this.seconds : "0" + this.seconds);
              }
          },
          startTimer() {
              this.timer = setInterval(() => {
                  if (this.playtimeInSec < this.durationInSec) {
                      this.addTime()
                  } else {
                      clearInterval(this.timer)
                      this.reset()
                  }
            }, 1000)
          },
          togglePlay() {
              if (this.player.isAudioPlaying()) {
                this.playing = false
                clearInterval(this.timer)
                this.player.pause()
              } else {
                this.playing = true
                this.startTimer()
                this.player.play()
              }
          },
          stopRecording() {
              clearInterval(this.timer)
              this.player.pause()
              this.player.seekTo(0)
              this.reset()
          },
          deleteRecording() {
                confirm({
                  message: "Tar bort inspelningen",
                  okButtonText: "OK",
                  cancelButtonText: "Ångra"
                }).then(res => {
                    if (res) {
                        let file = this.folder.getFile(this.filename)
                        file.remove()
                        this.$store.commit('removeRecordingFromArray', this.filename)
                        this.$navigateBack()
                    }
                })
          },
          reset() {
              this.playing = false
              this.playtimeInSec = 0
              this.timer = null
              this.clock = '00:00'
              this.seconds = 0
              this.minutes = 0
              this.hours = 0
          }
      },
      destroyed() {
          this.player.dispose()
      }
  }
</script>

<style scoped lang="scss">


Label {
    vertical-align: center;
    text-align: center;
}

</style>
