/*
 * @Descripttion: 
 * @version: 
 * @Author: lugfa
 * @Date: 2023-02-14 13:00:51
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-18 15:48:55
 * @FilePath: /study-react/src/views/RactApi/react-hook/UseRef.js
 */
import React, { useState, useRef, forwardRef } from "react";
import { Button } from 'antd';
import Highlight from 'react-highlight'
// 当 ref 属性用于 HTML 元素时，接收底层 DOM 元素作为其 current 属性;
// 当 ref 属性用于自定义 class 组件时，ref 接收组件的挂载实例作为其 current 属性;
// 不能在函数组件上使用 ref 属性，因为他们没有实例;
// useRef： 可以获取当前元素的所有属性，并且返回一个可变的ref对象，并且这个对象只有current属性，可设置initialValue
// const refContainer = useRef(initialValue);
// 1 第一用来操作dom
// 2 数据缓存
// 函数组件一般写法
function Child (pros) {
    let [number, setNumber] = useState(1)
    const scrollRef = useRef(null);
    const refValue = useRef(100);
    const funRef = useRef(null);
    const [clientHeight, setClientHeight] = useState(0)
    const [scrollTop, setScrollTop] = useState(0)
    const [scrollHeight, setScrollHeight] = useState(0)
    const onScroll = () => {
        if (scrollRef?.current) {
            debugger
            let clientHeight = scrollRef?.current.clientHeight; //可视区域高度
            let scrollTop = scrollRef?.current.scrollTop;  //滚动条滚动高度
            let scrollHeight = scrollRef?.current.scrollHeight; //滚动内容高度
            setClientHeight(clientHeight)
            setScrollTop(scrollTop)
            setScrollHeight(scrollHeight)
        }
    }
    const addNumber = () => {
        setNumber(num => {
            debugger
            return num + 1
        })
    }
    const subNumber = () => {
        refValue.current += 10
        console.log(scrollRef)
        console.log(refValue)
        console.log(funRef)
        setNumber(num => num + 1)
    }
    // 组件重新渲染后，变量会被重新赋值，可以用useRef缓存数据，这个数据改变后是不会触发组件重新渲染的，如果用useState保存数据，
    // 数据改变后会导致组件重新渲染，所以我们想悄悄保存数据，useRef是不二选择👊
    let initData = {
        name: 'lisa',
        age: '20'
    }
    let refData = useRef(initData)   //refData声明后组件再次渲染不会再重新赋初始值
    console.log(refData.current);
    refData.current = {       //修改refData后页面不会重新渲染
        name: 'liyang ',
        age: '18'
    }
    return (<div>
        <h3>函数组件</h3>
        <button onClick={addNumber} >增加</button>
        <span style={{ margin: '10px' }}>{number}</span>
        <button onClick={subNumber} >减少</button>
        <br />
        <Button ref={funRef}>按钮222222</Button>
        <Son title={'函数组件添加ref'} ref={funRef} />
        <div >
            <div >
                <p>可视区域高度：{clientHeight}</p>
                <p>滚动条滚动高度：{scrollTop}</p>
                <p>滚动内容高度：{scrollHeight}</p>
            </div>
            <div style={{ height: 200, overflowY: 'auto' }} ref={scrollRef} onScroll={onScroll} >
                <div style={{ height: 2000 }}></div>
            </div>
        </div>
    </div>)
}

// const Son = (props) => {
//     console.log(props.title)
//     return <Button >{props.title}</Button>
// }

const Son = forwardRef((props, ref) => {
    console.log(ref)
    return <Button >{props.title}</Button>
})

// forwardRef((props, ref) =>
// 类组件一般写法
class UseRef extends React.Component {
    constructor(pros) {
        // 调用父组件的构造器函数，必须是当前构造器第一行代码
        super(pros)
        this.state = {
            number: 1,
            content: '测试',
        }
    }
    addNumber () {
        this.setState((state, props) => {
            return { number: state.number + 1 }
        })
    }
    subNumber () {
        this.setState((state, props) => ({ number: state.number - 1 }))
    }
    render () {
        let { number } = this.state
        return (<div style={{ textAlign: 'left' }}>
            <Highlight className='javascript'>
                {`  1 当 ref 属性用于 HTML 元素时，接收底层 DOM 元素作为其 current 属性;

  2  当 ref 属性用于自定义 class 组件时，ref 接收组件的挂载实例作为其 current 属性;

  3 不能在函数组件上使用 ref 属性，因为他们没有实例;

  4 useRef： 可以获取当前元素的所有属性，并且返回一个可变的ref对象，并且这个对象只有current属性，可设置initialValue

  5 const refContainer = useRef(initialValue); 

   用途：

   1 第一用来操作dom

   2 数据缓存

   3 配合forwardRef 暴露方法


            
            `}</Highlight>
            <Child />
            <div>
                <h3>class 类组件</h3>
                <button onClick={this.addNumber.bind(this)} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} >减少</button>
            </div>
        </div>)
    }

}

export default UseRef