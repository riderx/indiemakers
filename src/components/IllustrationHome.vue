<template>
    <div id="illustrationAccueil">
        <img id="decor" src="assets/decor.png" width="100%" class="img-fluid" alt="humaaans by Pablo Stanley">
        <img id="homme" src="assets/homme.png" width="100%" class="img-fluid" alt="humaaans by Pablo Stanley">
        <img id="femme" src="assets/femme.png" width="100%" class="img-fluid" alt="humaaans by Pablo Stanley">
        <img id="mic" src="assets/new_mic.png" width="100%" class="img-fluid" alt="humaaans by Pablo Stanley">
        <div>
            <p  id="pablo">@pablostanley</p>
        </div>    
    </div>
</template>

<script>
    export default {
        name: 'IllustrationAccueil',
    }
</script>

<style scoped>
    #illustrationAccueil{
        width: 50vw;
        z-index:-10;
    }
    #illustrationAccueil {
        opacity: 1;
        margin-top: 0;
    }
    #homme  {
        position: absolute;
        width: 17%;
        top: 50%;
        left: 58%;
        animation: animationFrames ease 2s;
        animation-iteration-count: 1;
        transform-origin: 50% 50%;
        animation-fill-mode: forwards;
        -webkit-animation: animationFrames ease 2s;
        -webkit-animation-iteration-count: 1;
        -webkit-transform-origin: 50% 50%;
        -webkit-animation-fill-mode: forwards;
        -moz-animation: animationFrames ease 2s;
        -moz-animation-iteration-count: 1;
        -moz-transform-origin: 50% 50%;
        -moz-animation-fill-mode: forwards;
        -o-animation: animationFrames ease 2s;
        -o-animation-iteration-count: 1;
        -o-transform-origin: 50% 50%;
        -o-animation-fill-mode: forwards;
        -ms-animation: animationFrames ease 2s;
        -ms-animation-iteration-count: 1;
        -ms-transform-origin: 50% 50%;
        -ms-animation-fill-mode: forwards;
        /* z-index: 30 !important; */
    }


    @keyframes animationFrames{
        0% {
            opacity:0;
            transform:  translate(-1500px,0px)  ;
        }
        60% {
            opacity:1;
            transform:  translate(30px,0px)  ;
        }
        80% {
            transform:  translate(-10px,0px)  ;
        }
        100% {
            opacity:1;
            transform:  translate(0px,0px)  ;
        }
    }

    @-moz-keyframes animationFrames{
        0% {
        opacity:0;
        -moz-transform:  translate(-1500px,0px)  ;
        }
        60% {
        opacity:1;
        -moz-transform:  translate(30px,0px)  ;
        }
        80% {
        -moz-transform:  translate(-10px,0px)  ;
        }
        100% {
        opacity:1;
        -moz-transform:  translate(0px,0px)  ;
        }
    }

    @-webkit-keyframes animationFrames {
        0% {
        opacity:0;
        -webkit-transform:  translate(-1500px,0px)  ;
        }
        60% {
        opacity:1;
        -webkit-transform:  translate(30px,0px)  ;
        }
        80% {
        -webkit-transform:  translate(-10px,0px)  ;
        }
        100% {
        opacity:1;
        -webkit-transform:  translate(0px,0px)  ;
        }
    }

    @-o-keyframes animationFrames {
        0% {
        opacity:0;
        -o-transform:  translate(-1500px,0px)  ;
        }
        60% {
        opacity:1;
        -o-transform:  translate(30px,0px)  ;
        }
        80% {
        -o-transform:  translate(-10px,0px)  ;
        }
        100% {
        opacity:1;
        -o-transform:  translate(0px,0px)  ;
        }
    }
    
    @-ms-keyframes animationFrames {
        0% {
        opacity:0;
        -ms-transform:  translate(-1500px,0px)  ;
        }
        60% {
        opacity:1;
        -ms-transform:  translate(30px,0px)  ;
        }
        80% {
        -ms-transform:  translate(-10px,0px)  ;
        }
        100% {
        opacity:1;
        -ms-transform:  translate(0px,0px)  ;
        }
    }

    #femme {
        position: absolute;
        width: 13%;
        top:55%;
        left: 70%;
        animation: animationFemme ease-in-out 1s;
        animation-iteration-count: 1;
        transform-origin: 50% 50%;
        animation-fill-mode:forwards; /*when the spec is finished*/
        -webkit-animation: animationFemme  ease-in-out 2s;
        -webkit-animation-iteration-count: 1;
        -webkit-transform-origin: 50% 50%;
        -webkit-animation-fill-mode:forwards; /*Chrome 16+, Safari 4+*/ 
        -moz-animation: animationFemme  ease-in-out 2s;
        -moz-animation-iteration-count: 1;
        -moz-transform-origin: 50% 50%;
        -moz-animation-fill-mode:forwards; /*FF 5+*/
        -o-animation: animationFemme  ease-in-out 2s;
        -o-animation-iteration-count: 1;
        -o-transform-origin: 50% 50%;
        -o-animation-fill-mode:forwards; /*Not implemented yet*/
        -ms-animation: animationFemme  ease-in-out 2s;
        -ms-animation-iteration-count: 1;
        -ms-transform-origin: 50% 50%;
        -ms-animation-fill-mode:forwards; /*IE 10+*/
        /* z-index: 30 !important; */
    }

    @keyframes animationFemme{
        0% {
        transform:  translate(348px,40px)  ;
        }
        100% {
        transform:  translate(65px,32px)  ;
        }
    }
    
    @-moz-keyframes animationFemme{
        0% {
        -moz-transform:  translate(348px,40px)  ;
        }
        100% {
        -moz-transform:  translate(65px,32px)  ;
        }
    }
    
    @-webkit-keyframes animationFemme{
        0% {
        -webkit-transform:  translate(348px,40px)  ;
        }
        100% {
        -webkit-transform:  translate(65px,32px)  ;
        }
    }

    @-o-keyframes animationFemme {
        0% {
        -o-transform:  translate(348px,40px)  ;
        }
        100% {
        -o-transform:  translate(65px,32px)  ;
        }
    }
    
    @-ms-keyframes animationFemme{
        0% {
        -ms-transform:  translate(348px,40px)  ;
        }
        100% {
        -ms-transform:  translate(65px,32px)  ;
        }
    }

    

    #decor {
        position: absolute;
        top:23%;
        left: 52%;
        width: 40%;
        height: auto;
        /* top: 14%;
        left: 47%;*/
        z-index: -9999; 
    }
    #mic {
        position: absolute;
        width: 4%;
        top: 55%;
        left: 72%;
        animation: animationMic 5s;
        animation-iteration-count: 1;
        transform-origin: 50% 50%;
        animation-fill-mode:forwards; /*when the spec is finished*/
        -webkit-animation: animationMic ease 5s;
        -webkit-animation-iteration-count: 1;
        -webkit-transform-origin: 50% 50%;
        -webkit-animation-fill-mode:forwards; /*Chrome 16+, Safari 4+*/ 
        -moz-animation: animationMic ease 5s;
        -moz-animation-iteration-count: 1;
        -moz-transform-origin: 50% 50%;
        -moz-animation-fill-mode:forwards; /*FF 5+*/
        -o-animation: animationMic ease 5s;
        -o-animation-iteration-count: 1;
        -o-transform-origin: 50% 50%;
        -o-animation-fill-mode:forwards; /*Not implemented yet*/
        -ms-animation: animationMic ease 5s;
        -ms-animation-iteration-count: 1;
        -ms-transform-origin: 50% 50%;
        -ms-animation-fill-mode:forwards; /*IE 10+*/
        /* z-index: 30 !important; */
    }

    @keyframes animationMic{
        0% {
        opacity:0;
        transform:  translate(10px,-253px)  ;
        }
        100% {
        opacity:1;
        transform:  translate(10px,0px)  ;
        }
    }

    @-moz-keyframes animationMic{
        0% {
        opacity:0;
        -moz-transform:  translate(10px,-253px)  ;
        }
        100% {
        opacity:1;
        -moz-transform:  translate(10px,0px)  ;
        }
    }

    @-webkit-keyframes animationMic {
        0% {
        opacity:0;
        -webkit-transform:  translate(10px,-253px)  ;
        }
        100% {
        opacity:1;
        -webkit-transform:  translate(10px,0px)  ;
        }
    }
    
    @-o-keyframes animationMic {
        0% {
        opacity:0;
        -o-transform:  translate(10px,-253px)  ;
        }
        100% {
        opacity:1;
        -o-transform:  translate(10px,0px)  ;
        }
    }
    
    @-ms-keyframes animationMic {
        0% {
        opacity:0;
        -ms-transform:  translate(10px,-253px)  ;
        }
        100% {
        opacity:1;
        -ms-transform:  translate(10px,0px)  ;
        }
    }
    #pablo {
        position: absolute;
        top: 66%;
        left: 87.5%;
        font-size: 9px;
        text-align: right;
        -webkit-writing-mode: vertical-rl;
        -ms-writing-mode: tb-rl;
        writing-mode: vertical-rl;
        text-orientation: mixed;
        z-index: -51;
    }



