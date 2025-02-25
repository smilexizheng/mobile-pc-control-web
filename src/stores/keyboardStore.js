import {defineStore} from 'pinia'
import {ref} from "vue";
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";
import {useIntervalFn, useToggle} from "@vueuse/core";
import {useSocketStore} from "@/stores/socket.js";

export const useKeyBoardStore = defineStore('keyboardStore', () => {


    const socket = useSocketStore()
    // 持续快速按键
    const keyboardData = ref(null);
    const keyToggleData = ref(null);
    const isToggle = ref(false)
    const {
        pause: intervalPressPause,
        resume: intervalPressResume,
        isActive: intervalPressIsRun
    } = useIntervalFn((event, eventData) => {
        if (keyboardData.value && socket.isConnected) {
            socket.emit(keyboardData.value.event, keyboardData.value.eventData)
        } else {
            intervalPressPause();
        }
    }, 50)


    function keypress(params) {
        socket.emit(CE.KEYPRESS, params)
    }

    function keyToggle(params) {
        if (isToggle.value) {
            socket.emit(CE.KEY_TOGGLE, {...keyToggleData.value, down: "up"});
            isToggle.value =false;
        }
        if (params) {
            keyToggleData.value = {...params};
            console.log(keyToggleData.value)
            socket.emit(CE.KEY_TOGGLE, {...params, down: "down"})
            isToggle.value =true;
        }


    }


    const startIntervalPress = (data) => {
        intervalPressPause();
        keyboardData.value = {...data};
        intervalPressResume();
    }

    const clearKeyEvent = () => {
        if (intervalPressIsRun) {
            keyboardData.value = null;
            intervalPressPause();
        }

        keyToggle(null)
    }


    return {keypress, keyToggle, startIntervalPress, clearKeyEvent, intervalPressIsRun}
})