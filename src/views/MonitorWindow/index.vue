<script setup>
import {onUnmounted, onMounted, ref} from 'vue';
import {useSocketStore} from "@/stores/socket.js";
import Modal from "@/components/ui/Modal.vue";
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";

const socketStore = useSocketStore()
const showModal = ref(false)
const windowImgUrl = ref(null)

const appWindow = ref([])


onMounted(() => {
  socketStore.emit(CE.WINDOW_LIST)
  socketStore.on(CE.WINDOW_LIST, (data) => {
    appWindow.value = data
  })
  socketStore.on(CE.WINDOW_IMG, (data) => {
    const blob = new Blob([data]);
    windowImgUrl.value = URL.createObjectURL(blob);
    showModal.value = true
  })

});

onUnmounted(() => {
  socketStore.off(CE.WINDOW_LIST)
  socketStore.off(CE.WINDOW_IMG)
})


</script>

<!-- 前端部分 (Vue3组件) -->
<template>
  <div v-for="item in appWindow" :key="item.id" v-show="!item.isMinimized"
       @click="!item.isMinimized &&socketStore.emit(CE.WINDOW_IMG,item.id)">
    {{ item.title }}
  </div>
  <Modal v-model="showModal" title="查看窗口" max-height="60vh">
    <img :src="windowImgUrl" alt="预览图片" style="width: 100%;">
  </Modal>
</template>
