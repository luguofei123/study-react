import React, { useState, createRef, useImperativeHandle, forwardRef, useRef } from "react";
// useImperativeHandle
// 通过useImperativeHandle可以只暴露特定的操作
// 通过useImperativeHandle的Hook, 将父组件传入的ref和useImperativeHandle第二个参数返回的对象绑定到了一起
// 所以在父组件中, 调用inputRef.current时, 实际上是返回的对象
// useImperativeHandle使用简单总结:
// 作用: 减少暴露给父组件获取的DOM元素属性, 只暴露给父组件需要用到的DOM方法
// 参数1: 父组件传递的ref属性
// 参数2: 返回一个对象, 以供给父组件中通过ref.current调用该对象中的方法
// useImperativeHandle(ref, createHandle, [deps])
// ref：useRef所创建的ref
// createHandle：处理的函数，返回值作为暴露给父组件的 ref 对象。
// deps：依赖项，依赖项更改形成新的 ref 对象。


// forwardRef 的作用是让函数组件能接收父组件传过来的ref
const Child = forwardRef((props, ref) => {
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
    useImperativeHandle(ref, () => ({
        addNumber, subNumber
    }))
    const sonref = useRef()
    const getSonMethod = () => {
        debugger
        sonref.current.addNumber()
    }
    return (<div>
        <Son ref={sonref} />
        <h3>函数儿子组件</h3>
        <button onClick={addNumber} >增加</button>
        <span style={{ margin: '10px' }}>{number}</span>
        <button onClick={subNumber} >减少</button>
        <button onClick={getSonMethod} >调用孙子组件的方法</button>
    </div>)
})
const Son = forwardRef((props, ref) => {
    let [number, setNumber] = useState(1)
    const addNumber = () => {
        setNumber(num => {
            debugger
            return num + 1
        })
    }
    useImperativeHandle(ref, () => ({
        addNumber
    }))
    return <div>
        <h1>孙子视图</h1>
        <span>{number}</span>
        <button onClick={addNumber}>孙子增加1</button>
    </div>
})
// 类组件一般写法
class UseImperativeHandle extends React.Component {
    constructor(pros) {
        // 调用父组件的构造器函数，必须是当前构造器第一行代码
        super(pros)
        this.state = {
            number: 1,
            content: '测试',
        }
    }
    ChildRef = createRef(null)
    addNumber () {
        this.setState((state, props) => {
            return { number: state.number + 1 }
        })
    }
    subNumber () {
        this.setState((state, props) => ({ number: state.number - 1 }))
    }
    getChildrenMethod () {
        debugger
        this.ChildRef.current.addNumber()
    }
    render () {
        let { number } = this.state
        return (<div>
            <Child ref={this.ChildRef} />
            <div>
                <h3>class 类组件</h3>
                <button onClick={this.addNumber.bind(this)} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} >减少</button>
                <button onClick={this.getChildrenMethod.bind(this)} >调用子组件的方法</button>
            </div>
        </div>)
    }

}

export default UseImperativeHandle