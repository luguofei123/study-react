import React, { useState } from "react";


// 函数组件一般写法
function Child (pros) {
    // useState：定义变量，可以理解为他是类组件中的this.state
    // const [state, setState] = useState(initialState);
    // state：目的是提供给 UI，作为渲染视图的数据源
    // setState：改变 state 的函数，可以理解为this.setState
    // initialState：初始默认值
    // useState有点类似于PureComponent,会进行一个比较浅的比较，如果是对象的时候直接传入并不会更新，这点一定要切记
    let [number, setNumber] = useState(1)
    let [countData, setcountData] = useState({ count: 1 })
    const addNumber = () => {
        setNumber(number + 1)
    }
    const subNumber = () => {
        setNumber(num => num + 1)
    }
    const changeObj = () => {
        // 这样不会发生变化，因为他们是用的一个引用，浅比较的时候认为是一样的
        // countData.count++
        // setcountData(countData)
        // 下面这样就会发生变化
        let obj = { ...countData }
        obj.count++
        setcountData(obj)

    }
    return (<div>
        <h3>函数组件</h3>
        <button onClick={addNumber} >增加</button>
        <span style={{ margin: '10px' }}>{number}</span>
        <button onClick={subNumber} >减少</button>
        <div></div>
        <span style={{ margin: '10px' }}>{countData.count}</span>
        <button onClick={changeObj}>useState会进行浅比较</button>
    </div>)
}
// 类组件一般写法
class UseState extends React.Component {
    constructor(pros) {
        // 调用父组件的构造器函数，必须是当前构造器第一行代码
        super(pros)
        this.state = {
            number: 1,
            content: '测试',
            countData: {
                count: 1
            }
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
    changeObj () {
        const { countData } = this.state
        countData.count--
        this.setState({ countData })
    }
    render () {
        let { number, countData } = this.state
        return (<div>
            <Child />
            <div>
                <h3>class 类组件</h3>
                <button onClick={this.addNumber.bind(this)} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} >减少</button>
                <div></div>
                <span style={{ margin: '10px' }}>{countData.count}</span>
                <button onClick={this.changeObj.bind(this)}>setState会进行深比较</button>
            </div>
        </div>)
    }

}

export default UseState