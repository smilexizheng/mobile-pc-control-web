import {useWindowSize} from "@vueuse/core";

const setHeight = () => {
    const { width, height } = useWindowSize()
    function setRealViewportHeight() {
        const vh = height.value * 0.01
        document.documentElement.style.setProperty('--vh', `${vh}px`)
    }
// 初始化设置
    setRealViewportHeight()
// 监听窗口变化
    window.addEventListener('resize', setRealViewportHeight)
    // window.addEventListener('orientationchange', setRealViewportHeight)
}

const posThreshold = (x,y,threshold) => {
       return Math.abs(x) > threshold || Math.abs(y) > threshold
}

export {setHeight,posThreshold}
