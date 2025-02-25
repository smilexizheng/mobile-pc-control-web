<script setup>


import {onMounted} from "vue";
import {setHeight} from "@/utils/common.js";
import {useEventListener} from "@vueuse/core";
import {useKeyBoardStore} from "@/stores/keyboardStore.js";
const keyBoard = useKeyBoardStore()
onMounted(() => {
  setHeight()

  useEventListener(document, ['mouseup', 'touchend', 'dragend'], () => {
    keyBoard.clearKeyEvent()
  })
})

</script>

<template>
  <RouterView/>
</template>

<style scoped>

</style>