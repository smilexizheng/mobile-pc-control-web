import {defineStore} from 'pinia'
import {io} from 'socket.io-client'
import {ref} from "vue";
import {CLIENT_ON_EVENTS as CO} from "@/constant/client-on.js";
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";
import {useEventListener, useIntervalFn} from "@vueuse/core";
export const useSocketStore = defineStore('socket', () => {
    const socket = ref(null)
    const isConnected = ref(false)

    function connect() {
        if (!socket.value) {
            socket.value = io(import.meta.env.VITE_SOCKET_URL, {
                autoConnect: true,
                transports: ['websocket']
            })

            socket.value.on('connect', () => {
                isConnected.value = true
            })

            socket.value.on('disconnect', () => {
                isConnected.value = false
            })

            socket.value.on(CO.RESPONSE, (data) => {
                console.log("response>>>>>>>>" + data)
            })
        }
    }

    function on(event, callback) {
        socket.value?.on(event, callback)
    }

    function emit(event, data) {
        socket.value?.emit(event, data)
    }



    function disconnect() {
        socket.value?.disconnect()
        socket.value = null
    }









    return {socket, isConnected, connect, disconnect, on, emit}
})