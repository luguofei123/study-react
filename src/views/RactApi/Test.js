/*
 * @Descripttion: 
 * @version: 
 * @Author: lugfa
 * @Date: 2023-08-15 19:32:14
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-18 15:43:34
 * @FilePath: /study-react/src/views/RactApi/test.js
 */
import React, { useState, useEffect, useMemo, useId } from "react";
import { Button } from 'antd';
export default function Test () {
    console.log('jjjjj')

    let [count, setCount] = useState(1)
    let [count1, setCount1] = useState(11)
    // let [countData, setcountData] = useState({ count: 1 })
    const changeObj = () => {
        // 这样不会发生变化，因为他们是用的一个引用，浅比较的时候认为是一样的
        // countData.count++
        // setcountData(countData)
        // 下面这样就会发生变化
        // let obj = { ...countData }
        // obj.count++

        // count = count + 1
        // setCount(count)

        setCount(v => v + 1)

    }


    return <><Button onClick={changeObj}>增加</Button>
        <br />
        <span>{count}</span>
        <br />
    </>
}