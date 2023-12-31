/*
 * @Descripttion: 
 * @version: 
 * @Author: lugfa
 * @Date: 2023-12-31 11:34:41
 * @LastEditors: lugfa
 * @LastEditTime: 2023-12-31 12:31:36
 * @FilePath: /study-react/src/views/RactApi/my-hook/UseLocalStorage.jsx
 */



import { useState, useEffect } from 'react';
function useLocalStorage (key) {
    const [data, setData] = useState(() => {
        return JSON.parse(window.localStorage.getItem(key))
    });
    debugger

    useEffect(() => {
        debugger
        window.localStorage.setItem(key, JSON.stringify(data));
    }, [data]);

    return [data, setData];
}

export default useLocalStorage;