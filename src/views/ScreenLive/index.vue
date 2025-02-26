
<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue';
import flvjs from 'flv.js';
import {useSocketStore} from "@/stores/socket.js";

const socketStore = useSocketStore()
const videoPlayer = ref(null);
let flvPlayer = null;

onMounted(() => {

  // 初始化FLV播放器
  if (flvjs.isSupported()) {
    flvPlayer = flvjs.createPlayer({
      type: 'flv',
      isLive: true,
      hasAudio: false, // 根据实际需要调整
      url: 'ws://localhost:3000' // 伪URL，实际通过websocket传输
    }, {
      enableWorker: false, // 关闭分线程防止跨域问题
      stashInitialSize: 128 // 减少初始缓冲
    });

    flvPlayer.attachMediaElement(videoPlayer.value);
    flvPlayer.load();

    try {
      flvPlayer.play();
    } catch (err) {
      console.error('播放错误:', err);
    }
  }

  // 接收二进制数据并喂入flv.js
  socketStore.on('video-chunk', (data) => {
    if (flvPlayer) {
      const uint8Array = new Uint8Array(data);
      flvPlayer._mediaDataSource.data = uint8Array;
      flvPlayer._dispatchChunk(uint8Array);
    }
  });
});

// 清理资源
onBeforeUnmount(() => {
  if (flvPlayer) {
    flvPlayer.pause();
    flvPlayer.unload();
    flvPlayer.destroy();
  }
});
</script>

<!-- 前端部分 (Vue3组件) -->
<template>
  <div>
    <video ref="videoPlayer" controls autoplay style="width: 100%"></video>
  </div>
</template>
