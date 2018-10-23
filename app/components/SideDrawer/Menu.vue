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
            this.$store.commit('deleteToken')
            this.$navigateTo(Login, {
                clearHistory: true
            })
        },
        goHome() {
            this.$navigateTo(Startview)
        },
    }
}
</script>
