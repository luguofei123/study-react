import React, { useState, useEffect, memo } from "react";

// **memo**：结合了`pureComponent纯组件`和 `componentShouldUpdate`功能，会对传入的props进行一次对比，
// 然后根据第二个函数返回值来进一步判断哪些props需要更新
// 要注意`memo`是一个**高阶组件**，`函数式组件`和`类组件`都可以使用。
// `memo`接收两个参数:
// - 第一个参数：组件本身，也就是要优化的组件
// - 第二个参数：(pre, next) => boolean, `pre`：之前的数据， `next`：现在的数据，
// 返回一个`布尔值`，若为 `true`则不更新，为`false`更新
// 函数组件一般写法
function Child1 (props) {
    let [number, setNumber] = useState(1)
    useEffect(() => {
        // 父类更新的时候子组件也会更新，不管有没没有依赖父组件的数据
        // 解决办法就是
        console.log('Child1子组件重新渲染---' + props.title)
    })
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
        <h3>{props.title}</h3>
        <button onClick={addNumber} >增加</button>
        <span style={{ margin: '10px' }}>{number}</span>
        <button onClick={subNumber} >减少</button>
    </div>)
}
// memo 函数组件使用例子  `true`则不更新，为`false`更新
const Child1Memo = memo(Child1, (pre, next) => {
    debugger
    if (next.number < 10) {
        return true
    } else {
        return false
    }

})
class Child2 extends React.Component {
    constructor(props) {
        // 调用父组件的构造器函数，必须是当前构造器第一行代码
        super(props)
        this.state = {
            number: 1,
            content: '测试',
            title: props.title || '无名字'
        }
    }
    componentDidUpdate () {
        // 父类更新的时候子组件也会更新，不管有没没有依赖父组件的数据
        console.log('Child2子组件重新渲染----' + this.state.title)
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
            <h3>{this.state.title}</h3>
            <button onClick={this.addNumber.bind(this)} >增加</button>
            <span style={{ margin: '10px' }}>{number}</span>
            <button onClick={this.subNumber.bind(this)} >减少</button>
        </div>)
    }
}
// memo 类组件使用例子  `true`则不更新，为`false`更新
const Child2Memo = memo(Child2, (pre, next) => {
    if (next.number < 10) {
        return true
    } else {
        return false
    }
})
// 类组件一般写法
class Memo extends React.Component {
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
            <Child1 title={'函数子组件'} number={number} />
            <Child1Memo title={'memo函数子组件'} number={number} />
            <Child2 title={'class 子类组件'} number={number} />
            <Child2Memo title={'class memo子类组件'} number={number} />
            <div>
                <h3>class 父类组件</h3>
                <button onClick={this.addNumber.bind(this)} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} >减少</button>
            </div>
        </div>)
    }

}

export default Memo