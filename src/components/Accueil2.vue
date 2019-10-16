<template>
    <div id="Accueil2" class="jumbotron-fluid">
        <div id="main">
            <h1 id="titreAccueil">{{ titre }}</h1>
            <p id="message">{{ message }}</p>
            <br />
            <p id="bannière">{{ bannière }}</p>
            <button @click.passive="goEpisodes" id="button">Episodes</button>
        </div>
        <IllustrationAccueil />
    </div>
</template>

<script>

    import IllustrationAccueil from './IllustrationAccueil.vue'

    export default {
        name: 'TextAccueil',
        components: {
            IllustrationAccueil,
        },
        data () {
            return {
                titre: 'Un podcast sur le développement web.',
                message: "Le podcast qui parle à la génération d'auto-apprenants des technologies web. Nous sommes inspirés par l'idée de dé-coder les sujets de soft-skills ou tech-skills. En bref, libérer la parole et le savoir pour accompagner le parcours de \"l'aspirant web-dev\".",
                bannière: '#Innovation, #Entrepreunariat, #MarcheDuTravail, #AutoFormation, #Productivite, #Outils.'
            }
        },
        methods: {
            goEpisodes(){
                this.$router.push('/Emissions');
            }
        }
    }
</script>

<style scoped>
    #Accueil2{
        margin: auto;
        width: 100vw;
    }
    #main {
        width: 40%;
        display: flex;
        flex-flow: column nowrap;
        margin-right: 10px;
        padding-top: 150px;
        margin-left: 100px;
        z-index: 0;
    }
    #message {
        width: 100%;
        margin: 0px;
        font-size: 1em;
    }

    #bannière {
        width: 100%;
        font-size: 1em;
        margin: 0;
    }

    #button {
        width: 150px;
        color: #ffffff;
        background-color: #96c3ca;
        border-color: #96c3ca;
        transition: all .2s ease-in-out; 
        z-index: 0;
        margin-top: 46px;
        padding: 8px;
        font-size: 1.5em;
    }

    h1 {
        width: 433px;
        font-size: 39px;
        color: #96c3ca;
        font-family: 'Concert One', cursive;
        margin: 0 0 45px;
    }

    p {
        font-family: 'Lato', sans-serif; 
        margin-right: 200px;
        font-size: 1.5em;
        /*margin: 100px;*/
    }

    
    @media only screen and (max-width: 800px){
        #Accueil2 {
            display: flex;
            flex-flow: column nowrap;
        }
        #main {
            width: 100%;
            margin-right: auto;
            margin-top: -50px;
            margin-left: auto;
        }

        h1{
            width: 90%;
            margin: 0 auto 5px ;
            font-size: 2.3em;
        }

        #message {
            width: 90%;
            font-size: 1.4em;
            margin: 15px auto;
        }

        #bannière {
            width: 90%;
            font-size: 1.6em;
            margin: 0 auto;
        }
        #button {
            margin: 30px auto;
        }
    }


    @media only screen and (max-width: 420px){
        /* #Accueil2 {
            display: flex;
            flex-flow: column nowrap;
        } */
        #main {
            /* width: 100%;
            margin-right: auto; */
            margin-top: -150px;
            /* margin-left: auto; */
        }

        h1{
            width: 80%;
            font-size: 1.6em;
            margin: 0 20% auto;
            /* text-align: center; */
        }

        #message {
            /* width: 90%; */
            font-size: 1em;
            margin: 15px auto 5px;
        }

        #bannière {
            width: 90%;
            font-size: 1em;
            margin: auto;
        }
        /* #button {
            margin: 30px auto;
        } */
    }




</style>
