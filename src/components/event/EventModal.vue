<script setup>
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";


const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  ok:{
    type:Function,
    required:true,
  }
})

const addEvent = () => {
  props.event.events.push({
    event: CE.SYS_POINTER_MOVE,
    eventData: {x: 0, y: 0},
    delay: 0
  })
}

const removeEvent = (index) => {
  props.event.events.splice(index, 1)
}

const submitEvents = () => {
  // 提交事件处理逻辑
  console.log('提交的事件数据:', props.event)
  props.ok()
}


</script>
<template>


  <!-- 可滚动内容区域 -->
  <!--    <div class="scroll-content">-->
  <div class="event-list">
    <!-- 事件名称和颜色 -->
    <div class="form-group">
      <label class="input-label">事件名称</label>
      <input
          v-model="event.name"
          type="text"
          placeholder="输入事件名称"
          class="ios-input"
      >
    </div>

    <div class="form-group">
      <label class="input-label">选择颜色</label>
      <div class="color-picker">
        <input
            v-model="event.color"
            type="color"
            class="color-input"
        >
        <span class="color-value">{{ event.color }}</span>
      </div>
    </div>

    <div class="event-list">
      <div v-for="(event, index) in event.events" :key="index" class="event-item">
        <div class="form-group">
          <label class="input-label">事件类型</label>
          <select
              v-model="event.event"
              class="ios-select"
          >
            <option :value="CE.SYS_POINTER_MOVE">指针移动</option>
            <option :value="CE.SYS_MOUSE_CLICK">鼠标点击</option>
            <option :value="CE.KEYPRESS">键盘事件</option>
          </select>
        </div>

        <div v-if="event.event === CE.KEYPRESS" class="form-group">
          <label class="input-label">快捷键</label>
          <div class="input-row">
            <input
                type="number"
                v-model="event.eventData.key"
                placeholder="X坐标"
                class="ios-input"
            >
          </div>
        </div>

        <div v-if="event.event === CE.SYS_POINTER_MOVE" class="form-group">
          <label class="input-label">坐标设置</label>
          <div class="input-row">
            <input
                type="number"
                v-model="event.eventData.x"
                placeholder="X坐标"
                class="ios-input"
            >
            <input
                type="number"
                v-model="event.eventData.y"
                placeholder="Y坐标"
                class="ios-input"
            >
          </div>
        </div>

        <div v-if="event.event === CE.SYS_MOUSE_CLICK" class="form-group">
          <label class="input-label">点击设置</label>
          <div class="input-row">
            <select
                v-model="event.eventData.button"
                class="ios-select"
            >
              <option :value="0">左键</option>
              <option :value="1">中键</option>
              <option :value="2">右键</option>
            </select>

          </div>
          <div class="input-row">
            <label class="checkbox-label">
              <input
                  type="checkbox"
                  v-model="event.eventData.double"
                  class="ios-checkbox"
              > 双击
            </label>
          </div>
        </div>

        <div class="form-group">
          <label class="input-label">延迟时间（ms）</label>
          <input
              type="number"
              v-model="event.delay"
              min="0"
              class="ios-input"
          >
        </div>

        <button
            class="ios-button danger"
            @click="removeEvent(index)"
        >
          删除事件
        </button>
      </div>
    </div>


  </div>

  <button class="ios-button secondary" @click="addEvent">
    新增事件
  </button>
  <button class="ios-button primary" @click="submitEvents">
    完成配置（共{{ event.events.length }}项）
  </button>


</template>


<style scoped>

/* 颜色选择器样式 */
.color-picker {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-input {
  width: 30px;
  height: 30px;
  border: 2px solid #ddd;
  border-radius: 5px;
  padding: 2px;
}

.color-value {
  font-size: 16px;
  color: #666;
}


/* 表单元素样式 */
.form-group {
  margin-bottom: 16px;
}

.input-label {
  display: block;
  font-size: 16px;
  color: #86868b;
  margin-bottom: 8px;
}

.input-row {
  display: flex;
  gap: 8px;
}

.ios-input, .ios-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #d2d2d7;
  border-radius: 8px;
  font-size: 16px;
  -webkit-appearance: none;
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

.primary {
  background: #007AFF;
  color: white;
}

.secondary {
  background: #e5e5ea;
  color: #000;
}

.danger {
  background: #ff3b30;
  color: white;
}

/* 复选框样式 */
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
}

.ios-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #007AFF;
  border-radius: 4px;
}


.event-item {
  padding: 16px;
  background: #f5f5f7;
  border-radius: 8px;
  margin-bottom: 12px;
}


</style>