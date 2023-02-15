import React, { useState, useId } from "react";
import Highlight from 'react-highlight'
import { Button } from 'antd';

// 函数组件一般写法
function Child (pros) {
    const [number, setNumber] = useState(1)
    const [b, setB] = useState('b')
    const [countData, setcountData] = useState({ count: 1 })
    console.log('child----renderChild')
    console.log('child----number', number)
    console.log('child----b', b)
    // let data = pros.data
    const id = useId()
    // 同步增加  更新同一个值2次，组件渲染一次，setNumber只会执行一次
    // 获取改变后的值 
    // 1 直接取 this.state.number + 1 
    // 2 延迟获取 this.state.number
    // 3 利用useRef 缓存数据
    const addNumber = () => {
        setNumber(number + 1)
        setNumber(number + 1)
        setB('bbbbb')
        setB('bbbbbb')
        console.log('child----number是否同步变化', number)
    }
    const subNumber = () => {
        // 异步更新同一个值2次，组件渲染一次，setNumber会执行2次
        // Promise.resolve().then(() => {
        //     setNumber(num => num - 1)
        //     setNumber(num => num - 1)
        //     console.log('child----number是否同步变化', number)
        // })
        // Promise.resolve().then(() => {
        //     setB('bbb')
        //     setB('bbbb')
        // })
        // 异步更新同一个值2次，组件渲染一次，setNumber会执行2次
        setTimeout(() => {
            setNumber(number - 1)
            setNumber(number - 1)
            console.log('child----number是否同步变化', number)
        }, 100)
        // setTimeout(() => {
        //     setB('bbb')
        //     setB('bbbb')
        // }, 200)
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
        <h3 id={id}>函数组件 useState</h3>
        <Highlight className='javascript'>
            {`  
  const [number, setNumber] = useState(1)

  const [countData, setcountData] = useState({ count: 1 })
  `}</Highlight>
        <Button onClick={addNumber} >同步增加</Button>
        <span style={{ margin: '10px' }}>{number}</span>
        <Button onClick={subNumber} >异步减少</Button>

        <span style={{ margin: '10px 10px 10px 50px' }}>{countData.count}</span>
        <Button onClick={changeObj}>增加（useState会进行浅比较）</Button>

    </div>)
}
// 类组件一般写法
class UseState extends React.Component {
    constructor(pros) {
        // 调用父组件的构造器函数，必须是当前构造器第一行代码
        super(pros)
        this.state = {
            number: 1,
            b: 'b',
            content: '测试',
            countData: {
                count: 1
            }
        }
    }
    addNumber () {
        // 获取改变后的值 
        // 1 直接取 this.state.number + 1 
        // 2 延迟获取 this.state.number
        // 3 利用useRef 缓存数据
        this.setState({ number: this.state.number + 1 }, () => {
            console.log('改变后能立即获取到number=====' + this.state.number)
        })
        this.setState({ number: this.state.number + 1 })
    }
    subNumber () {
        Promise.resolve().then(() => {
            this.setState({ number: this.state.number - 1 })
            this.setState({ number: this.state.number - 1 })
        })
    }
    changeObj () {
        const { countData } = this.state
        countData.count++
        this.setState({ countData })
    }
    render () {
        let { number, countData, b } = this.state
        console.log('parent----renderParent')
        console.log('parent----number', number)
        console.log('parent----b', b)
        return (<div style={{ textAlign: 'left' }}>
            <Highlight className='javascript'>
                {`
  useState：定义变量，可以理解为他是类组件中的this.state

  语法 const [state, setState] = useState(initialState);

  state：目的是提供给 UI，作为渲染视图的数据源

  setState：改变 state 的函数，可以理解为this.setState， setState(options)/setState(callback)

  initialState：初始默认值

  useState有点类似于PureComponent,会进行一个比较浅的比较，如果是对象的时候直接传入并不会更新，这点一定要切记
  `}</Highlight>
            <Child data={this.state} />
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <h3>class 类组件 setState</h3>
                <Highlight className='javascript'>
                    {`  
  this.state = {

    number: 1,

    countData: {

      count: 1

     }

  }`
                    }</Highlight>
                <Button onClick={this.addNumber.bind(this)} >同步增加</Button>
                <span style={{ margin: '10px' }}>{number}</span>
                <Button onClick={this.subNumber.bind(this)} >异步减少</Button>
                <span style={{ margin: '10px 10px 10px 50px' }}>{countData.count}</span>
                <Button onClick={this.changeObj.bind(this)}>增加（useState会进行深比较）</Button>
            </div>
            <Highlight className='javascript'>
                {`  
  useState 和 setState 同步/异步总结

  1 在正常的react的事件流里（如onClick等） setState和useState是异步执行的（不会立即更新state的结果）

  多次执行setState和useState，只会调用一次重新渲染render, 并且setState和useState都会进行state的合并。

  2 在setTimeout，Promise.then等异步事件中 setState和useState也是异步执行的多次执行setState和useState，
  
  都会调用一次render
            
            `}</Highlight>
        </div>)
    }

}

export default UseState