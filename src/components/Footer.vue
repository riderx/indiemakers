<template>
    <div id="footer">
        <div  id="infoMoins">
            <img src="assets/information.png" id="imgInfoMoins" @click="getInfo" />
            <span id="infoPlus" v-if="!displayInfo">
                <img id="imgInfoPlus" src="assets/creative-commons-783531_960_720.png">
                <p> | 2019 | Un projet BeCode | Site web : Andres Goldestein & Emilie Bialais</p>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name:'pied',
        data(){
            return {
                displayInfo: true
            }
        },
        methods: {
            getInfo(){
                this.displayInfo = !this.displayInfo;
            }
        }
    }
</script>

<style>
    #footer {
        width: 100vw;
        margin-top: 50px;
        z-index: 2;
    }
    #infoMoins {
        /* background-color: #f2f2f2; */
        display: flex;
        flex-flow: row-reverse wrap;
        justify-content: space-between;
        align-items: center;
    }
    #infoPlus {
        width: 90vw;
        height: 40px;
        text-align: center;
        z-index: -1;
        display: flex;
        justify-content: center; 
        align-items: center;
    }
    #imgInfoMoins {
        /* width: 40px;
        height: 30px; */
        margin: 10px;
        float: right;
    }

    #imgInfoPlus {
        width: 70px;
        margin-right: 25px;
    }

    #footer p {
        font-size: 0.8em;
        margin-top: 12px;
        color: #303777;
    }
    @media only screen and (max-width: 800px){
        #infoPlus {
            width: 85vw;
        }
        #imgInfoPlus {
            width: 50px;
        }
        #imgInfoMoins {
            width: 20px;
            height: 20px;
            margin: 5px;
        }
    }

</style>
