<template>
<Page>
  <StackLayout>
      <Label class="fas" :text="'fa-play-circle' | fonticon" color="green" fontSize="40" @tap="playRecording" />
      <Label class="fas" :text="'fa-trash' | fonticon" color="gray" fontSize="40" @tap="deleteRecording" />
  </StackLayout>
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
              clock: '00:00:00',
              id: this.$store.getters.getCustomerInformation.Id.Value,
              folder: '',
              filepath: '',
              filename: this.$store.getters.getPlayFile,
              trackDuration: null,
              player: new TNSPlayer(),
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
              },
              errorCallback: function() {
                  console.log("Error callback: " + JSON.stringify(errorObject))
              },
              infoCallback: function() {
                  console.log("Info callback: " + JSON.stringify(args))
              }
          })


      },
      methods: {
          playRecording() {
              if (this.player.isAudioPlaying()) {
                this.player.pause();
              } else {
                this.player.play();
              }
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
          }
      },
  }
</script>

<style scoped lang="scss">

</style>
