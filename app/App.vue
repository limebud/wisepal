<template>
    <login v-if="!this.$store.getters.getToken"></login>
    <startPage v-else></startPage>
</template>

<script>
    import Login from './components/Login/Login'
    import Search from './components/Search/Search'

    export default {
        components: {
            login: Login,
            startPage: Search
        }
    }

</script>


<style scoped>
</style>
