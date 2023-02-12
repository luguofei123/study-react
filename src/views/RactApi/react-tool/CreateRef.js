import React, { useState, createRef } from "react";
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
    }
    render () {
        let { number } = this.state
        return (<div  >
            <Child />
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