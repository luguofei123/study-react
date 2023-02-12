import React, { createRef, useState, forwardRef } from "react";
// import ReactDOM from 'react-dom'
// ref 的值根据节点的类型而有所不同：
// 当 ref 属性用于 HTML 元素时，构造函数中使用 React.createRef() 创建的 ref 接收底层 DOM 元素作为其 current 属性。
// 当 ref 属性用于自定义的 class 组件时， ref 对象接收组件的挂载实例作为其 current 属性。
// 不能在函数组件上使用 `ref` 属性，因为函数组件没有实例。
// 总结：为 DOM 添加 ref，那么我们就可以通过 ref 获取到对该DOM节点的引用。
// 而给React组件添加 ref，那么我们可以通过 ref 获取到该组件的实例【不能在函数组件上使用 ref 属性，因为函数组件没有实例】。
// 函数组件一般写法
const Child1 = forwardRef((props, ref) => {
    let [number, setNumber] = useState(1)
    const addNumber = () => {
        setNumber(num => {
            return num + 1
        })
    }
    const subNumber = () => {
        setNumber(num => num + 1)
    }
    return (<div >
        <h3>函数组件</h3>
        <button onClick={addNumber} ref={ref} >增加</button>
        <span style={{ margin: '10px' }}>{number}</span>
        <button onClick={subNumber} >减少</button>
        <input />
    </div>)
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
            <input />
        </div>)
    }
}
// 类组件一般写法
class ForwardRef extends React.Component {
    constructor(pros) {
        // 调用父组件的构造器函数，必须是当前构造器第一行代码
        super(pros)
        this.state = {
            number: 1,
            content: '测试',
        }
        this.childRef1 = createRef(null)
        this.childRef2 = createRef(null)
    }
    componentDidMount () {
        console.log(this.childRef1);
        console.log(this.childRef2);
        // this.childRef1.current.focus()
        // let myExample = ReactDOM.findDOMNode(this.childRef1.current)
        // console.log(myExample);
    }
    addNumber () {
        this.childRef1.current.click()
        this.childRef2.current.addNumber()
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
            <Child1 ref={this.childRef1} />
            <Child2 ref={this.childRef2} />
            <div>
                <h3>class 类组件</h3>
                <button onClick={this.addNumber.bind(this)} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} >减少</button>
                <input />
            </div>
        </div>)
    }

}

export default ForwardRef