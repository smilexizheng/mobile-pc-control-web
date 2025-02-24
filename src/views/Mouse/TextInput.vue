<script setup>
import {ref} from 'vue'
import {useSocketStore} from '@/stores/socket'

const inputMessage = ref('')
const textarea = ref(null)
const inputContainer = ref(null)


const socketStore = useSocketStore()


// 发送消息
const sendMessage = () => {
  window.scrollTo(0, 0)
  if (!inputMessage.value.trim()) return
  socketStore.emit("typing", inputMessage.value)
  inputMessage.value = ''
}


</script>


<template>

  <!-- 吸底输入框 -->
  <div class="input-container" ref="inputContainer">

      <!-- 文本输入区域 -->
      <textarea
          ref="textarea"
          v-model="inputMessage"
          class="input-text"
          style="height: 35px"
          placeholder="请输入内容"
          @focusout="sendMessage"
      ></textarea>

      <!-- 发送/语音按钮 -->
      <button class="send-btn" @click="sendMessage">
        发送
      </button>
  </div>
</template>

<style scoped>
.input-container {
  width: 100vw;
  position: fixed;
  bottom: 10px;
  padding: 8px 12px;
  overflow: hidden;
  display: flex;
}




.input-text {
  max-height: 120px;
  width: 70vw;
  margin-right: 10px;
  min-height: 35px;
  background: #e5e5e5;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 6px;
  font-size: 16px;
  overflow-y: auto;
}

.send-btn {
  background: #07c160;
  color: white;
  border: none;
  font-size: 14px;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s;
}

.send-btn:hover {
  background: #06ad54;
}


</style>