<template>
<Page >
    <ActionBar>
        <GridLayout width="100%" columns="*, auto, *">
            <Label col="1" :text="this.$store.getters.getCustomerInformation.Name.Value" class="name" />
        </GridLayout>
    </ActionBar>

  <GridLayout rows="*, 8*, 2*" columns="*, 8*, *" >
      <TextView v-model="text" row="1", col="1" class="textbox" verticalAlignment="center"/>

      <FlexboxLayout row="2" col="1" justifyContent="space-around" class="icons">
          <Label col="0" class="fas icon" :text="'fa-save' | fonticon" fontSize="40" @tap="saveText" />
          <Label v-if="file" col="1" class="fas icon" :text="'fa-trash' | fonticon" fontSize="40" @tap="deleteFile" />
      </FlexboxLayout>
  </GridLayout>
</Page>
</template>


<script>
  import * as fs from 'tns-core-modules/file-system'
  import * as dialogs from 'tns-core-modules/ui/dialogs'


  export default {
      data() {
          return {
              text: '',
              folder: '',
              id: this.$store.getters.getCustomerInformation.Id.Value,
              file: this.$store.getters.getReadFile ? this.$store.getters.getReadFile : null
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
                      } else {
                          return
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



    TextView {
        height: 100%;
    }

    .icon {
        width: 30%;
        vertical-align: center;
        text-align: center;
        border-radius: 5;
    }

    .textbox {
        border-width: 2;
        border-color: #ddd;
        border-radius: 10;
        background: #fff;
    }
</style>
