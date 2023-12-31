/*
 * @Descripttion: 
 * @version: 
 * @Author: lugfa
 * @Date: 2023-12-31 11:34:41
 * @LastEditors: lugfa
 * @LastEditTime: 2023-12-31 12:57:06
 * @FilePath: /study-react/src/views/RactApi/my-hook/UseLocalStorage copy.jsx
 */



import { useState, useEffect } from 'react';

// 获取横向，纵向滚动条位置
const getPosition = () => {
    return {
        x: document.body.scrollLeft,
        y: document.body.scrollTop,
    };
};
const useScroll = () => {
    // 定一个 position 这个 state 保存滚动条位置
    const [position, setPosition] = useState(getPosition());
    useEffect(() => {
        const handler = () => {
            setPosition(getPosition(document));
        };
        // 监听 scroll 事件，更新滚动条位置
        document.addEventListener("scroll", handler);
        return () => {
            // 组件销毁时，取消事件监听
            document.removeEventListener("scroll", handler);
        };
    }, []);
    return position;
};
export default useScroll;