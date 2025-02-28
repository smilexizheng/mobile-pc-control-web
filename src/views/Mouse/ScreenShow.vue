<script setup>
import {onMounted, ref} from 'vue';
import {useSocketStore} from '@/stores/socket'
import {useThrottleFn} from '@vueuse/core';

const socketStore = useSocketStore();

const screenImg = ref(null);
// const imgStyle = ref({
//   imageRendering: 'pixelated' // 低分辨率优化显示
// });

/**
 * 防止频繁更新导致肉眼模糊
 */
const updateScreenImg = useThrottleFn((data) => {
  const blob = new Blob([data.image]);
  screenImg.value = URL.createObjectURL(blob);
}, 16,true)


onMounted(() => {
  socketStore.on('screen-data', (data) => {
    updateScreenImg(data);
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
    <img :src="screenImg" class="screen-img"/>
  </div>
</template>

<style scoped lang="less">
.screen-show {
  position: absolute;
  z-index: 1;
  top: 10px;
  right: 10px;
  left: 10px;
  bottom: 10px;
  overflow: hidden;


  * {
    user-select: none;
    touch-action: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
}


.screen-img {
  border-radius: 10px;
  width: 100%;
}

</style>
