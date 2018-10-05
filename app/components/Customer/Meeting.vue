<template>
  <StackLayout>
      <GridLayout columns="*, auto, *" rows="15vw, auto, auto" class="tasks">
          <Label col="1" row="0" v-if="isRecording" text="Tryck på mikrofonen igen för att sluta spela in" style="font-size: 12vw; color: red" />
          <FlexboxLayout col="1" row="1">
              <Label class="fas" :text="'fa-pen' | fonticon" />
              <Label class="fa" :text="'fa-camera' | fonticon" @tap="useCamera"/>
              <Label v-bind:class="{ fa: fa, recording: isRecording }" :text="'fa-microphone' | fonticon" @tap="useRecorder" />
          </FlexboxLayout>
          <FlexboxLayout v-if="haveRecorded" row="2" col="1" >
              <Label  class="fas" :text="'fa-play-circle' | fonticon" @tap="spela" color="green" fontSize="28vw"/>
              <Label class="fas" :text="'fa-pause-circle' | fonticon" color="blue" fontSize="28vw"/>
              <Label class="fas" :text="'fa-stop-circle' | fonticon" color="red" fontSize="28vw"/>
              <Label class="fas" :text="'fa-save' | fonticon" color="green" fontSize="28vw"/>
              <Label class="fas" :text="'fa-trash' | fonticon" color="grey" fontSize="28vw"/>
          </FlexboxLayout>
      </GridLayout>

  </StackLayout>
</template>


<script>
  import { File, knownFolders } from 'tns-core-modules/file-system';
  import * as camera from "nativescript-camera"
  import { AudioPlayerOptions, AudioRecorderOptions, TNSPlayer, TNSRecorder } from 'nativescript-audio'
  import { Image } from "ui/image"


  export default {
      name: "meeting",
      data() {
          return {
              image: null,
              isRecording: false,
              haveRecorded: false,
              fa: true,
              folder: knownFolders.currentApp().getFolder('temp_files'),
              audioMeter: 0,
              meterInterval: null,
              recorder: new TNSRecorder()
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
          async useRecorder() {
            if (!this.isRecording) {
                let recordingPath = this.folder.path + '/recording'
                let recorderOptions = {
                    filename: recordingPath,
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
            } else {
                this.isRecording = false
                this.recorder.stop()
                this.haveRecorded = true

                clearInterval(this.meterInterval)
                this.meterInterval = null
                this.audioMeter= 0
            }

        },
        spela() {
            var player = new TNSPlayer()

            var playerOptions = {
                audioFile: this.folder.path + '/recording',
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
        }
    },
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

.invisible {
    color: green;
}

.audioRec {
    font-size: 2vw;
}
</style>
