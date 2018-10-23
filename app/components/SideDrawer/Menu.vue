<template>
    <StackLayout >
        <Button text="Start" @tap="goHome" />
        <Button text="Logga ut" @tap="logout" />
    </StackLayout>
</template>

<script>
    import Login from '../Login/Login.vue'
    import Startview from '../Startview/Startview.vue'

export default {
    methods: {
        logout() {
            if (!this.$store.getters.getRecordingStatus) {
                this.$store.commit('deleteToken')
                this.$navigateTo(Login, {
                    clearHistory: true
                })
            } else {
                alert("Du måste avsluta inspelningen innan du kan lämna den")
            }
        },
        goHome() {
            if (!this.$store.getters.getRecordingStatus) {
                this.$navigateTo(Startview)
            } else {
                alert("Du måste avsluta inspelningen innan du kan lämna den")
            }
        },
    }
}
</script>
