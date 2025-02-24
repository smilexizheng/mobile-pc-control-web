<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import {useSocketStore} from '@/stores/socket'
import TextInput from "@/views/Mouse/TextInput.vue";


const socketStore = useSocketStore()

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
const rightDown = ref(false)

const connectionStatus = ref('disconnected') // disconnected/connecting/connected/error


const connectSocket = () => {
  socketStore.connect()
  sendCoordinates() // 发送初始坐标
  socketStore.emit("get-pointer", null)
  socketStore.on("pointer", (res) => {
    console.log(res)
  })
}

// 触摸事件处理
const handleStart = (e) => {
  const touch = e.touches[0]
  touchStartPos.value = {
    x: touch.clientX,
    y: touch.clientY,
    time: Date.now()
  }
  isDragging.value = true
  isMove.value = false
  leftDown.value = false
  socketStore.emit('sys-pointer-start', null)


}


const handleMove = (e) => {
  if (!isDragging.value) return

  const touch = e.touches[0]
  const deltaX = touch.clientX - touchStartPos.value.x
  const deltaY = touch.clientY - touchStartPos.value.y

  moveDistancePos.value.x = deltaX * 2
  moveDistancePos.value.y = deltaY * 1.5

  sendCoordinates()
}

// 发送坐标数据
const sendCoordinates = () => {
  if (socketStore?.isConnected) {
    // 左键按下
    if (!leftDown.value && !isMove.value && Date.now() - touchStartPos.value.time >= 200) {
      leftDown.value = true;
      socketStore.emit('sys-mouse-toggle', {down: "down", button: "left"})
    }
    socketStore.emit('sys-pointer-move', {
      x: moveDistancePos.value.x,
      y: moveDistancePos.value.y,
      timestamp: Date.now()
    })
    if (!isMove.value) {
      isMove.value = true;
    }
  }
}

const handleEnd = () => {
  // 长按
  if (!leftDown.value && Date.now() - touchStartPos.value.time >= 500 && !isMove.value) {
    socketStore.emit('sys-mouse-click', {button: "right", double: false})
  }

  // 释放左键
  if (leftDown.value) {
    socketStore.emit('sys-mouse-toggle', {down: "up", button: "left"})
  }

  isDragging.value = false
  isMove.value = false


  socketStore.emit('sys-pointer-end', null)
}


const handleClick = () => {
  socketStore.emit('sys-mouse-click', {button:'left', double: false})
}

const handleDbClick = () => {
  socketStore.emit('sys-mouse-click', {button:'left', double: true})
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
    <!-- 触控板区域 -->
    <div
        ref="padRef"
        class="touch-surface"
        @touchstart="handleStart"
        @touchmove.prevent="handleMove"
        @touchend="handleEnd"
        @click="handleClick"
        @dblclick="handleDbClick"
    >

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
      <img src="@/assets/icons/roller_up.svg" style="height: 50px;color: #333333" alt="滚轮按键"   @click="socketStore.emit('keypress',{key:'pageup'})">
      <img src="@/assets/icons/roller_down.svg" style="height: 50px" alt="滚轮按键"   @click="socketStore.emit('keypress',{key:'pagedown'})">
      <img src="@/assets/icons/enter_key.svg"  style="width:50px;" alt="回车按键" @click="socketStore.emit('keypress',{key:'enter'})">
    </div>


  </div>
  <TextInput/>
</template>


<style scoped lang="less">

.right-side {
  position: fixed;
  right: 20px;
  top: 55%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 30px;
}

.touchpad-container {
  height: 98vh;
  position: relative;
  overflow: hidden;

  *{
    user-select: none;
    touch-action: none;
  }
}

.touch-surface {
  width: 100%;
  height: 100%;
  background: #b6b4b4;
  position: relative;
  // 新增禁止选中样式
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;


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