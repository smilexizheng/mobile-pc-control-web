import {defineStore} from 'pinia'
import {io} from 'socket.io-client'
import {ref} from "vue";
import {CLIENT_ON_EVENTS as CO} from "@/constant/client-on.js";
import {useIntervalFn} from "@vueuse/core";
import router from "@/router/index.js";
import {useDebounceFn} from '@vueuse/core'
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";
import Message from '@/components/Message/useMessage'

/**
 *  持续触发 任意socket某个事件
 *  startEventInterval({event:CE.KEYPRESS,eventData:{key:'pageup'}})"
 *
 */
export const useSocketStore = defineStore('socket', () => {
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
                path:"/win-control.io",
                transports: ['websocket'],
                auth: {
                    token: 'ssss'
                }
            })

            socket.value.on('connect', () => {
                isConnected.value = true
            })

            socket.value.on('disconnect', (reason) => {
                Message.error(reason)
                isConnected.value = false
            })

            socket.value.on('error', (error) => {
                Message.error(error)
            })

            socket.value.on("connect_error", (err) => {
                Message.error(err.message)
            });



            socket.value.on(CO.RESPONSE, (data) => {
                if (data.success) {
                    // todo 某些事件不需要提示
                    if(data.event.charAt(0)!== 's'){
                        Message.success(data.msg ||data.event+'操作成功')
                    }
                }else {
                    Message.error(data.msg ||data.event+'操作失败')
                }
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
        eventHandler,
        startIntervalPress: startEventInterval,
        clearKeyEvent: stopEventInterval,
        intervalIsRun
    }
})