@media only screen and (max-width: 800px){

    #illustrationAccueil{
        margin-top: -750px;
        width: 50vw;
        z-index: -1;
        opacity: 1;
    }
    #homme  {
        position: absolute;
        width: 27%;
        top: 25%;
        left: 26%;
        
    }
    #femme {
        position: absolute;
        width: 23%;
        top: 25%;
        left: 40%;
        }

    #decor {
        position: absolute;
        top:10%;
        left: 20%;
        width: 60%;
        height: auto;
        z-index: -9999; 
    }
    #mic {
        position: absolute;
        width: 5%;
        top: 25%;
        left: 48%;
        
    }

    #pablo {
        position: absolute;
        width: 10%;
        top: 30%;
        left: 67%;
        font-size: 7px;
        text-align: right;
        -webkit-writing-mode: vertical-rl;
        -ms-writing-mode: tb-rl;
        writing-mode: vertical-rl;
        text-orientation: mixed;
        z-index: -51;
    }
            
}
@media only screen and (max-width: 420px){
    #illustrationAccueil{
        margin-top: -750px;
        width: 50vw;
        z-index: -1;
        opacity: 1;
    }
    #homme  {
        position: absolute;
        width: 27%;
        top: 25%;
        left: 26%;
        
    }
    #femme {
        position: absolute;
        width: 23%;
        top: 25%;
        left: 40%;
    }

    #decor {
        position: absolute;
        top:10%;
        left: 20%;
        width: 60%;
        height: auto;
        z-index: -9999; 
    }
    #mic {
        position: absolute;
        width: 5%;
        top: 25%;
        left: 48%;
        
    }

    #pablo {
        position: absolute;
        width: 10%;
        top: 30%;
        left: 67%;
        font-size: 7px;
        text-align: right;
        -webkit-writing-mode: vertical-rl;
        -ms-writing-mode: tb-rl;
        writing-mode: vertical-rl;
        text-orientation: mixed;
        z-index: -51;
    }
}







</style>
