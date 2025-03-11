<script setup>
import {onMounted, ref} from 'vue';
import {useSocketStore} from '@/stores/socket'
import {useThrottleFn} from '@vueuse/core';

const socketStore = useSocketStore();

const props = defineProps(['isPaused'])


const showScreenRef = ref(null);
const screenMainStyle = ref({})
let ctx;



/**
 * 防止频繁更新导致肉眼模糊
 */
const updateScreenImg =
    // useThrottleFn(
    (data) => {
  if(props.isPaused) return;
  const blob = new Blob([data.image]);
  createImageBitmap(blob).then((img) => {
    showScreenRef.value.width = img.width;
    showScreenRef.value.height = img.height;
    ctx.clearRect(0, 0, img.width, img.height);
    ctx.drawImage(img, 0, 0);
  });
  // showScreenRef.value = URL.createObjectURL(blob);

  screenMainStyle.value={
    width: `${data.width}px`,
    height: `${data.height}px`,
    left: `${data.left}px`,
    right: `${data.right}px`,
    top: `${data.top}px`,
    bottom: `${data.bottom}px`,
  }

}
// , 16,true)


onMounted(() => {
  ctx = showScreenRef.value.getContext('2d');
  socketStore.on('screen-data', (data) => {
    updateScreenImg(data);
  });
});




</script>

<template>
  <div class="screen-bg" :style='{width: screenMainStyle.width,height: screenMainStyle.height}'>
  <div class="screen-show"  :style="screenMainStyle">
    <canvas ref="showScreenRef"></canvas>
<!--    <img alt="screen" :src="showScreenRef" class="screen-img"/>-->

  </div>
  </div>
</template>

<style scoped lang="less">

.screen-bg{
  background-color: rgb(0, 0, 0);
  position: absolute;
  width: 373px;
  height: 639px;
  overflow: hidden;
  border-radius: 10px;
}

.screen-show {
  position: absolute;
  z-index: 1;
  overflow: hidden;


  * {
    user-select: none;
    touch-action: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
}


.screen-img {
  width: 100%;
}



</style>
