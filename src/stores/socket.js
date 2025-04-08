import {defineStore} from 'pinia'
import {io} from 'socket.io-client'
import {ref} from "vue";
import {useIntervalFn} from "@vueuse/core";
import router from "@/router/index.js";
import {useDebounceFn} from '@vueuse/core'
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";
import {showNotify,showToast  } from '@nutui/nutui'
import {LocalEventStore} from "@/stores/localEventStore.js";

/**
 *  持续触发 任意socket某个事件
 *  startEventInterval({event:CE.KEYPRESS,eventData:{key:'pageup'}})"
 *
 */
export const useSocketStore = defineStore('socket', () => {
    const localEventStore = LocalEventStore()
    const socket = ref(null)
    const isConnected = ref(false)


    const intervalData = ref(null);
    const interval = ref(50)

    const {
        pause: intervalPause,
        resume: intervalResume,
        isActive: intervalIsRun
    } = useIntervalFn((event, eventData) => {
        if (intervalData.value && isConnected.value) {
            emit(intervalData.value.event, intervalData.value.eventData)
        } else {
            intervalPause();
        }
    }, interval)

    function connect() {
        if (!socket.value) {
            socket.value = io(import.meta.env.VITE_SOCKET_URL, {
                autoConnect: true,
                path: "/win-control.io",
                transports: ['websocket'],
                auth: {
                    token: 'ssss'
                }
            })

            socket.value.on('connect', () => {
                isConnected.value = true
            })

            socket.value.on('disconnect', (reason) => {
                console.log(reason)
                showNotify.warn(reason)
                isConnected.value = false
            })

            socket.value.on('error', (error) => {
                showNotify.warn(error)
            })

            socket.value.on("connect_error", (err) => {
                console.error(err)
                showNotify.warn(err.message)
            });


            socket.value.on(CE.RESPONSE, (data) => {
                if (data.success) {
                    // todo 某些事件不需要提示
                    // if (data.event?.charAt(0) !== 's') {
                        showToast.text(data.msg || data.event + '操作成功')
                    // }
                } else {
                    showNotify.warn(data.msg || data.event + '操作失败')
                }
            })

            socket.value.on(CE.EVENTS_GET, (data) => {
                localEventStore.customEvents = data
            })



        }
    }

    function on(event, callback) {
        socket.value?.on(event, callback)
    }

    function off(event, callback) {
        socket.value?.off(event)
    }

    function emit(event, data) {
        socket.value?.emit(event, data)
    }

    function once(event, data) {
        socket.value?.once(event, data)
    }


    const startEventInterval = (data) => {
        intervalData.value = {...data};
        intervalResume();
    }

    const stopEventInterval = () => {
        if (intervalIsRun) {
            intervalData.value = null;
            intervalPause();
        }
    }

    function setInterval(val) {
        interval.value = val;
    }

    function disconnect() {
        socket.value?.disconnect()
        socket.value = null
    }


    const eventHandler = useDebounceFn((item) => {
        if (item.events) {
            // socket事件
            item.events.forEach(event => {
                setTimeout(() => {
                    emit(event.event, event.eventData);
                }, event.delay || 0)
            })
        } else if (item.action) {
            // 其他动作
            switch (item.action) {
                case'router':
                    router.push(item.toLink).then()
                    break;
                default:
                    break;
            }
        } else {
            switch (item.name) {
                case 'A':
                    emit(CE.KEYPRESS, {key: [72]})
                    break;
                case '播放/暂停':
                    emit(CE.KEYPRESS, {key: [109]})
                    break;
                default:
                    alert(item.name + '没有符合定义的事件')
                    break;
            }
        }
    }, 100)


    return {
        socket,
        isConnected,
        connect,
        disconnect,
        on,
        off,
        emit,
        once,
        eventHandler,
        startIntervalPress: startEventInterval,
        clearKeyEvent: stopEventInterval,
        intervalIsRun
    }
})