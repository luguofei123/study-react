import React, { useState, createRef } from "react";
// ref 属性只能被添加到 原生DOM元素 或者 React的 class 组件上。不能在 函数组件 上使用 ref 属性，因为函数组件没有实例。
// 若想在函数组件上使用 ref 属性，可以通过 React.forwardRef 将 Ref 转发到函数组件内部的 原生 DOM 元素上。
// 函数组件一般写法
function Child1 (pros) {
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
    const button1 = createRef()
    return (<div>
        <h3>函数组件</h3>
        <button onClick={addNumber} ref={button1}>增加</button>
        <span style={{ margin: '10px' }}>{number}</span>
        <button onClick={subNumber} >减少</button>
    </div>)
}
class Child2 extends React.Component {
    constructor(pros) {
        super(pros)
        this.state = {
        }
    }
    render () {
        return <div>
            <button>孩子2按钮</button>
        </div>
    }
}
// 类组件一般写法
class CreateRef extends React.Component {
    constructor(pros) {
        // 调用父组件的构造器函数，必须是当前构造器第一行代码
        super(pros)
        this.state = {
            number: 1,
            content: '测试',
        }
        // this.parentNode = createRef()
    }
    button1 = createRef()
    button2 = null
    childref1 = createRef()
    childref2 = createRef()

    addNumber () {
        this.setState((state, props) => {
            return { number: state.number + 1 }
        })
    }
    subNumber () {
        this.setState((state, props) => ({ number: state.number - 1 }))
    }
    componentDidMount () {
        console.log(this.button1.current)
        console.log(this.button2)
        console.log(this.childref1)
        console.log(this.childref2)
    }
    render () {
        let { number } = this.state
        return (<div  >
            {/* <Child ref={this.childref} /> ref不能工作，因为函数组件没有实例 */}
            <Child1 ref={this.childref1} />
            <Child2 ref={this.childref2} />
            <div>
                <h3>class 类组件</h3>
                <button onClick={this.addNumber.bind(this)} ref={this.button1} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} ref={node => this.button2 = node} >减少</button>
            </div>
        </div>)
    }

}

export default CreateRef