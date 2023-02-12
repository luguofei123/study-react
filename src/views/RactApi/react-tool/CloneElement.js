import React, { useState } from "react";
// React.cloneElement()接收三个参数第一个参数接收一个ReactElement，
// 可以是真实的dom结构也可以是自定义的。第二个参数返回旧元素的props、key、ref。可以添加新的props，
// 第三个是props.children，不指定默认展示我们调用时添加的子元素。如果指定会覆盖我们调用克隆组件时里面包含的元素

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
    return <div>
        <h3>函数组件</h3>
        <button onClick={addNumber} >增加</button>
        <span style={{ margin: '10px' }}>{number}</span>
        <button onClick={subNumber} >减少</button>
    </div>
}
function CloneElementDemo (props) {
    return React.cloneElement(<div />, props, <p>这是一个克隆的元素1111</p>)
}
// function CloneElementDemo (props) {
//     return React.cloneElement(<div />, props)
// }
function ContainerBox () {
    return <CloneElementDemo><h1>这是在父组件添加的元素</h1></CloneElementDemo>
}
function CloneDemo1 ({ dom = <div />, ...props }) {
    return React.cloneElement(dom, { ...props })
}
function ContainerBox1 () {
    return <CloneDemo1 dom={<p></p>}><span>这是在父组件添加的元素112222</span></CloneDemo1>
}
const Exam = (props) => {
    return <div>这是一个自定义的ReactElement元素{props.children}</div>
}
function CloneDemo2 ({ dom = <div />, ...rest }) {
    return React.cloneElement(dom, { ...rest })
}
function ContainerBox2 () {
    return <CloneDemo2 dom={<Exam style={{ color: "red", textAlign: "center" }} />}><h1>这是在父组件添加的元素</h1></CloneDemo2>
}
// 复制带样式
const Exam3 = (props) => {
    return <div style={{ ...props.styles, ...props.style }}>这是一个自定义的ReactElement元素{props.children}</div>
}
function CloneDemo3 ({ dom = <div />, ...rest }) {
    const styles = {
        color: "blue",
        minWidth: "1200px",
        margin: "100px auto",
        textAlign: "left"
    }
    return React.cloneElement(dom, { styles, ...rest })
}
function ContainerBox3 () {
    return <CloneDemo3 dom={<Exam3 style={{ color: "red", textAlign: "center" }} />}><h1>这是在父组件添加的元素</h1></CloneDemo3>
}
// 继续优化
const Exam4 = (props) => {
    return <div style={{ ...props.style }}>这是一个自定义的ReactElement元素{props.children}</div>
}
function CloneDemo4 ({ dom = <div />, ...rest }) {
    const styles = {
        color: "blue",
        minWidth: "1200px",
        margin: "100px auto",
        textAlign: "left"
    }
    return React.cloneElement(dom, {
        style: Object.assign({}, styles, dom.props.style), //将传入的样式放到最后提高他的优先级
        ...rest
    })
}
function ContainerBox4 () {
    return <CloneDemo4 dom={<Exam4 style={{ color: "red", textAlign: "center" }} />}><h1>这是在父组件添加的元素</h1></CloneDemo4>
}
// 类组件一般写法
class CloneElement extends React.Component {
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
            <ContainerBox />
            <ContainerBox1 />
            <ContainerBox2 />
            <ContainerBox3 />
            <ContainerBox4 />
            <Child />
            <div>
                <h3>class 类组件</h3>
                <button onClick={this.addNumber.bind(this)} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} >减少</button>
            </div>
        </div>)
    }

}

export default CloneElement