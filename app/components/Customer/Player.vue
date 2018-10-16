<template>
<Page>
  <StackLayout>
      <Button text="Spela upp" @tap="playRecording" />

  </StackLayout>
</Page>
</template>


<script>
  import * as fs from 'tns-core-modules/file-system'
  import { AudioPlayerOptions, AudioRecorderOptions, TNSPlayer, TNSRecorder } from 'nativescript-audio'
  import * as Toast from 'nativescript-toast';
  import * as application from "tns-core-modules/application";
  const dialogs = require('tns-core-modules/ui/dialogs')

  export default {
      data() {
          return {
              clock: '00:00:00',
              id: this.$store.getters.getCustomerInformation.Id.Value,
              folder: '',
              filename: '',
              trackDuration: null,
              player: new TNSPlayer(),
          }
      },
      created() {
          this.folder = fs.knownFolders.currentApp().getFolder('recordings/' + this.id)
          this.filename = this.folder.path + '/' + this.$store.getters.getPlayFile
          
          this.player.initFromFile({
              audioFile: this.filename,
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
      },
  }
</script>

<style scoped lang="scss">

</style>
