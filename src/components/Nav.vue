<template>
    <div id="nav">
        <div id="navBar">
            <a @click="goAccueil1"><img :src="logo.source" :id="logo.title"/></a>
            <ul id="ulNavBar">
                <li v-for="(icon, index) in icones" :key="index">
                    <a :href="icon.lien" target="_blank"><i :class="icon.class"></i></a>
                </li>
                <li>
                    <a id="hamburger" @click="changeBar">
                        <i v-if="bar" class="fas fa-bars" ></i>
                        <i v-else class="fas fa-times"></i>
                    </a>
                </li>
            </ul>
        </div>
        <transition name="menuAnim">
            <div v-if="!bar" id="menu">
                <ul id="ulHamburger">
                    <li class="menuLi" @click="goAccueil">Accueil</li>
                    <li class="menuLi" @click="goEpisodes">Episodes</li>
                    <li class="menuLi">Blog</li>
                    <li class="menuLi">Contact</li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script>

    export default {
        name: 'NavBar', 
        data (){
            return {
                logo: {
                    title: 'indiemakerfr',
                    source: './assets/logo_indiemakerfr_black.png',
                    lien: '#',
                },
                icones: [
                    {title: 'soundCloud', lien:'https://soundcloud.com/indiemakerfr-becode', class: 'fab fa-soundcloud'},
                    // {title: 'instagram', lien:'#', class: 'fab fa-instagram'},
                    {title: 'twitter', lien:'https://twitter.com/indiemakerfr', class: 'fab fa-twitter'}, 
                ],
                bar: true,
            }
        },
        methods: {
            goAccueil1(){
                this.$router.push('/');
            },
            goAccueil(){
                this.$router.push('/');
                this.bar = !this.bar;
            },
            goEpisodes(){
                this.$router.push('/Emissions');
                this.bar = !this.bar;
            },
            changeBar(){
                this.bar = !this.bar;
            }
        }
    }

    
</script>

<style scoped>

    #nav {
        width: 100%;
        z-index: 2;
    }
    #navBar {
        width: 100%;
    }
    #indiemakerfr {
        width: 9vw;
        min-width: 90px;
        margin-left: 2vw;
        margin-top: 7px;
    }
    #nav>li>a:hover, #nav>li>a:focus {
        text-decoration: none;
        background-color: transparent;
        
    }
    
    #nav>li>a:hover, #nav>li>a:focus{
        text-decoration: none;
        background-color: transparent;
    }
    .fab, .fas  {
        margin-left: -34px;
        color:#b0b9c4;
        font-size: 1.5em;
        margin-top: 13px;
        margin-right: 30px;
        -webkit-transition: all .2s ease-in-out;
        transition: all .2s ease-in-out;
    }
    .fab:hover, .fas:hover {
        color: #759faa;
        transform: scale(1.6);
        font-size: 1.5em;
        margin-right: 27px;
    }
    #menu {
        width: 102%;
        margin: auto;
        height: 92vh;
        background-color: #96c3ca;
        font-family: 'Concert One', cursive;
        text-align: center;
        position: fixed;
        z-index: 10;
    }
    .menuAnim-enter-active, .menuAnim-leave-active {
        transition: opacity 1.5s;
    }
    .menuAnim-enter, .menuAnim-leave-to {
        opacity: 0;
    }

    .menuLi{
        list-style-type: none;
        font-size : 6vw;
        cursor: pointer;
    }
    .menuLi:hover{
        list-style-type: none;
        font-size : 6vw;
        background-color: #506f77;
        cursor: pointer;
        color: white;
        /* box-sizing: content-box; */
        width: 110%;
        margin-left: -5%;
        ;
    }
    
    #ulNavBar {
        margin: 0 -40px 0 0;
        padding: 0;
        width: 150px;
        list-style-type: none;
        float: right;
        display: flex;
        flex-direction: row;
    }
    #ulNavBar>li {
        display: inline-block;
        padding: 10px;
    }

    /* @media only screen and (max-width: 800px){
        #ulNavBar {
            display: flex;
            flex-direction: column-reverse;
            width: 30px;
        }
        #navBar {
            width: 100%;
        }   
    } */
</style>
