<template>
  <GridLayout rows="*, 60" >
      <TextView autocorrect="true" v-model="text" row="0" background="white"/>

      <FlexboxLayout row="1" justifyContent="space-around">
          <Label col="0" class="fas" :text="'fa-check' | fonticon" fontSize="34" @tap="saveText" color="#29b33c"/>
          <Label v-if="savedFile" col="1" class="fas" :text="'fa-times' | fonticon" fontSize="34" color="#bbb" @tap="deleteFile" />
      </FlexboxLayout>
  </GridLayout>
</template>



<script>
  import * as fs from 'tns-core-modules/file-system'
  import * as dialogs from 'tns-core-modules/ui/dialogs'
  import * as bghttp from "nativescript-background-http"

  export default {
        data() {
          return {
              text: '',
              folder: '',
              id: this.$store.getters.getTempId,
              file: this.$store.getters.getReadFile ? this.$store.getters.getReadFile : null,
              savedFile: this.$store.getters.getReadFile ? true : false,
              session: null
          }
        },
        methods: {
          saveText() {
              let defText = this.file ? this.file.name.split("-")[1].split('.')[0] : ''
              prompt({
                  message: "Spara som...",
                  okButtonText: "OK",
                  cancelButtonText: "Ångra",
                  defaultText: defText,
                  inputType: dialogs.inputType.text
                })
                .then(res => {
                    if (res.result) {
                        this.file = this.folder.getFile(this.id + '-' + res.text + '.txt')
                        this.checkDuplicate()
                    }
                })
          },
        checkDuplicate() {
            if (this.$store.getters.getNotes.includes(this.file.name)) {
                confirm({
                    message: "Skriver över anteckning",
                    okButtonText: "OK",
                    cancelButtonText: "Ångra"
                })
                .then(res => {
                    if (res) {
                        this.saveAndExit()
                    }
                })
            } else {
                this.saveAndExit()
            }
        },
        saveAndExit() {
            this.file.writeText(this.text)
            this.$store.dispatch('getFiles', { id: this.id, folder: 'notes' })
            this.$navigateBack()
        },
        deleteFile() {
            confirm({
                message: "Tar bort anteckningen",
                okButtonText: "OK",
                cancelButtonText: "Ångra"
            })
            .then(res => {
                if (res) {
                    this.$store.commit('removeNoteFromArray', this.file.name)
                    this.file.remove()
                    this.$navigateBack()
                }
             })
         }
      },
      created() {
          this.folder = fs.knownFolders.currentApp().getFolder('notes/' + this.id)
          if (this.$store.getters.getReadFile) {
              this.file = this.folder.getFile(this.file)
              this.file.readText()
              .then((res) => {
                  this.text = res
              })
          }
      },
      destroyed() {
          this.$store.commit('setReadFile', '')
      }

  }
</script>

<style scoped lang="scss">
    .icons {
        margin: 20 0;
        justify-content: space-around;
        font-size: 40;
        color: #aaa;
    }

    .icon {
        width: 30%;
        vertical-align: center;
        text-align: center;
        border-radius: 5;
    }
</style>
