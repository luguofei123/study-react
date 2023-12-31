/*
 * @Descripttion: 
 * @version: 
 * @Author: lugfa
 * @Date: 2023-12-31 11:34:41
 * @LastEditors: lugfa
 * @LastEditTime: 2023-12-31 11:35:12
 * @FilePath: /study-react/src/views/RactApi/my-hook/test.jsx
 */
import React, { useState, useEffect, useMemo, useId } from "react";


// 自定义通信Hooks
const useCommunication = () => {
    const [message, setMessage] = useState('');

    // 发送消息的函数
    const sendMessage = (msg) => {
        debugger
        setMessage(msg);
    };

    return { message, sendMessage };
};
export default useCommunication