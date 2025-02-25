<script setup>


import {onMounted} from "vue";
import {setHeight} from "@/utils/common.js";

onMounted(() => {
  setHeight()
})

</script>

<template>
  <RouterView/>
</template>

<style scoped>

</style>