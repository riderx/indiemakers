<template>
    <div id="TextAccueil" class="jumbotron-fluid">
        <h1 id="titreAccueil">{{ titre }}</h1>
        <p id="message">{{ message }}</p>
        <br />
        <p id="bannière">{{ bannière }}</p>
    </div>
</template>

<script>
    export default {
        name: 'TextAccueil',
        data () {
            return {
                titre: 'Un podcast sur le développement web.',
                message: "Le podcast qui parle à la génération d'auto-apprenants des technologies web. Nous sommes inspirés par l'idée de dé-coder les sujets de soft-skills ou tech-skills. En bref, libérer la parole et le savoir pour accompagner le parcours de \"l'aspirant web-dev\".",
                bannière: '#Innovation, #Entrepreunariat, #MarcheDuTravail, #AutoFormation, #Productivite, #Outils.'
            }
        },
    }
</script>

<style scoped>
    #Accueil {
        position: absolute;
        width: 40%;
        top:15%;
        left:4%;
        display: flex;
        flex-flow: column nowrap;
        margin-right: 100px;
        padding-top: 80px;
        margin-left: 61px;
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


    .btn {
        width: 150px;
        color: #ffffff;
        background-color: #96c3ca;
        border-color: #96c3ca;
        transition: all .2s ease-in-out; 
    }

    .btn:hover {
        color: #ffffff;
        background-color: #759faa;
        border-color: #759faa;
    }

    h1 {
        width: 433px;
        font-size: 39px;
        color: #96c3ca;
        font-family: 'Concert One', cursive;
        margin-bottom:45px;
    }

    p {
        font-family: 'Lato', sans-serif; 
        margin-right: 200px;
        font-size: 1.5em;
        /*margin: 100px;*/
    }



    button:hover{
        background: #c1dee2;
        -webkit-box-shadow: 0px 2px 10px 5px rgb(11, 82, 121);
        box-shadow: 0px 2px 10px 5px rgb(193, 222, 226);
        color: #191847;
    }

    button:after {
        content: "";
        background: #89c5cc;
        display: block;
        position: absolute;
        padding-top: 300%;
        padding-left: 350%;
        margin-left: -20px !important;
        margin-top: -120%;
        opacity: 0;
        transition: all 0.8s
    }

    button:active:after {
        padding: 0;
        margin: 0;
        opacity: 1;
        transition: 0s
    }
    
    @media only screen and (max-width: 800px){
        #TextAccueil {
        position: absolute;
        width: 80%;
        top: 48%;
        left:4%;
        display: flex;
        flex-flow: column nowrap;
        margin-right: 0px;
        padding-top: 0px;
        margin-left: 20px;
       
        }

        h1{
          
        width: 100%;
        font-size: 30px;
        color: #96c3ca;
        font-family: 'Concert One', cursive;
         margin-top: 60px;
        margin-bottom: 0px;
      
}
    p {
        font-family: 'Lato', sans-serif; 
        margin-right: 200px;
        font-size: 1em;
        /*margin: 100px;*/
    }

     #message {
         
        width: 60%;
        margin: 0px;
        font-size: 0.9em;
        margin-top: 50px;
    }

    #bannière {
        width: 100%;
        font-size: 2em;
        margin: 0;
    }
        
    }


    @media only screen and (max-width: 400px){
    
    #TextAccueil {
        position: absolute;
        width: 80%;
        top: 48%;
        left:4%;
        display: flex;
        flex-flow: column nowrap;
        margin-right: 0px;
        padding-top: 0px;
        margin-left: 20px;
       
        }

        h1{
        width: 100%;
        font-size: 25px;
        color: #96c3ca;
        font-family: 'Concert One', cursive;
         margin-top: 5px;
        margin-bottom: 0px;
      
}
    p {
        font-family: 'Lato', sans-serif; 
        margin-right: 200px;
        font-size: 1em;
        /*margin: 100px;*/
    }

    #message {
        width: 100%;
        margin: 0px;
        font-size: 0.9em;
        margin-top: 15px;
    }
        
    }

    #bannière {
        width: 100%;
        font-size: 0.8em;
        margin: 0;
    }



</style>
