<script setup>
import {ref, onMounted} from 'vue';
import {useSocketStore} from '@/stores/socket'

const socketStore = useSocketStore();

import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";

const screenImg = ref(null);
// const imgStyle = ref({
//   imageRendering: 'pixelated' // 低分辨率优化显示
// });

onMounted(() => {
  socketStore.emit(CE.JOIN_ROOM, 'screen');
  socketStore.on('screen-data', (data) => {
    console.log(12)
    const blob = new Blob([data.image]);
    screenImg.value = URL.createObjectURL(blob);
    // screenImg.value = `data:image/jpeg;base64,${data.image}`;
    // imgStyle.value = {
    //   width: `${data.width * 2}px`,  // 前端显示放大
    //   height: `${data.height * 2}px`,
    //   imageRendering: 'crisp-edges'
    // };
  });
});
</script>

<template>
  <div class="screen-show" v-if="screenImg">
    <img src="@/assets/icons/pointer.svg" class="pointer"/>
    <img :src="screenImg" class="screen-img"/>
  </div>
</template>

<style scoped>
.screen-show {
  position: relative;
}

.pointer {
  width: 30px;
  position: absolute;
  top: 49%;
  left: 49%;
}

.screen-img {
  width: 100%;
}

</style>
