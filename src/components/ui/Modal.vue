
<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '默认标题'
  },
  width: {
    type: [String, Number],
    default: '90%'
  },

})

const emit = defineEmits(['update:modelValue'])

const handleClose = () => {
  emit('update:modelValue', false)
}
</script>


<template>
  <transition name="modal">
    <div v-if="modelValue" class="modal-overlay"  @click.self="handleClose">
      <div
          class="modal"
          :style="{ width: typeof width === 'number' ? `${width}px` : width }">
        <!-- 头部 -->
        <div class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="close-button" @click="handleClose">&times;</button>
        </div>

        <!-- 内容插槽 -->
        <div class="scroll-content">
          <slot></slot>
        </div>

        <!-- 底部操作插槽（可选） -->
        <div class="modal-actions" v-if="$slots.actions">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>


<style scoped>
/* 保持原有样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  width: 90%;
  max-width: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 10px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  color: #86868b;
  padding: 8px;
}

.scroll-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
  margin: 12px 0;
}

.modal-actions {
  position: sticky;
  bottom: 0;
  background: white;
  padding-top: 12px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
}

/* 其他原有样式保持不变... */
</style>