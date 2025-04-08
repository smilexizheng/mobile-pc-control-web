<script setup>


import {onMounted} from "vue";
import {setHeight} from "@/utils/common.js";
import {useEventListener} from "@vueuse/core";
import {useKeyBoardStore} from "@/stores/keyboardStore.js";
import {useSocketStore} from '@/stores/socket'
import {useRouter} from 'vue-router'
import {useAppStore} from "@/stores/appStore.js";

const socketStore = useSocketStore()
const keyBoard = useKeyBoardStore()
const appStore = useAppStore()
const router = useRouter()
onMounted(() => {
  socketStore.connect()
  setHeight()

  useEventListener(document, ['mouseup', 'touchend', 'dragend'], () => {
    keyBoard.clearKeyEvent()
  })
})

const back = () => {
  router.back()
}


</script>

<template>
  <nut-sticky v-if="appStore.navBarVisible">
    <nut-navbar :title="appStore.title" :left-show="appStore.backVisible" @click-back="back"></nut-navbar>
  </nut-sticky>
  <RouterView v-if="socketStore.isConnected"/>
  <img v-else src="@/assets/images/network.png" style="width: 100%;"/>
</template>

<style scoped>

</style>