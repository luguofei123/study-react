import React, { useState } from "react";
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
    return (<div>
        <h3>函数组件</h3>
        <button onClick={addNumber} >增加</button>
        <span style={{ margin: '10px' }}>{number}</span>
        <button onClick={subNumber} >减少</button>
    </div>)
}
// 类组件一般写法
class StrictMode extends React.Component {
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
        // 主要有以下帮助：
        // - [识别具有不全生命周期的组件](https://reactjs.org/docs/strict-mode.html#identifying-unsafe-lifecycles)
        // - [关于旧版字符串引用 API 使用的警告](https://reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)
        // - [关于不推荐使用 findDOMNode 的警告](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
        // - [检测意外的副作用](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects)
        // - [检测遗留上下文 API](https://reactjs.org/docs/strict-mode.html#detecting-legacy-context-api)
        // - [确保重用状态](https://reactjs.org/docs/strict-mode.html#ensuring-reusable-state)
        return (<React.StrictMode><div>
            <Child />
            <div>
                <h3>class 类组件</h3>
                <button onClick={this.addNumber.bind(this)} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} >减少</button>
            </div>
        </div></React.StrictMode>)
    }

}

export default StrictMode