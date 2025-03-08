<script setup>
import {ref} from 'vue';
import EventModal from "@/components/event/EventModal.vue";
import {LocalEventStore} from "@/stores/localEventStore.js";
import Modal from "@/components/ui/Modal.vue";
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";
import {n} from "../../../dist/assets/index-3xRjjA86.js";


const localEventStore = LocalEventStore()
const eventModalOpen = ref(false)
const editIndex = ref(null)
const editEvent = ref({
  name: '控制键鼠', color: '#44e5b8', events: [
    {
      event: CE.SYS_POINTER_MOVE,
      eventData: {x: 0, y: 0},
      delay: 0
    }
  ]
})

const handleEdit = (index) => {
  console.log('编辑项目:', index);
  editEvent.value = localEventStore.customEvents[index]
  editIndex.value = index
  eventModalOpen.value = true
};

const handleDelete = (index) => {
  if (confirm('确定要删除这个项目吗？')) {
    localEventStore.customEvents.splice(index, 1)
  }
};

const handleAdd = () => {
  eventModalOpen.value=false;
  if(editIndex.value!== null){
    localEventStore.customEvents[editIndex.value] = editEvent.value
    editIndex.value = null
  }else {
    localEventStore.customEvents.push(editEvent.value)
  }
}
</script>

<template>
  <button class="ios-button" @click="eventModalOpen = true">添加事件</button>
  <Modal v-model="eventModalOpen" title="自定义操作">
    <EventModal :event="editEvent" :ok="handleAdd"/>
  </Modal>
  <div class="mobile-list">
    <div
        v-for="(item, index) in localEventStore.customEvents"
        :key="index"
        class="list-item"
    >
      <div class="item-content" v-if="item">
        <div class="color-block" :style="{ backgroundColor: item.color }"></div>
        <div class="item-info">
          <h3>{{ item.name }}</h3>
          <p>{{ item.events.length }} 个事件</p>
        </div>
      </div>
      <div class="item-actions">
        <button class="btn edit" @click="handleEdit(index)">编辑</button>
        <button class="btn delete" @click="handleDelete(index)">删除</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.mobile-list {
  padding: 12px;
}

.list-item {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-content {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.color-block {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-right: 12px;
}

.item-info h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.item-info p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #666;
}

.item-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.edit {
  background-color: #409eff;
  color: white;
}

.delete {
  background-color: #f56c6c;
  color: white;
}

/* 按钮样式 */
.ios-button {
  display: block;
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  text-align: center;
  transition: all 0.2s;
  margin: 8px 0;
}
</style>
