<template>
  <div class="chat-window" v-if="currentChat">

    <div class="message-list" ref="messageList">
      <div
          v-for="message in messages"
          :key="message.id"
          :class="['message', message.sender === 'me' ? 'sent' : 'received']"
      >
        <div class="message-content">
          {{ message.content }}
        </div>
        <div class="message-time">
          {{ message.time }}
        </div>
      </div>
    </div>

    <div class="input-area">
      <nut-input
          v-model="inputMessage"
          placeholder="输入消息..."
          @keyup.enter="send"
      />
      <nut-button type="primary" @click="send">发送</nut-button>
    </div>
  </div>
</template>

<script setup>
import {ref, watch, nextTick, computed, onMounted} from 'vue'
import { useChatStore } from '@/stores/chatStore'
import {useAppStore} from "@/stores/appStore.js";
import {useSocketStore} from "@/stores/socket.js";
const appStore = useAppStore()
const { currentChat, messages, setCurrentChat,sendMessage,contacts } = useChatStore()
const inputMessage = ref('')
const messageList = ref(null)
const socketStore = useSocketStore()


const send = () => {
  if (inputMessage.value.trim()) {
    sendMessage(inputMessage.value)
    socketStore.emit('web-socket-msg',inputMessage.value)
    inputMessage.value = ''
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight
    }
  })
}

const backToList = () => {
  currentChat.value = null
}
</script>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-list {
  height: calc(100% - 120px);
  padding: 10px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

.message {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

.message-content {
  max-width: 70%;
  padding: 10px;
  border-radius: 5px;
  word-wrap: break-word;
}

.sent .message-content {
  align-self: flex-end;
  background-color: #95ec69;
}

.received .message-content {
  align-self: flex-start;
  background-color: white;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.sent .message-time {
  align-self: flex-end;
}

.received .message-time {
  align-self: flex-start;
}

.input-area {
  display: flex;
  padding: 10px;
  background-color: white;
  border-top: 1px solid #eee;
}

.input-area .nut-input {
  flex: 1;
  margin-right: 10px;
}
</style>