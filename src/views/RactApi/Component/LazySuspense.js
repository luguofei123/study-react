import React, { useState, Suspense, lazy } from "react";
// 实际上`lazy`必须接受一个函数，并且需要返回一个`Promise`, 
// 并且需要`resolve`一个`default`一个`React`组件，
// 除此之外，`lazy`必须要配合`Suspense`一起使用
import LazyChild from './Component'

// const LazyChild1 = lazy(() => import('./Component'));
const LazyChild2 = lazy(() => new Promise((res) => {
    setTimeout(() => {
        res({
            default: () => <LazyChild />
        })
    }, 1000)

}))
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
class LazySuspense extends React.Component {
    constructor(pros) {
        // 调用父组件的构造器函数，必须是当前构造器第一行代码
        super(pros)
        this.state = {
            number: 1,
            content: '测试',
            show: false
        }
    }
    addNumber () {
        this.setState((state, props) => {
            return { number: state.number + 1, show: true }
        })
    }
    subNumber () {
        this.setState((state, props) => ({ number: state.number - 1, show: false }))
    }
    render () {
        let { number, show } = this.state

        // React.Fragment 等价于`<></>
        // Fragment` 这个组件可以赋值 `key`，也就是索引，`<></>`不能赋值
        return (<React.Fragment>
            <Child />
            {/* {
                show && <Suspense fallback={<div>加载中........</div>}>
                    <LazyChild1 />
                </Suspense>
            } */}
            {
                show && <Suspense fallback={<div>加载中........</div>}>
                    <LazyChild2 />
                </Suspense>
            }
            <div>
                <h3>class 类组件</h3>
                <button onClick={this.addNumber.bind(this)} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} >减少</button>
            </div>
        </React.Fragment>)
    }

}

export default LazySuspense