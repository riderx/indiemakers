import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMainStore = defineStore('main', () => {
    const epFound = ref('')
    const modal = ref('')
    const emailForNewletter = ref(false)
    const emailForSignIn = ref('')
    const nextAfterSign = ref('')
    const tweetMaker = ref('')
    const nextGuid = ref('')
    const epGui = ref('')
    const randomModal = ref({})

    return {
        epFound,
        modal,
        emailForNewletter,
        emailForSignIn,
        nextAfterSign,
        tweetMaker,
        nextGuid,
        epGui,
        randomModal,
    }
})