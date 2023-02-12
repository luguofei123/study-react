import React, { memo, useMemo, useState, useEffect, useCallback } from "react";

let Child = memo(function (props) {
    useEffect(() => {
        console.log('子组件重新渲染')
    })

    return <>
        {/* <span>子组件{props.someSB}</span> */}
        <button onClick={props.changgeChild}>子组件按钮</button>
    </>
})

function Parent () {
    const [count, setCount] = useState(0)
    const [number, setNumber] = useState(1)
    const changeCount = () => {
        console.log('1111')
        setCount(pre => pre + 1)
    }
    const changeNumber = () => {
        setNumber(pre => pre + 1)
    }
    // useMemo是用来缓存计算属性的，它会在发现依赖未发生改变的情况下返回旧的计算属性值的地址。
    // useMemo绝不是用的越多越好，缓存这项技术本身也需要成本。
    // useMemo的使用场景之一是:只需要给拥有巨大计算量的计算属性缓存即可。
    // useMemo的另一个使用场景是：当有计算属性被传入子组件，并且子组件使用了react.memo进行了缓存的时候,为了避免子组件不必要的渲染时使用

    const someSB = useMemo(() => {
        console.log('我计算了一次')
        return number + 'wowowowowow'
    }, [number])
    // useCallback 的作用是防止子组件无关紧要的更新，只有changgeChild 发生变化的时候才更新 ，子组件要配合memo使用才会生效
    const changgeChild = useCallback(() => {
        console.log('fun')
    }, [])


    return <>
        <h2>count：{count}</h2>
        <Child changgeChild={changgeChild} someSB={someSB}></Child>
        <button onClick={changeCount}>父按钮改变count</button>
        <button onClick={changeNumber}>父按钮改变number</button>
        <h2>number：{number}</h2>
    </>

}

export default Parent
