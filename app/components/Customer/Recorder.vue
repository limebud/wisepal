<template>
<Page>
  <GridLayout rows="*, *">

      <Label row="0" :text="clock" />

      <Label row="1" v-if="!status" class="fas" :text="'fa-circle' | fonticon" color="#fefafb" fontSize="200vw"/>
      <Label row="1" v-if="!status" class="fas" :text="'fa-circle' | fonticon" color="#f6d9dE" fontSize="125vw"/>
      <Label row="1" v-if="!status" class="fas" :text="'fa-circle' | fonticon" color="#ee3962" fontSize="50vw" @tap="startRecording"/>

      <Label row="1"  v-else-if="status === 'recording'" class="fas" :text="'fa-stop' | fonticon" color="red" fontSize="50vw" @tap="stopRecording" />

      <FlexboxLayout row="1" v-else-if="status === 'recorded'" justifyContent="space-around">
          <Label class="fas" :text="'fa-save' | fonticon" color="green" fontSize="28vw" @tap="saveRecording" />
          <Label class="fas" :text="'fa-play-circle' | fonticon" color="green" fontSize="28vw" @tap="playRecording" />
          <Label class="fas" :text="'fa-trash' | fonticon" color="gray" fontSize="28vw" @tap="deleteRecording" />
      </FlexboxLayout>


  </GridLayout>
</Page>
</template>


<script>
  import * as fs from 'tns-core-modules/file-system'
  import { AudioPlayerOptions, AudioRecorderOptions, TNSPlayer, TNSRecorder } from 'nativescript-audio'
  import { Image } from "ui/image"
  import * as Toast from 'nativescript-toast';
  import * as application from "tns-core-modules/application";
  const dialogs = require('tns-core-modules/ui/dialogs')

  export default {
      data() {
          return {
              status: null,
              timer: null,
              audioMeter: 0,
              meterInterval: null,
              filename: fs.knownFolders.currentApp().getFolder('recordings').path + '/recording',
              recorder: new TNSRecorder(),
              seconds: 0,
              minutes: 0,
              hours: 0,
              clock: '00:00:00',
              saveFileName: ''
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

              this.startTimer()

              application.android.on(application.AndroidApplication.activityBackPressedEvent, (args) => {
                  args.cancel = true;
                  alert("Det går för tillfället inte att backa ur en pågående inspelning.")
              });

              this.status = 'recording'

              let recorderOptions = {
                  filename: this.filename,
                  metering: true,

                  infoCallback: infoObject => {
                    console.log(JSON.stringify(infoObject));
                  },

                  errorCallback: errorObject => {
                    console.log(JSON.stringify(errorObject));
                  }
              }

              if (TNSRecorder.CAN_RECORD()) {
                  this.isRecording = true
                  this.recorder.start(recorderOptions)
                  this.meterInterval = setInterval(() => {
                      this.audioMeter = this.recorder.getMeters();
                      console.log(this.audioMeter);
                  }, 300);
              } else {
                  alert("Enheten kan inte spela in ljud")
              }
          },
          stopRecording() {
              if (this.isRecording) {
                  this.status = 'recorded'

                  this.recorder.stop()

                  clearInterval(this.timer)


                  clearInterval(this.meterInterval)
                  this.meterInterval = null
                  this.audioMeter = 0
              }
          },
          playRecording() {
              var player = new TNSPlayer()

              var playerOptions = {
                  audioFile: this.filename,
                  loop: false,
                  completeCallback: function() {
                      console.log('finished playing')
                  },
                  errorCallback: function() {
                      console.log(JSON.stringify(errorObject))
                  },
                  infoCallback: function() {
                      console.log(JSON.stringify(args))
                  }
              }

              player.playFromUrl(playerOptions)
              .then((res) => {
                  console.log(res)
              })
              .catch((err) => {
                  console.log('Error -> ' + err)
              })
          },
          deleteRecording() {
                confirm({
                  title: "Ta bort",
                  message: "Är du säker på att du vill ta bort inspelningen?",
                  okButtonText: "Ja",
                  cancelButtonText: "Nej"
                }).then(res => {
                    if (res) {
                        let folder = fs.knownFolders.currentApp().getFolder('recordings')
                        let file = folder.getFile("recording")
                        file.remove()
                        this.reset()
                    }
                });
          },
          saveRecording() {
              let id = this.$store.getters.getCustomerInformation.Id.Value
              let random = Math.floor(Math.random() * 999999999) + 1;

              prompt({
                  message: "Spara som...",
                  okButtonText: "OK",
                  cancelButtonText: "Ångra",
                  defaultText: '',
                  inputType: dialogs.inputType.text
                }).then(res => {
                  if (res.result) {
                      this.saveFileName = id + '-recording-' + random + '-' + res.text

                      let folder = fs.knownFolders.currentApp().getFolder('recordings')
                      let saveFile = folder.getFile("recording")

                      saveFile.rename(this.saveFileName)
                      .then((res) => {
                          this.$store.commit('appendRecordedFiles', saveFile.name)
                          Toast.makeText("Inspelningen sparad", "long").show()
                          this.reset()
                      })
                      .catch((err) => {
                          console.log(err)
                      })
                  }

                });
          },
          reset() {
              application.android.off(application.AndroidApplication.activityBackPressedEvent)
              this.status = null
              this.counter = 0
              this.timer = null
              this.clock = '00:00:00'
              this.seconds = 0
              this.minutes = 0
              this.hours = 0
          }

      }
  }
</script>

<style scoped lang="scss">
Page {
    font-size: 40vw;
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

.time {
    background: #41a7b3;
}

</style>
