
<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue';
import flvjs from 'flv.js';
import {useSocketStore} from "@/stores/socket.js";
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";
import SocketIoLoader from "@/views/ScreenLive/socket-io-loader.js";

const socketStore = useSocketStore()
const videoPlayer = ref(null);
let flvPlayer = null;


// 创建自定义加载器函数
function createSocketIOLoader(socket) {
  return function (config) {
    let isDestroyed = false;
    const controller = new AbortController();

    return {
      abort: () => {
        isDestroyed = true;
        controller.abort();
        socket.off('flv_data'); // 移除监听
      },

      open: async function (response) {
        // 向服务器请求开始流传输
        // socket.emit('start_stream');
        // 监听二进制数据事件
          socket.on('flv_data', (data) => {
          if (isDestroyed) return;

          // 将数据转换为Uint8Array
          const uint8data = new Uint8Array(data);

          // 将数据传递给flv.js解析器
          // byteStart参数需要根据实际情况计算
          response.onData(uint8data, 0);
        });

        // 错误处理
        socket.on('error', (err) => {
          response.onError(new Error('Socket error: ' + err));
        });
      }
    };
  };
}


onMounted(() => {

  // 初始化FLV播放器
  if (flvjs.isSupported()) {
    // 注册自定义 loader

    flvPlayer = flvjs.createPlayer({
      type: 'flv',
      isLive: true,
      hasAudio: false, // 根据实际需要调整
      url: {socket:socketStore,roomName: 'screenlive'} // 伪URL，实际通过websocket传输

    }, {
      // 对于直播，关掉 stashBuffer 或调小缓存
      enableStashBuffer: false,
      // 或者 stashInitialSize: 128 (默认 384KB 可能略大)
      lazyLoad: false,
      autoCleanupSourceBuffer: true,
      debug: true,

      enableWorker: false, // 关闭分线程防止跨域问题
      stashInitialSize: 128, // 减少初始缓冲
      // 指定我们的自定义 loader
      customLoader: SocketIoLoader,
    });

    flvPlayer.attachMediaElement(videoPlayer.value);
    flvPlayer.load();

    try {
      flvPlayer.play();
    } catch (err) {
      console.error('播放错误:', err);
    }
  }


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
