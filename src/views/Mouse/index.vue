<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import {useSocketStore} from '@/stores/socket'
import TextInput from "@/views/Mouse/TextInput.vue";
import {useEventListener, useIntervalFn, useThrottleFn, useToggle,useTitle} from "@vueuse/core";
import {posThreshold} from "@/utils/common.js";
import {CLIENT_ON_EVENTS as CO} from "@/constant/client-on.js";
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";

const socketStore = useSocketStore()
import {useKeyBoardStore} from "@/stores/keyboardStore.js";
import ScreenShow from "@/views/Mouse/ScreenShow.vue";
const keyBoard = useKeyBoardStore()
useTitle('PC 键鼠控制')
// 响应式状态
const padRef = ref(null)
// 起点
const touchStartPos = ref({x: 0, y: 0, time: 0})
// 移动距离
const moveDistancePos = ref({x: 0, y: 0})
// 是否按下
const isDragging = ref(false)
// 是否已经移动
const isMove = ref(false)

const leftDown = ref(false)
const [showScreen, toggleShowScreen] = useToggle(false)


// 添加双击相关状态
const lastTapTime = ref(0)
const tapTimeout = ref(null)
const tapCount = ref(0)


const connectionStatus = ref('disconnected') // disconnected/connecting/connected/error


const connectSocket = () => {
  sendCoordinates() // 发送初始坐标
  socketStore.on(CO.SYS_POINTER_POS, (res) => {
    console.log(res)
  })
}

// 触摸事件处理
const handleStart = (e) => {
  // e.preventDefault()
  const touch = e.touches[0]
  touchStartPos.value = {
    x: touch.clientX,
    y: touch.clientY,
    time: Date.now()
  }
  if (tapCount.value = 0) {
    lastTapTime.value = Date.now()
  }

  isDragging.value = true
  isMove.value = false
  leftDown.value = false
  socketStore.emit(CE.SYS_POINTER_START, null)
}


const handleMove = (e) => {
  if (!isDragging.value) return

  const touch = e.touches[0]
  const deltaX = touch.clientX - touchStartPos.value.x
  const deltaY = touch.clientY - touchStartPos.value.y

  moveDistancePos.value.x = deltaX * 3

  moveDistancePos.value.y = deltaY * 2

  sendCoordinates()
}

// 发送坐标数据
const sendCoordinates =
    // useThrottleFn(
    () => {
      if (!socketStore?.isConnected ||
          (moveDistancePos.value.x === 0 &&
              moveDistancePos.value.y === 0)) return
      if (!isMove.value && posThreshold(moveDistancePos.value.x, moveDistancePos.value.y, 30)) {
        isMove.value = true;
        // 左键按下
        if (!leftDown.value && Date.now() - touchStartPos.value.time > 300) {
          socketStore.emit(CE.SYS_MOUSE_TOGGLE, {down: "down", button: "left"})
          leftDown.value = true;
        }
      }

      socketStore.emit(CE.SYS_POINTER_MOVE, {
        x: moveDistancePos.value.x,
        y: moveDistancePos.value.y,
        timestamp: Date.now()
      })
    }
// , 10, true);

const handleEnd = () => {
  // 释放左键
  if (leftDown.value) {
    socketStore.emit(CE.SYS_MOUSE_TOGGLE, {down: "up", button: "left"})
    leftDown.value = false
  }

  // 操作类型判断
  if (!isMove.value) {
    const currentTime = Date.now()
    const tapDuration = currentTime - touchStartPos.value.time

    // 长按右键（500ms）
    if (tapDuration > 500) {
      socketStore.emit(CE.SYS_MOUSE_CLICK, {button: "right", double: false})
    }
    // 单击/双击判断
    else if (tapDuration < 200) {
      if (currentTime - lastTapTime.value < 200) {
        clearTimeout(tapTimeout.value)
        tapCount.value = 0
        // 双击
        socketStore.emit(CE.SYS_MOUSE_CLICK, {button: "left", double: true})
      } else {
        // 单击
        tapCount.value = 1
        tapTimeout.value = setTimeout(() => {
          if (tapCount.value === 1) {
            socketStore.emit(CE.SYS_MOUSE_CLICK, {button: "left", double: false})
          }
          tapCount.value = 0
        }, 200)
      }
      lastTapTime.value = currentTime
    }
  }
  isDragging.value = false
  isMove.value = false

  moveDistancePos.value = {x: 0, y: 0}
  socketStore.emit(CE.SYS_POINTER_END, null)
}



// 状态显示文本
const statusText = computed(() => {
  connectionStatus.value = socketStore.isConnected ? 'connected' : 'disconnected'
  return {
    disconnected: '未连接',
    connected: '已连接'
  }[connectionStatus.value]
})


// 生命周期
onMounted(() => {
  connectSocket()
})


</script>

<template>
  <div class="touchpad-container">
    <ScreenShow v-show="showScreen"/>
    <!-- 触控板区域 -->
    <div
        ref="padRef"
        class="touch-surface"
        @touchstart="handleStart"
        @touchmove.prevent="handleMove"
        @touchend="handleEnd"
    >
      .x: {{ moveDistancePos.x }}
      .y: {{ moveDistancePos.y }}
      {{ Date.now() - touchStartPos.time }}
    </div>


    <!-- 连接状态 -->
    <div class="status" style="right:auto;left:20px;" @click="$router.push('/')">
      返回
    </div>
    <!-- 连接状态 -->
    <div class="status">
      <span :class="['indicator', connectionStatus]"></span>
      {{ statusText }}
    </div>

    <div class="right-side">
      <img src="@/assets/icons/look_screen.svg" alt="显示屏幕"   @click="toggleShowScreen()" >

      <!--      <img src="@/assets/icons/roller_up.svg" alt="滚轮按键"   @touchstart.passive="keyBoard.keyToggle({key:'a'})" >-->
      <img src="@/assets/icons/roller_up.svg" alt="滚轮按键"   @touchstart.passive="keyBoard.startIntervalPress({event:CE.KEYPRESS,eventData:{key:'pageup'}})" >
      <img src="@/assets/icons/roller_down.svg" alt="滚轮按键" @touchstart.passive="keyBoard.startIntervalPress({event:CE.KEYPRESS,eventData:{key:'pagedown'}})">
      <img src="@/assets/icons/backspace.svg"  alt="删除"
           @touchstart.passive="keyBoard.startIntervalPress({event:CE.KEYPRESS,eventData:{key:'backspace'}})">
    </div>


  </div>
  <TextInput/>
</template>


<style scoped lang="less">
.touchpad-container {
  height: 100%;
  position: relative;
  overflow: hidden;


  * {
    user-select: none;
    touch-action: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
}

.touch-surface {
  height: 100%;
  border-radius: 10px;
  background: #e3e2e2;
  position: relative;
}


.right-side {
  position: fixed;
  right: 12px;
  top: 60%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;

  & img {
    width: 42px;
  }
}


.status {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
}

.indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.indicator.disconnected {
  background: #ff3b30;
}

.indicator.connecting {
  background: #ffcc00;
}

.indicator.connected {
  background: #34c759;
}

.indicator.error {
  background: #ff2d55;
}
</style>