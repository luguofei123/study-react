import React, { useState } from "react";
import ReactDom from 'react-dom'
// unstable_batchedUpdates :可用于手动批量更新state，可以指定多个setState合并为一个更新请求
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
class UnstableBatchedUpdates extends React.Component {
    constructor(pros) {
        // 调用父组件的构造器函数，必须是当前构造器第一行代码
        super(pros)
        this.state = {
            number: 0,
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
    // 类组件有个实现上的怪异，它可以同步读取事件内部的状态更新。这意味着可以在setState之间读取到最新的state
    // 在 React 18，情况不再如此。由于即使在setTimeout中的所有更新都是批处理的，
    // 因此React不会同步渲染第一个setState的结果——渲染发生在browser nextTick，
    // 所以在setState之间读取state将获取不到上一个setState的结果：
    // 三次打印结果全部是0
    test1 () {
        this.setState({ number: this.state.number + 1 })
        console.log(this.state.number)
        this.setState({ number: this.state.number + 1 })
        console.log(this.state.number)
        this.setState({ number: this.state.number + 1 })
        console.log(this.state.number)
    }
    // 三次打印结果全部是0
    test2 () {
        setTimeout(() => {
            debugger
            this.setState({ number: this.state.number + 1 })
            console.log(this.state.number)
            this.setState({ number: this.state.number + 1 })
            console.log(this.state.number)
            this.setState({ number: this.state.number + 1 })
            console.log(this.state.number)
        }, 100)
    }
    test3 () {
        setTimeout(() => {
            ReactDom.unstable_batchedUpdates(() => {
                this.setState({ number: this.state.number + 1 })
                console.log(this.state.number)
                this.setState({ number: this.state.number + 1 })
                console.log(this.state.number)
                this.setState({ number: this.state.number + 1 })
                console.log(this.state.number)
            })
        }, 100)
    }
    render () {
        let { number } = this.state
        console.log('render-------' + number)
        return (<div>
            <Child />
            <div>
                <h3>class 类组件</h3>
                <button onClick={this.addNumber.bind(this)} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} >减少</button>
                <button onClick={this.test1.bind(this)} >测试按钮1</button>
                <button onClick={this.test2.bind(this)} >测试按钮2</button>
                <button onClick={this.test3.bind(this)} >测试按钮3</button>

            </div>
        </div>)
    }

}

export default UnstableBatchedUpdates