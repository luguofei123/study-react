import React, { useState } from "react";
// 函数组件一般写法
// `JSX`会被编译为`React.createElement`的形式，然后被`babel`编译
// `React.createElement(type, [props], [...children])`共有三个参数：
// - `type`：原生组件的话是标签的字符串，如`“div”`，如果是`React`自定义组件，则会传入组件
// - `[props]`：对象，`dom`类中的`属性`，`组件`中的`props`
// - `[...children]`：其他的参数，会依此排序
// - `JSX`的结构实际上和`React.createElement`写法一致，只是用`JSX`更加简单、方便
// - 经过`React.createElement`的包裹，最终会形成 `$$typeof = Symbol(react.element)`对象，对象保存了`react.element`的信息。
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
    return <div>
        <h3>函数组件</h3>
        <button onClick={addNumber} >增加</button>
        <span style={{ margin: '10px' }}>{number}</span>
        <button onClick={subNumber} >减少</button>
    </div>
}
function CrateElementT () {
    return React.createElement('div', {}, "Hi！我是小杜杜")
}
// 类组件一般写法
class CrateElement extends React.Component {
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
            <CrateElementT />
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

export default CrateElement