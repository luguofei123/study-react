import React, { useState } from "react";
import ReactDom from 'react-dom'
// flushSync：可以将回调函数中的更新任务，放到一个较高级的优先级中，适用于强制刷新，同时确保了DOM会被立即更新
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
class FlushSynct extends React.Component {
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
    // 这种会合并后，一次更新
    addContinu1 () {
        this.setState({ number: 1 })
        this.setState({ number: 2 })
        this.setState({ number: 3 })
    }
    // 可以发现flushSync会优先执行，并且强制刷新，所以会改变number值为2，然后1和3在被批量刷新，更新为3
    addContinu2 () {
        this.setState({ number: 1 })
        ReactDom.flushSync(() => {
            this.setState({ number: 2 })
        })
        this.setState({ number: 3 })
    }
    render () {
        let { number, content } = this.state
        console.log(number)
        return (<div>
            <Child />
            <div>
                <h3>class 类组件{content}</h3>
                <button onClick={this.addNumber.bind(this)} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} >减少</button>
                <button onClick={this.addContinu1.bind(this)} >连续增长，一次render</button>
                <button onClick={this.addContinu2.bind(this)} >FlushSync，强制刷新</button>
            </div>
        </div>)
    }

}
export default FlushSynct