<template>
  <GridLayout rows="*, 60">

      <Label row="0" :text="clock" fontSize="30"/>

      <Label row="1" v-if="!this.$store.getters.getRecordingStatus" class="fas" :text="'fa-circle' | fonticon" color="#bc1b27" fontSize="34" @tap="startRecording"/>

      <Label row="1"  v-else-if="this.$store.getters.getRecordingStatus === 'recording'" class="fas" :text="'fa-stop' | fonticon" color="#bc1b27" fontSize="34" @tap="stopRecording" />

      <FlexboxLayout row="1" v-else-if="this.$store.getters.getRecordingStatus === 'recorded'" justifyContent="space-around" color="#aaa">
          <Label class="fas" :text="'fa-check' | fonticon" @tap="saveRecording" color="#29b33c" fontSize="34"/>
          <Label class="fas" :text="'fa-times' | fonticon" @tap="deleteRecording" fontSize="34" color="#bbb"/>
      </FlexboxLayout>

  </GridLayout>
</template>


<script>
  import * as fs from 'tns-core-modules/file-system'
  import { AudioPlayerOptions, AudioRecorderOptions, TNSPlayer, TNSRecorder } from 'nativescript-audio'
  import { Image } from "ui/image"
  import * as Toast from 'nativescript-toast'
  import * as application from "tns-core-modules/application"
  import * as dialogs from 'tns-core-modules/ui/dialogs'

  export default {
      data() {
          return {
              seconds: 0,
              minutes: 0,
              hours: 0,
              clock: '00:00:00',
              id: this.$store.getters.getTempId,
              timer: null,
              audioMeter: 0,
              meterInterval: null,
              folder: '',
              filename: '',
              recorder: new TNSRecorder(),
              saveFileName: '',
              recorderOptions: '',
          }
      },
      created() {
          this.folder = fs.knownFolders.currentApp().getFolder('recordings/' + this.id)

          this.filename = this.folder.path + '/recording'
          this.recorderOptions = {
              filename: this.filename,
              metering: true,

              infoCallback: infoObject => {
                console.log(JSON.stringify(infoObject));
              },

              errorCallback: errorObject => {
                console.log(JSON.stringify(errorObject));
              }
          }
      },
      methods: {
          addTime() {
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
                  this.addTime()
              }, 1000)
          },
          startRecording() {
              this.recorder.requestRecordPermission()
              .then(() => {
                  if (this.recorder.hasRecordPermission()) {
                      this.startTimer()

                      application.android.on(application.AndroidApplication.activityBackPressedEvent, (args) => {
                          args.cancel = true;
                          alert("Det går för tillfället inte att backa ur en pågående inspelning.")
                      });

                      this.$store.commit('setRecordingStatus', 'recording')

                      if (TNSRecorder.CAN_RECORD()) {
                          this.isRecording = true
                          this.recorder.start(this.recorderOptions)
                          this.meterInterval = setInterval(() => {
                              this.audioMeter = this.recorder.getMeters();
                              console.log(this.audioMeter);
                          }, 300);
                      } else {
                          alert("Enheten kan inte spela in ljud")
                      }
                  }
              })
          },
          stopRecording() {
              if (this.isRecording) {
                  this.$store.commit('setRecordingStatus', 'recorded')

                  this.recorder.stop()

                  clearInterval(this.timer)


                  clearInterval(this.meterInterval)
                  this.meterInterval = null
                  this.audioMeter = 0
              }
          },
          deleteRecording() {
                confirm({
                  message: "Tar bort inspelning",
                  okButtonText: "OK",
                  cancelButtonText: "Ångra"
                }).then(res => {
                    if (res) {
                        let file = this.folder.getFile("recording")
                        Toast.makeText("Inspelningen borttagen", "long").show()
                        file.remove()
                        this.reset()
                    }
                });
          },

          saveRecording() {
              prompt({
                  message: "Spara som...",
                  okButtonText: "OK",
                  cancelButtonText: "Ångra",
                  defaultText: '',
                  inputType: dialogs.inputType.text
                }).then(res => {
                  if (res.result) {
                      this.saveFileName = this.id + '-recording-' + res.text

                      let saveFile = this.folder.getFile("recording")

                      if (this.$store.getters.getRecordedFiles.includes(this.saveFileName)) {
                          alert("Det finns redan en inspelning med det namnet")
                      } else {
                          saveFile.rename(this.saveFileName)
                          this.$store.commit('appendRecordedFiles', saveFile.name)
                          Toast.makeText("Inspelningen sparad", "long").show()
                          this.reset()
                          this.$navigateBack()
                      }
                    }
                })
                .catch((err) => {
                    console.log("Error: " + err)
                })
          },
          reset() {
              application.android.off(application.AndroidApplication.activityBackPressedEvent)
              this.$store.commit('setRecordingStatus', null)
              this.counter = 0
              this.timer = null
              this.clock = '00:00:00'
              this.seconds = 0
              this.minutes = 0
              this.hours = 0
          }
      },
      destroyed() {
          this.recorder.dispose()
      }
  }
</script>

<style scoped lang="scss">
Page {
    text-align: center;
}


Label {
    vertical-align: center;
    text-align: center;
}

FlexboxLayout {
    vertical-align: center;
    text-align: center;
}


</style>
