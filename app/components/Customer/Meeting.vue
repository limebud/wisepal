<template>
  <StackLayout>
      <GridLayout columns="*, auto, *" class="tasks">
          <FlexboxLayout col="1">
              <Label class="fas" :text="'fa-pen' | fonticon" col="1" />
              <Label class="fa" :text="'fa-camera' | fonticon" col="1" />
              <Label class="fa" :text="'fa-microphone' | fonticon" col="1" />
          </FlexboxLayout>
      </GridLayout>
  </StackLayout>
</template>


<script>
  export default {
      name: "meeting",
      data() {
          return {
          }
      }
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

</style>
