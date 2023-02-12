import React, { useState, useEffect } from "react";
// `useEffect`：副作用，你可以理解为是类组件的生命周期，也是我们最常用的钩子
// 那么什么是副作用呢？
// **副作用（Side Effect**：是指 function 做了和本身运算返回值无关的事，
// 如请求数据、修改全局变量，打印、数据获取、设置订阅以及手动更改 `React` 组件中的 `DOM` 都属于副作用操作都算是副作用

// 函数组件一般写法
function Child (pros) {
    let [number, setNumber] = useState(1)
    const addNumber = () => {
        setNumber(num => {
            debugger
            return num + 1
        })
    }
    const subNumber = () => {
        setNumber(num => num + 1)
    }
    // 模拟 class 组件的 componentDidMount 
    // 第二个参数是 [] （不依赖于任何 state）
    useEffect(() => {
        console.log('加载完了')
    }, [])
    // 模拟 class 组件的 componentDidMount 和 componentDidUpdate
    useEffect(() => {
        console.log('在此发送一个 ajax 请求')
    })
    // 模拟 class 组件的 componentDidUpdate
    // 第二个参数就是依赖的 state
    useEffect(() => {
        console.log('number更新了')
    }, [number])
    // 模拟 class 组件的 componentDidMount
    useEffect(() => {
        let timerId = window.setInterval(() => {
            //console.log(Date.now())
        }, 1000)
        // 返回一个函数
        // 模拟 WillUnMount 组件销毁的时候 停止计时器
        return () => {
            console.log('卸载了')
            window.clearInterval(timerId)
        }
    }, [])
    return (<div>
        <h3>函数组件</h3>
        <button onClick={addNumber} >增加</button>
        <span style={{ margin: '10px' }}>{number}</span>
        <button onClick={subNumber} >减少</button>
    </div>)
}
// 类组件一般写法
class UseEffect extends React.Component {
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
        return (<div>
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

export default UseEffect