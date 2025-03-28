<script setup>
import {onMounted, ref} from 'vue';
import {useDebounceFn} from '@vueuse/core'
import VolumeControl from "@/views/Home/VolumeControl.vue";
import {useSocketStore} from '@/stores/socket'
import {useRouter} from 'vue-router'
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";
import {Key} from "@/enums/key.enum.js";
import EventModal from "@/components/event/EventModal.vue";
import {LocalEventStore} from "@/stores/localEventStore.js";


const localEventStore = LocalEventStore()

const router = useRouter()

const socketStore = useSocketStore()

// 模拟应用数据
const apps = ref([
  {
    categoryName: "系统", modules: [
      {name: "回桌面", color: "#4CAF50", events:[ {event: CE.KEYPRESS, eventData: {key: [Key.LeftWin,Key.D] }}]},
      {name: "复制", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: [Key.LeftControl, Key.C]}}]},
      {name: "粘贴", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: [Key.LeftControl, Key.V]}}]},
      {name: "撤回", color: "#FF5722", events:[ {event: CE.KEYPRESS, eventData: {key: [Key.LeftControl, Key.Z]}}]}
    ],
    showSysVolume: true
  },
  {
    categoryName: "放大镜", modules: [
      {name: "开启", color: "#4CAF50", events:[ {event: CE.KEYPRESS, eventData: {key: [Key.LeftWin,Key.Add] }}]},
      {name: "关闭", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: [Key.LeftWin, Key.Escape]}}]},
      {name: "放大", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: [Key.LeftWin,Key.Add] }}]},
      {name: "缩小", color: "#FF5722", events:[ {event: CE.KEYPRESS, eventData: {key: [Key.LeftWin,Key.Subtract] }}]}
    ],
  }

]);

// 触控反馈效果
const handleTouchStart = (e) => {
  e.currentTarget.style.transform = 'scale(0.9)';
};

const handleTouchEnd = (e) => {
  e.currentTarget.style.transform = 'scale(1)';
};



</script>

<template>
  <div class="ios-home-screen" v-if="socketStore.isConnected">

    <div class="app-area" v-for="(m,index) in apps" :key="'a'+index">
      <div class="area-title">{{ m.categoryName }}</div>
      <div class="app-grid">
        <div
            v-for="(module, index) in m.modules"
            :key="index"
            class="app-icon"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
            @click="socketStore.eventHandler(module)"
        >

          <div
              class="dingtalk-icon"
              :style="{ backgroundColor: module.color }"
          >
            {{ module.name }}
          </div>
        </div>
      </div>
      <VolumeControl v-if="m.showSysVolume"/>
    </div>


    <div class="app-area">
      <div class="area-title">自定义功能</div>
      <div class="app-grid">
        <div
            v-for="(module, index) in localEventStore.customEvents"
            :key="index"
            class="app-icon"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
            @click="socketStore.eventHandler(module)"
        >

          <div
              class="dingtalk-icon"
              :style="{ backgroundColor: module.color }"
          >
            {{ module.name }}
          </div>

        </div>
      </div>
    </div>

  </div>
  <div v-else>加载中...</div>
</template>

<style scoped>
.ios-home-screen {
  user-select: none;
  overflow: auto;
  /* 移除点击高亮 */
  -webkit-tap-highlight-color: transparent;
  touch-action: auto;
}

.app-area {
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 8px;
}

.area-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
  color: #59fd06;
}

.app-grid {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
}


.app-icon {
  margin-bottom: 2px;
  flex: 0 0 calc(20%); /* 4列布局计算（25%宽度 - 间距补偿） */
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.dingtalk-icon {
  width: 54px;
  height: 54px;
  border-radius: 10px;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s,
  box-shadow 0.2s;
}

.app-icon:active .dingtalk-icon {
  transform: scale(0.92);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}


</style>