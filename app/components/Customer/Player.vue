<template>
<Page>
    <ActionBar>
        <GridLayout width="100%" columns="*, auto, *" rows=*, *>
            <StackLayout col="1" row="0">
                <Label :text="this.$store.getters.getCustomerInformation.Name.Value" class="name" />
                <Label v-if="this.$store.getters.getCustomerInformation.SocialSecurityNumber" :text="this.$store.getters.getCustomerInformation.SocialSecurityNumber.Value" fontSize="12"/>
            </StackLayout>
        </GridLayout>
    </ActionBar>
  <GridLayout rows="*, *">
      <Label row="0" :text="clock + ' / ' + trackDuration"  fontSize="30"/>
      <FlexboxLayout row="1" justifyContent="space-around" verticalAlignment="center" color="#aaa">
          <Label v-if="!playing" class="fas" :text="'fa-play-circle' | fonticon" fontSize="40" @tap="togglePlay" />
          <Label v-else class="fas" :text="'fa-pause-circle' | fonticon" fontSize="40" @tap="togglePlay" />
          <Label  class="fas" :text="'fa-stop' | fonticon" fontSize="40" @tap="stopRecording" />
          <Label class="fas" :text="'fa-trash' | fonticon" fontSize="40" @tap="deleteRecording" />
      </FlexboxLayout>
  </GridLayout>
</Page>
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
              clock: '00:00:00',
              done: false,
              durationInSec: 0,
              playtimeInSec: 0,
              id: this.$store.getters.getCustomerInformation.Id.Value,
              folder: '',
              filepath: '',
              filename: this.$store.getters.getPlayFile,
              trackDuration: null,
              player: new TNSPlayer(),
              playing: false,
          }
      },
      created() {
          this.folder = fs.knownFolders.currentApp().getFolder('recordings/' + this.id)
          this.filepath = this.folder.path + '/' + this.filename

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

              this.trackDuration = h + ":" + m + ":" + s
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

              this.clock = (this.hours ? (this.hours > 9 ? this.hours : "0" + this.hours) : "00") + ":" +
                           (this.minutes ? (this.minutes > 9 ? this.minutes : "0" + this.minutes) : "00") + ":" +
                           (this.seconds > 9 ? this.seconds : "0" + this.seconds);
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
                        let file = this.folder.getFile(this.$store.getters.getPlayFile)
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
              this.clock = '00:00:00'
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
Page {
    font-size: 40;
    text-align: center;
}

Label {
    vertical-align: center;
    text-align: center;
}
</style>
