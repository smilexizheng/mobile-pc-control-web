import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
    const currentChat = ref(null) // 当前聊天对象
    const messages = ref({}) // 所有消息
    const clients = ref([ // 联系人列表
        // { id: 1, name: 'PC主机', avatar: '', lastMessage: '', time: '12:30' },
        // { id: 2, name: '李四', avatar: '', lastMessage: '晚上一起吃饭', time: '昨天' },
        // { id: 3, name: '王五', avatar: '', lastMessage: '项目进展如何', time: '星期一' }
    ])

    // 设置当前聊天对象
    const setCurrentChat = (contact) => {
        currentChat.value = contact
        // 这里可以加载历史消息
    }

    // 发送消息
    const sendMessage = (content) => {
        const newMessage = {
            id: Date.now(),
            sender: 'me',
            content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        pushClientMsg(currentChat.value.id,newMessage)

        if (currentChat.value) {
            const contact = clients.value.find(c => c.id === currentChat.value.id)
            if (contact) {
                contact.lastMessage = content
                contact.time = '刚刚'
            }
        }
    }

    const addMessage = (data) => {
        const newMessage = {
            id: Date.now(),
            sender: 'received',
            content:data.content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        pushClientMsg(data.form,newMessage)

    }

    const pushClientMsg = (id,data)=>{
        if(!messages.value[id]){
            messages.value[id]=[]
        }
        messages.value[id].push(data);

    }

    return { currentChat, messages, clients, setCurrentChat, addMessage,sendMessage }
})