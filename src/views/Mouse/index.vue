<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue'
import {useSocketStore} from '@/stores/socket'
import {useDebounceFn, useThrottleFn} from "@vueuse/core";


const socketStore = useSocketStore()
// 配置项

const SEND_INTERVAL = 16 // 约60fps (1000/60 ≈ 16.67)

// 响应式状态
const padRef = ref(null)
const coords = ref({x: 0, y: 0})
const lastTouch = ref({x: 0, y: 0})
const isDragging = ref(false)
const socket = ref(null)
const connectionStatus = ref('disconnected') // disconnected/connecting/connected/error

// 初始化坐标
const initCoordinates = () => {
  const rect = padRef.value.getBoundingClientRect()
  coords.value = {
    x: rect.width / 2,
    y: rect.height / 2
  }
}

// Socket.io 连接管理
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
  lastTouch.value = {
    x: touch.clientX,
    y: touch.clientY
  }
  isDragging.value = true
  socketStore.emit('sys-pointer-start', null)
}

const handleClick = () => {
  const button = isDragging.value ? "right" : "left"
  socketStore.emit('sys-mouse-click', {button, double: false})
}

const handleDbClick = () => {
  const button = isDragging.value ? "right" : "left"
  socketStore.emit('sys-mouse-click', {button, double: true})
}

const handleMove = (e) => {
  if (!isDragging.value) return

  const touch = e.touches[0]
  const deltaX = lastTouch.value.x - touch.clientX
  const deltaY = touch.clientY - lastTouch.value.y

  coords.value.x = deltaY
  coords.value.y = deltaX

  sendCoordinates()
}

const handleEnd = () => {
  isDragging.value = false
  socketStore.emit('sys-pointer-end', null)
}


// 发送坐标数据
const sendCoordinates = () => {
  if (socketStore?.isConnected) {
    socketStore.emit('sys-pointer-move', {
      x: coords.value.x,
      y: coords.value.y,
      timestamp: Date.now()
    })
  }
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
  initCoordinates()
  connectSocket()
})

onUnmounted(() => {
  if (socketStore) {
    socketStore.disconnect()
  }
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
      <div style="font-size: 50px;
    transform: translate(-7%, 400%) rotate(90deg);color: #e5e5ea">手机横置使用
      </div>
    </div>

    <!-- 连接状态 -->
    <div class="status">
      <span :class="['indicator', connectionStatus]"></span>
      {{ statusText }}
    </div>

    <!-- 连接状态 -->
    <div class="status" style="left:auto;right: 20px;" @click="$router.push('/')">
      返回
    </div>


  </div>
</template>


<style scoped>
.touchpad-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;

}

.touch-surface {
  margin: 20px;
  width: 100%;
  height: 100%;
  background: #f5f5f7;
  touch-action: none;
  position: relative;
}


.status {
  position: fixed;
  top: 20px;
  left: 20px;
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