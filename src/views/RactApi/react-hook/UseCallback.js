import React, { useState, useCallback, memo } from "react";
// useCallback与useMemo极其类似,可以说是一模一样，唯一不同的是useMemo返回的是函数运行的结果，而useCallback返回的是函数
// 注意：这个函数是父组件传递子组件的一个函数，防止做无关的刷新，其次，这个组件必须配合memo,否则不但不会提升性能，还有可能降低性能
// useCallback的作用其实是用来避免子组件不必要的reRender
// 函数式组件中，使用useCallback对函数进行缓存（被外层函数包裹，相当于闭包），组件再次更新时（函数重新执行）
// 会根据依赖是否变化决定选用缓存函数【之前生成的函数】还是新函数【新生成的上下文】。
// 一般会在嵌套组件中，与函数式组件的memo和类组件的PureComponent一起使用【会对传入props参数逐个进行浅比较决定是否需要更新】，来提高页面性能。
// useCallBack不要每个函数都包一下，否则就会变成反向优化，useCallBack本身就是需要一定性能的
// useCallBack并不能阻止函数重新创建,它只能通过依赖决定返回新的函数还是旧的函数,从而在依赖不变的情况下保证函数地址不变
// useCallBack需要配合React.memo使用
// 函数组件一般写法
function Child (pros) {
    debugger
    let [number, setNumber] = useState(1)
    let [count, setCount] = useState(100)
    const addNumber = () => {
        setNumber(num => {
            return num + 1
        })
    }
    const subNumber = () => {
        setNumber(num => num + 1)
    }
    // memo进行浅比较，func1被缓存了，返回的函数引用是相同的，所以比较的时候是相同的，所以不需要渲染Son组件
    const func1 = useCallback(() => {
        console.log('11111 count---number')
        // setCount(number + 1)
    }, [])
    // }, [count, number])
    //  memo进行浅比较  因为父组件重新渲染，所以func2重新生成，所以比较的时候是不相同的，所以就重新渲染Son组件
    const func2 = () => {
        console.log(22222222)
        setCount(count + 1)

    }
    return (<div>
        <h3>函数子组件</h3>
        <button onClick={addNumber} >增加</button>
        <span style={{ margin: '10px' }}>{number}</span>
        <button onClick={subNumber} >减少</button>
        <div>count: {count}</div>
        <Son func={func1} title={'callback点击'} />
        <Son func={func2} title={'普通点击'} />
    </div>)
}
// memo 函数组件使用例子  `true`则不更新，为`false`更新
const Son = memo((props) => {
    console.log(props.title)
    return <button onClick={props.func}>{props.title}</button>
})
// 类组件一般写法
class UseCallback extends React.Component {
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
    componentDidUpdate () {
        console.log('父组件更新了')
    }
    render () {
        let { number } = this.state
        return (<div>
            <Child />
            <div>
                <h3>class 父类组件</h3>
                <button onClick={this.addNumber.bind(this)} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} >减少</button>
            </div>
        </div>)
    }

}

export default UseCallback