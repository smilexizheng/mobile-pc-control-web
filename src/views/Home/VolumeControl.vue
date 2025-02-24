<script setup>
import {onMounted, ref} from "vue";
import {useSocketStore} from '@/stores/socket'
import {useDebounceFn, useThrottleFn} from "@vueuse/core";

const socketStore = useSocketStore()


const volume = ref(0.1);
const isMuted = ref(false);
onMounted(() => {
  socketStore.emit('sys-volume',null)
  socketStore.on('sys-volume',useDebounceFn( (res) => {
    volume.value = res.data.volume/100;
    isMuted.value = res.data.mute
  }),500)
})


const toggleMute = () => {
  socketStore.emit('sys-toggle-mute',null)
}

const setVolume = () => {
  socketStore.emit('sys-set-volume',volume.value*100)
}


</script>
<template>
  <div class="music-controls">
    <!-- 音量控制行 -->
    <div class="volume-control">
      <div class="volume-icon" @click="toggleMute">{{ isMuted ? '🔇' : '🔊' }}</div>
      <input
          type="range"
          class="ios-slider"
          @input="setVolume"
          min="0"
          max="1"
          step="0.02"
          v-model="volume"
      />
      <div class="volume-icon">{{ (volume * 100).toFixed(0) }}</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.music-controls {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  width: 96%;
  max-width: 400px;
  margin: 20px auto;
}


.ios-slider {
  -webkit-appearance: none;
  width: 95%;
  height: 4px;
  background: #e5e5ea;
  border-radius: 2px;
  margin: 0 12px;

  &:hover {
    height: 8px;
    border-radius: 6px;
  }
}

.ios-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  background: #007AFF;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 122, 255, 0.3);
  transition: transform 0.1s;
}

.ios-slider:active::-webkit-slider-thumb {
  transform: scale(1.1);
}

.volume-control {
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.volume-icon {
  width: 5%;
  font-size: 16px;
  opacity: 0.8;
}

/* 响应式调整 */
@media (max-width: 375px) {
  .music-controls {
    padding: 16px;
  }

}

@media (prefers-color-scheme: dark) {
  .music-controls {
    background: rgba(28, 28, 30, 0.95);
  }

  .ios-slider {
    background: rgba(72, 72, 74, 0.8);
  }
}
</style>
