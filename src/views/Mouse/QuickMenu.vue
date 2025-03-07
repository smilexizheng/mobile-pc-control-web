<script setup>
import {onMounted, ref} from 'vue';
import {useDebounceFn} from '@vueuse/core'
import VolumeControl from "@/views/Home/VolumeControl.vue";
import {useSocketStore} from '@/stores/socket'
import {useRouter} from 'vue-router'
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";
import {Key} from "@/enums/key.enum.js";
import EventModal from "@/components/ui/EventModal.vue";

const router = useRouter()

const socketStore = useSocketStore()

// 模拟应用数据
const apps = ref([
  {
    categoryName: "系统", modules: [
      {name: "关机", color: "#FF5722", events:[ {event: CE.SYS_SHUTDOWN}]},
      {name: "回桌面", color: "#4CAF50", events:[ {event: CE.KEYPRESS, eventData: {key: [Key.LeftWin,Key.D] }}]},
      {name: "复制", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: [Key.LeftControl, Key.C]}}]},
      {name: "粘贴", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: [Key.LeftControl, Key.V]}}]},
      {name: "撤回", color: "#FF5722", events:[ {event: CE.KEYPRESS, eventData: {key: [Key.LeftControl, Key.Z]}}]}
    ],
    showSysVolume: true
  },
  {
    categoryName: "快捷指令", modules: [
      {name: "ESC", color: "#FF5722", events:[ {event: CE.KEYPRESS, eventData: {key: Key.Escape}}]},
      {name: "刷新", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: [Key.F5]}}]},
      {name: "网页全屏", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: Key.F11}}]},
    ]
  },
  {
    categoryName: "自定义指令", modules: [
      {name: "ESC", color: "#FF5722", events:[ {event: CE.KEYPRESS, eventData: {key: Key.Escape}}]},
      {name: "刷新", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: [Key.F5]}}]},
      {name: "网页全屏", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: Key.F11}}]},
    ]
  },



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
<!--    <EventModal/>-->
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

  </div>
  <div v-else>加载中...</div>
</template>

<style scoped>
.ios-home-screen {
  user-select: none;
  overflow: auto;
  /* 移除点击高亮 */
  -webkit-tap-highlight-color: transparent;
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
  font-size: 14px;
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