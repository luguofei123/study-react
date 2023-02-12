import React, { useState } from "react";
// 旧版
// 1. 初始化阶段: 由ReactDOM.render()触发---初次渲染
// 	  1.constructor()
// 	  2.componentWillMount()
// 	  3.render()
// 	  4.componentDidMount() =====> 常用
// 	  一般在这个钩子中做一些初始化的事，例如：开启定时器、发送网络请求、订阅消息
// 2. 更新阶段: 由组件内部this.setSate()或父组件render触发
// 	  1.shouldComponentUpdate()
// 	  2.componentWillUpdate()
// 	  3.render() =====> 必须使用的一个
// 	  4.componentDidUpdate()
// 3. 卸载组件: 由ReactDOM.unmountComponentAtNode()触发
// 	  1.componentWillUnmount()  =====> 常用
// 	  一般在这个钩子中做一些收尾的事，例如：关闭定时器、取消订阅消息
// 新版
// 1.初始化阶段: 由ReactDOM.render()触发—初次渲染
//   1. constructor()
// 	 2. getDerivedStateFromProps
// 	 3. render()
// 	 4. componentDidMount()
// 2.更新阶段: 由组件内部this.setSate()或父组件重新render触发
// 	 1. getDerivedStateFromProps
// 	 2. shouldComponentUpdate()
// 	 3. render()
// 	 4. getSnapshotBeforeUpdate
// 	 5. componentDidUpdate()
// 3.卸载组件: 由ReactDOM.unmountComponentAtNode()触发
// 	 1. componentWillUnmount()
// 常用钩子
// 1.render：初始化渲染或更新渲染调用
// 2.componentDidMount：开启监听, 发送ajax请求
// 3.componentWillUnmount：做一些收尾工作, 如: 清理定时器
// 即将废弃的钩子
// 1.componentWillMount
// 2.componentWillReceiveProps
// 3.componentWillUpdate
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
class Child1 extends React.Component {
    //组件将要接收新的props的钩子
    componentWillReceiveProps (props) {
        console.log('Child1---componentWillReceiveProps', props);
    }
    //组件将要挂载的钩子
    componentWillMount () {
        console.log('Child1---componentWillMount');
    }

    //组件挂载完毕的钩子
    componentDidMount () {
        console.log('Child1---componentDidMount');
    }

    //组件将要卸载的钩子
    componentWillUnmount () {
        console.log('Child1---componentWillUnmount');
    }

    //控制组件更新的“阀门”
    shouldComponentUpdate () {
        console.log('Child1---shouldComponentUpdate');
        return true
    }
    //组件将要更新的钩子
    componentWillUpdate () {
        console.log('Child1---componentWillUpdate');
    }

    //组件更新完毕的钩子
    componentDidUpdate () {
        console.log('Child1---componentDidUpdate');
    }

    render () {
        console.log('Child1---render');
        return (
            <div>我是Child1组件，接收到的数字是:{this.props.number}</div>
        )
    }
}
// 类组件一般写法
class LifeCycle extends React.Component {
    constructor(pros) {
        // 调用父组件的构造器函数，必须是当前构造器第一行代码
        console.log('Count---constructor');
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
    forceUpdate1 () {
        this.forceUpdate()
    }
    //组件将要挂载的钩子
    componentWillMount () {
        console.log('Count---componentWillMount');
    }

    //组件挂载完毕的钩子
    componentDidMount () {
        console.log('Count---componentDidMount');
    }

    //组件将要卸载的钩子
    componentWillUnmount () {
        console.log('Count---componentWillUnmount');
    }

    //控制组件更新的“阀门”
    shouldComponentUpdate () {
        console.log('Count---shouldComponentUpdate');
        return true
    }

    //组件将要更新的钩子
    componentWillUpdate () {
        console.log('Count---componentWillUpdate');
    }

    //组件更新完毕的钩子
    componentDidUpdate () {
        console.log('Count---componentDidUpdate');
    }
    render () {
        console.log('Count---render');
        let { number } = this.state
        return (<div>
            <Child />
            <Child1 number={number} />
            <div>
                <h3>class 类组件</h3>
                <button onClick={this.addNumber.bind(this)} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} >减少</button>
                <button onClick={this.forceUpdate1.bind(this)} >强制更新</button>
            </div>
        </div>)
    }

}

export default LifeCycle