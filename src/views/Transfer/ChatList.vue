<script setup>
import { useChatStore } from '@/stores/chatStore'
import {useRouter} from "vue-router";
const router = useRouter()
const { contacts, setCurrentChat } = useChatStore()

const selectContact = (contact) => {
  setCurrentChat(contact)
  router.push("/chat")
}
</script>

<template>
    <nut-cell
        v-for="contact in contacts"
        size="large"
        :key="contact.id"
        :title="contact.name"
        @click="selectContact(contact)"
    >

<!--      <template #icon>-->
<!--        <nut-avatar size="large"></nut-avatar>-->
<!--      </template>-->
<!--      <template #title>-->
<!--        <span>{{ contact.name }}</span>-->
<!--      </template>-->
<!--      <template #desc>-->
<!--        <div class="contact-desc">-->
<!--          <span>{{ contact.lastMessage }}</span>-->
<!--          <span class="time">{{ contact.time }}</span>-->
<!--        </div>-->
<!--      </template>-->
    </nut-cell>
</template>



<style scoped>
.contact-desc {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.time {
  color: #999;
  font-size: 12px;
}
</style>