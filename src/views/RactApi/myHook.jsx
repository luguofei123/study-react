/*
 * @Descripttion: 
 * @version: 
 * @Author: lugfa
 * @Date: 2023-12-29 13:34:26
 * @LastEditors: lugfa
 * @LastEditTime: 2023-12-29 13:39:43
 * @FilePath: /study-react/src/views/RactApi/myHook.jsx
 */
import { useState, useEffect } from 'react'

function useCustomHook () {
    const [count, setCount] = useState(0)

    useEffect(() => {
        document.title = `Count: ${count}`
    }, [count]);

    const increment = () => {
        setCount(prevCount => prevCount + 1)
    };

    return [count, increment]
}

export default useCustomHook