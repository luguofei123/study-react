import React, { useState, Profiler } from "react";
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
class ProfilerT extends React.Component {
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
    //     id 发生提交的 Profiler 树的 “id”
    //   phase  "mount" （如果组件树刚加载） 或者 "update" （如果它重渲染了）之一
    //   actualDuration  本次更新 committed 花费的渲染时间
    //   baseDuration  估计不使用 memoization 的情况下渲染整颗子树需要的时间
    //   startTime   本次更新中 React 开始渲染的时间
    //   commitTime  本次更新中 React committed 的时间
    //   interactions 
    callBack (id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) {
        console.log('id===' + id)
        console.log('phase===' + phase)
        console.log('actualDuration===' + actualDuration)
        console.log('baseDuration===' + baseDuration)
        console.log('startTime===' + startTime)
        console.log('commitTime===' + commitTime)
        console.log('interactions===' + interactions)
    }
    render () {
        let { number } = this.state
        return (<div>
            {/* 需要两个 prop ：
                id:string类型
                回调函数：是当组件树中的组件“提交”更新的时候被React调用的回调函数 onRender(function)。 */}
            <Profiler id="test" onRender={this.callBack}>
                <Child />
                <div>
                    <h3>class 类组件</h3>
                    <button onClick={this.addNumber.bind(this)} >增加</button>
                    <span style={{ margin: '10px' }}>{number}</span>
                    <button onClick={this.subNumber.bind(this)} >减少</button>
                </div>
            </Profiler>
        </div>)
    }

}

export default ProfilerT