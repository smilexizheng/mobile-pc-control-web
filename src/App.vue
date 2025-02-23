<script setup>
import {ref} from 'vue';

// 模拟应用数据
const apps = ref([

  {
    type: "测试分类", btn: [{name: "组合键", color: "#4CAF50", keyboard: "l", modifier: "control+alt"},
      {name: "复制", color: "#2196F3", keyboard: "c", modifier: "control"},
      {name: "粘贴", color: "#2196F3", keyboard: "v", modifier: "control"},
      {name: "键入", color: "#FF5722",keyboard:"v",modifier: ""}
    ]
  },

  {
    type: "系统操作", btn: [{name: "音量+", color: "#4CAF50"},
      {name: "音量-", color: "#2196F3"},
      {name: "静音", color: "#2196F3"},
      {name: "关机", color: "#FF5722"}]
  },

  {
    type: "QQ音乐", btn: [{name: "上一首", color: "#4CAF50"},
      {name: "下一首", color: "#2196F3"},
      {name: "播放/暂停", color: "#FF5722"},
      {name: "歌词显隐", color: "#2196F3"},
    ]
  },


  {
    type: "网页操作", btn: [
      {name: "腾讯视频", color: "#2196F3"},
      {name: "腾讯全屏", color: "#4CAF50"},
      {name: "播放/暂停", color: "#2196F3"},

      {name: "退出全屏", color: "#FF5722"}]
  },
  {
    type: "B站", btn: [{name: "B站全屏切换", color: "#9C27B0"},
      {name: "B站全屏", color: "#9C27B0"},
      {name: "B站全屏", color: "#9C27B0"},
      {name: "B站全屏", color: "#9C27B0"},
      {name: "B站全屏", color: "#9C27B0"},]
  }

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
 * @param app
 */
const clickEvent = (app) => {
  if (app.keyboard) {
    keyboard(`/keypress?key=${app.keyboard}&modifier=${app.modifier}`);

  } else {
    switch (app.name) {
      case '组合键':
        keyboard("/keypress?key=l&modifier=control+alt");
        break;
      case '腾讯全屏':
        keyboard("/tx");
        break;
      case '退出全屏':
        keyboard("/keypress?key=escape")
        break;
      case '播放/暂停':
        keyboard("/keypress?key=space")
        break;
      default:
        break;
    }
  }
}

const keyboard = (params) => {
  fetch(`http://192.168.1.24:3000${params}`).then(response => {
    return response.json();
  }).then(data => {
    if (data.success) {

    }
  }).catch(error => {
    console.log(error)
  });
}
</script>

<template>
  <div class="ios-home-screen">
    <div class="app-area" v-for="(m,index) in apps" :key="'a'+index">
      <div class="area-title">{{ m.type }}</div>
      <div class="app-grid">
        <div
            v-for="(btn, index) in m.btn"
            :key="index"
            class="app-icon"
            @touchstart="handleTouchStart"
            @touchend="handleTouchEnd"
            @click="clickEvent(btn)"
        >
          <!-- 钉钉风格图标 -->
          <div
              class="dingtalk-icon"
              :style="{ backgroundColor: btn.color }"
          >
            {{ btn.name.charAt(0) }}
          </div>
          <div class="app-label">{{ btn.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ios-home-screen {
  min-height: 100vh;
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