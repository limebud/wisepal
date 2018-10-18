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

      <Label row="0" :text="clock" />

      <Label row="1" v-if="!status" class="fas" :text="'fa-circle' | fonticon" color="#fefafb" fontSize="200"/>
      <Label row="1" v-if="!status" class="fas" :text="'fa-circle' | fonticon" color="#f6d9dE" fontSize="125"/>
      <Label row="1" v-if="!status" class="fas" :text="'fa-circle' | fonticon" color="#ee3962" fontSize="50" @tap="startRecording"/>

      <Label row="1"  v-else-if="status === 'recording'" class="fas" :text="'fa-stop' | fonticon" color="red" fontSize="50" @tap="stopRecording" />

      <FlexboxLayout row="1" v-else-if="status === 'recorded'" justifyContent="space-around" color="#aaa">
          <Label class="fas" :text="'fa-save' | fonticon" @tap="saveRecording" />
          <Label class="fas" :text="'fa-play-circle' | fonticon" @tap="playRecording" />
          <Label class="fas" :text="'fa-trash' | fonticon" @tap="deleteRecording" />
      </FlexboxLayout>

  </GridLayout>
</Page>
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
              status: null,
              id: this.$store.getters.getCustomerInformation.Id.Value,
              timer: null,
              audioMeter: 0,
              meterInterval: null,
              folder: '',
              filename: '',
              recorder: new TNSRecorder(),
              seconds: 0,
              minutes: 0,
              hours: 0,
              clock: '00:00:00',
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

                      this.status = 'recording'

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
                  } else {
                      console.log("nein")
                  }
              })
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
                        let file = this.folder.getFile("recording")
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
                      }
                    }
                })
                .catch((err) => {
                    console.log("Error: " + err)
                })
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
      },
      destroyed() {
          this.recorder.dispose()
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

FlexboxLayout {
    vertical-align: center;
    text-align: center;
}


</style>
