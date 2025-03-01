<script setup>
import {onMounted, ref} from 'vue';
import {useDebounceFn} from '@vueuse/core'
import VolumeControl from "@/views/Home/VolumeControl.vue";
import {useSocketStore} from '@/stores/socket'
import {useRouter} from 'vue-router'
import {CLIENT_EMIT_EVENTS as CE} from "@/constant/client-emit.js";
import {Key} from "@/enums/key.enum.js";

const router = useRouter()

const socketStore = useSocketStore()

// 模拟应用数据
const apps = ref([
  {
    categoryName: "系统操作", modules: [
      {name: "桌面", color: "#4CAF50", events:[ {event: CE.KEYPRESS, eventData: {key: Key.D, modifier: [Key.LeftWin]}}]},
      {name: "复制", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: "c", modifier: "control"}}]},
      {name: "粘贴", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: "v", modifier: "control"}}]},
      {name: "撤回", color: "#FF5722", events:[ {event: CE.KEYPRESS, eventData: {key: "z", modifier: "control"}}]},
      {name: "关机", color: "#FF5722", events:[ {event: CE.SYS_SHUTDOWN}]}],
    showSysVolume: true
  },
  {
    categoryName: "网页", modules: [
      {name: "腾讯视频", color: "#2196F3", events:[ {event: CE.OPEN_URL, eventData: {url: "https://v.qq.com/"}}]},
      {name: "视频全屏", color: "#2196F3", events:[
          {event: CE.SYS_POINTER_MOVE, eventData: {x: 1230, y: 850}},
          {event: CE.SYS_POINTER_MOVE, eventData: {x: 1438, y: 966},delay:10},
          {event: CE.SYS_MOUSE_CLICK, eventData: {button: 0, double: false},delay:20}
        ]},
      {name: "刷新", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: "f5"}}]},
      {name: "网页全屏", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: "f11"}}]},
      {name: "ESC", color: "#FF5722", events:[ {event: CE.KEYPRESS, eventData: {key: "escape"}}]}
    ]
  },

  {
    categoryName: "QQ音乐", modules: [
      {name: "上一首", color: "#4CAF50", events:[ {event: CE.KEYPRESS, eventData: {key: "left", modifier: "control+alt"}}]},
      {name: "下一首", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: "right", modifier: "control+alt"}}]},
      {name: "播放/暂停", color: "#FF5722", events:[ {event: CE.KEYPRESS, eventData: {key: "f5", modifier: "control+alt"}}]},
      {name: "+音量", color: "#4CAF50", events:[ {event: CE.KEYPRESS, eventData: {key: "up", modifier: "control+alt"}}]},
      {name: "-音量", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: "down", modifier: "control+alt"}}]},
      {name: "歌词显隐", color: "#2196F3", events:[ {event: CE.KEYPRESS, eventData: {key: "w", modifier: "control+alt"}}]},
    ]
  }, {
    categoryName: "应用", modules: [
      {name: "鼠标", color: "#4CAF50", action: "router", toLink: "/mouse"},
      {name: "桌面", color: "#4CAF50", action: "router", toLink: "/screen-live"},
      {name: "B站", color: "#4CAF50", events:[ {event: CE.OPEN_URL, eventData: {url: "https://www.bilibili.com/"}}]},
      {name: "Postman", color: "#4CAF50", events:[ {event: CE.OPEN_APP, eventData: {name: "Postman"}}]},
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


/**
 *
 * control  shift   alt
 * @param item
 */
const onClick = useDebounceFn((item) => {
  if (item.events) {
    // socket事件
    item.events.forEach(event => {
    setTimeout(()=>{
      socketStore.emit(event.event, event.eventData);
    },event.delay || 0)
    })
  } else if (item.action) {
    // 其他动作
    switch (item.action) {
      case'router':
        router.push(item.toLink)
        break;
      default:
        break;
    }
  } else {
    switch (item.name) {
      case 'A':
        socketStore.keypress({key: 'a', modifier: ''});
        break;
      case '播放/暂停':
        socketStore.keypress({key: 'space', modifier: ''});
        break;
      default:
        break;
    }
  }
}, 300)


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
            @click="onClick(module)"
        >
          <!-- 钉钉风格图标 -->
          <div
              class="dingtalk-icon"
              :style="{ backgroundColor: module.color }"
          >
            {{ module.name.charAt(0) }}
          </div>
          <div class="app-label">{{ module.name }}</div>
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
  background: #fff;
  border-radius: 10px;
  padding: 5px;
  margin-bottom: 8px;
}

.area-title {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
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
  width: 64px;
  height: 64px;
  border-radius: 16px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s,
  box-shadow 0.2s;
}

.app-icon:active .dingtalk-icon {
  transform: scale(0.92);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.app-label {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 13px;
  color: #333;
  text-align: center;
  line-height: 1.4;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}


/* 响应式调整 */
@media (max-width: 375px) {
  .dingtalk-icon {
    width: 56px;
    height: 56px;
    font-size: 20px;
  }

}

@media (min-width: 768px) {
  .dingtalk-icon {
    width: 72px;
    height: 72px;
    font-size: 28px;
  }
}


</style>