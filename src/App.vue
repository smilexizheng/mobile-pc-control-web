<script setup>


import {onMounted,ref} from "vue";
import {setHeight} from "@/utils/common.js";
import {useEventListener} from "@vueuse/core";
import {useKeyBoardStore} from "@/stores/keyboardStore.js";
import {useSocketStore} from '@/stores/socket'
import {useRouter} from 'vue-router'
import {useAppStore} from "@/stores/appStore.js";
import Modal from "@/components/ui/Modal.vue";

const socketStore = useSocketStore()
const keyBoard = useKeyBoardStore()
const appStore = useAppStore()
const router = useRouter()

const inputToken = ref('')


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
  <div v-else>
    <Modal v-model="socketStore.tokenExpire" :title="`令牌无效`"  :max-height="`60px`">
      <nut-input v-model="inputToken" placeholder="请输入令牌" />
      <nut-button  block  type="primary" @click="socketStore.setToken(inputToken)">确认</nut-button>
    </Modal>
    <img src="@/assets/images/network.png" style="width: 100%;"/>
  </div>
</template>

<style scoped>

</style>