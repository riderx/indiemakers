<template>
    <button @click="goEpisodes">Les Episodes</button>
</template>

<script>
export default {
    name: 'boutonEpisodes',
    methods: {
        goEpisodes(){
            this.$router.push('/Emissions');
        },
    }
}
</script>

<style scoped>
    button {
        position: absolute;
        top: 65%;
        left: 21%;
        margin-left: 0px;
        margin-top: 0px;
        padding: 10px 10px 10px 10px;
        color: #fff;
        font-size: 1.5em;
        text-align: center;
        -webkit-transition-duration: 0.4s; /* Safari */
        transition-duration: 0.5s;
        text-decoration: none;
        overflow: hidden;
        background-color: #69a1ac;
        border: none;
        }

    button:hover {
        background-color: #69a1ac;
        -webkit-box-shadow: 0px 1px 41px 13px rgb(105, 161, 172);
        box-shadow: 0px 1px 41px 13px rgb(105, 161, 172);
        color: #ffffff;
        transform: scale(1);
        /* border: solid white 1px; */
    }



@media only screen and (max-width: 800px){
    button {
        position: absolute;
        width: 30%;
        top: 80%;
        left: 31%;
        margin-left: 10px;
        margin-top: 0px;
        padding: 10px 10px 10px 10px;
        color: #fff;
        font-size: 1em;
        text-align: center;
        -webkit-transition-duration: 0.4s; /* Safari */
        transition-duration: 0.5s;
        text-decoration: none;
        overflow: hidden;
        background-color: #69a1ac;
        border: none;
        }
        
}


@media only screen and (max-width: 400px){
    button {
        position: absolute;
        width: 30%;
        top: 90%;
        left: 31%;
        margin-left: 10px;
        margin-top: 0px;
        padding: 10px 10px 10px 10px;
        color: #fff;
        font-size: 1em;
        text-align: center;
        -webkit-transition-duration: 0.4s; /* Safari */
        transition-duration: 0.5s;
        text-decoration: none;
        overflow: hidden;
        background-color: #69a1ac;
        border: none;
    }
        
}

</style>
