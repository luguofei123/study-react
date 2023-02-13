import React, { useState, useRef, useEffect } from "react";
import ReactDom from 'react-dom'
// createPortal：
// 在Portal中提供了一种将子节点渲染到已 DOM 节点中的方式，该节点存在于 DOM 组件的层次结构之外。
// 也就是说createPortal可以把当前组件或element元素的子节点，渲染到组件之外的其他地方。
// 来看看createPortal(child, container)的入参：
// child：任何可渲染的子元素
// container：是一个DOM元素
// 发现，我们处理的数newDom的数据到了同级的节点处，那么这个Api该如何应用呢？
// 我们可以处理一些顶层元素，如：Modal弹框组件，Modal组件在内部中书写，挂载到外层的容器（如body），此时这个Api就非常有用

// 其他知识点记录
// 1 render
// ReactDOM.render( < App / >,  document.getElementById('app')) 第一个参数是子元素，第二个是dom元素
// 2 createRoot
// 在React v18中，render函数已经被createRoot所替代
// createRoot会控制你传入的容器节点的内容。当调用 render 时，里面的任何现有 DOM 元素都会被替换。
// 后面的调用使用 React 的 DOM diffing 算法进行有效更新。
// 并且createRoot不修改容器节点（只修改容器的子节点）。可以在不覆盖现有子节点的情况下将组件插入现有 DOM 节点。
// import React, { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
// const rootElement = document.getElementById('root');
// const root = createRoot(rootElement);
// root.render(
//   <StrictMode>
//     <Main />
//   </StrictMode>
// );
// 3 hydrate：服务端渲染用hydrate与render()相同，但它用于在ReactDOMServer渲染的容器中对 HTML 的内容进行 hydrate 操作。
// hydrate(element, container[, callback])
// 4 hydrate在React v18也被替代为hydrateRoot()
// hydrateRoot(container, element[, options])
// 5 unmountComponentAtNode unmountComponentAtNode：从 DOM 中卸载组件，会将其事件处理器（event handlers）
// 和 state 一并清除。如果指定容器上没有对应已挂载的组件，这个函数什么也不会做。如果组件被移除将会返回true，
// 如果没有组件可被移除将会返回false。
// 6 root.unmount()
// unmountComponentAtNode 同样在React 18中被替代了，替换成了createRoot中的unmount()方法
// const root = createRoot(container);
// root.render(element);
// root.unmount()
// 7 findDOMNode findDOMNode：用于访问组件DOM元素节点（应急方案），官方推荐使用ref
// 需要注意的是：
// findDOMNode只能用到挂载的组件上
// findDOMNode只能用于类组件，不能用于函数式组件
// 如果组件渲染为null或者为false，那么findDOMNode返回的值也是null
// 如果是多个子节点Fragment的情况，findDOMNode会返回第一个非空子节点对应的 DOM 节点。
// 在严格模式下这个方法已经被弃用



function Child (pros) {
    let [number, setNumber] = useState(1)
    const [newDom, setNewDom] = useState()
    const ref = useRef()

    const addNumber = () => {
        setNumber(num => {
            debugger
            return num + 1
        })
    }
    const subNumber = () => {
        setNumber(num => num + 1)
    }
    useEffect(() => {
        setNewDom(ReactDom.createPortal(pros.children, ref.current))
    }, [pros.children])
    return (<div>
        <h3>函数组件</h3>
        <button onClick={addNumber} >增加</button>
        <span style={{ margin: '10px' }}>{number}</span>
        <button onClick={subNumber} >减少</button>
        <div ref={ref}><p>同级的节点1</p></div>
        <div>
            <p>这层的节点2</p>
        </div>
        <div>swsw{newDom}</div>
    </div>)
}
// createPortal 这个 API 通常用于创建模态窗口或对话框之类的场景。
function Dialog (props) {
    let dom = document.getElementById('portal')
    if (!dom) {
        dom = document.createElement('div')
        dom.setAttribute('id', 'portal')
        document.body.appendChild(dom)
    }


    return ReactDom.createPortal(<>{props.children}</>, dom)
}
// 类组件一般写法
class CreatePortal extends React.Component {
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
            <Child >
                <p>子节点信息3</p>
                <p>子节点信息4</p>
            </Child>
            <div>
                <h3>class 类组件</h3>
                <button onClick={this.addNumber.bind(this)} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} >减少</button>
            </div>
            <p>我不在 root 里面</p>
            <Dialog>
                <p>我不在 root 里面</p>
            </Dialog>
        </div>)
    }

}

export default CreatePortal