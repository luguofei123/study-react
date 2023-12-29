import React, { useState, useEffect } from "react";
import Highlight from 'react-highlight'
import { Button } from 'antd';
// `useEffect`：副作用，你可以理解为是类组件的生命周期，也是我们最常用的钩子
// 那么什么是副作用呢？
// **副作用（Side Effect**：是指 function 做了和本身运算返回值无关的事，
// 如请求数据、修改全局变量，打印、数据获取、设置订阅以及手动更改 `React` 组件中的 `DOM` 都属于副作用操作都算是副作用
// 1.useEffect会在渲染的内容更新到DOM上后执行,不会阻塞DOM的更新
// 2.useLayoutEffect会在渲染的内容更新到DOM上之前进行,会阻塞DOM的更新
// useLayoutEffect： 与useEffect基本一致，不同的地方时，useLayoutEffect是同步
// 要注意的是useLayoutEffect在 DOM 更新之后，浏览器绘制之前，这样做的好处是可以更加方便的修改 DOM，获取 DOM 信息,
// 这样浏览器只会绘制一次，所以useLayoutEffect在useEffect之前执行
// 如果是useEffect的话 ，useEffect 执行在浏览器绘制视图之后，如果在此时改变DOM，有可能会导致浏览器再次回流和重绘。
// 除此之外useLayoutEffect的 callback 中代码执行会阻塞浏览器绘制

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
        setNumber(num => num - 1)
    }
    // 模拟 class 组件的 componentDidMount 
    // 第二个参数是 [] （不依赖于任何 state）
    useEffect(() => {
        console.log('子加载完了，在此发送一个 ajax 请求')
    }, [])
    // 模拟 class 组件的 componentDidMount 和 componentDidUpdate
    useEffect(() => {
        console.log('子组件加载或或更新了')
    })
    // 模拟 class 组件的 componentDidUpdate
    // 第二个参数就是依赖的 state
    useEffect(() => {
        console.log(number + 'number更新了')
    }, [number])
    // 模拟 class 组件的 componentDidMount
    useEffect(() => {
        let timerId = window.setInterval(() => {
            //console.log(Date.now())
        }, 1000)
        // 返回一个函数
        // 模拟 WillUnMount 组件销毁的时候 停止计时器
        return () => {
            console.log('子组件卸载了')
            window.clearInterval(timerId)
        }
    }, [])
    return (<div>
        <h3>函数组件</h3>
        <Button onClick={addNumber} >增加</Button>
        <span style={{ margin: '10px' }}>{number}</span>
        <Button onClick={subNumber} >减少</Button>
    </div>)
}
// 类组件一般写法
class UseEffect extends React.Component {
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
    componentDidMount () {
        console.log('父组件加载完了！')
    }
    componentDidUpdate () {
        console.log('父组件更新了！')
    }
    componentWillUnmount () {
        console.log('父组件卸载了！')
    }
    render () {
        let { number } = this.state
        return (<div style={{ textAlign: 'left' }}>
            <Highlight className='javascript'>
                {`
  useEffect：副作用，你可以理解为是类组件的生命周期，也是我们最常用的钩子，useEffect会在渲染的内容更新到DOM上后执行,不会阻塞DOM的更新

  1 模拟 class 组件的 componentDidMount 第二个参数是 [] （不依赖于任何 state） 只执行一次

  useEffect(() => {

    console.log('子加载完了，在此发送一个 ajax 请求')

  }, [])

  2 模拟 class 组件的 componentDidUpdate  只要有变化就会执行

  useEffect(() => {

    console.log('子组件加载或或更新了')

  })

  3 模拟 class 组件的 componentDidUpdate 第二个参数就是依赖的 state 依赖有变化就会更新

  useEffect(() => {

      console.log('number更新了')

  }, [number])

  4 模拟 class 组件的 componentWillUnmount

  useEffect(() => {

      let timerId = window.setInterval(() => {

          console.log(Date.now())

      }, 1000)

      // 返回一个函数 模拟 WillUnMount 组件销毁的时候 停止计时器

      return () => {

          console.log('子卸载了')

          window.clearInterval(timerId)

      }
      
  }, [])

  `}</Highlight>
            <Child />
            <div style={{ margin: '10px 0px 10px 0px' }}>
                <h3>class 类组件</h3>
                <Button onClick={this.addNumber.bind(this)} >增加</Button>
                <span style={{ margin: '10px' }}>{number}</span>
                <Button onClick={this.subNumber.bind(this)} >减少</Button>
            </div>
            <Highlight className='javascript'>
                {`  
  useEffect 用法总结

  1 模拟 componentDidMount    用例子 1

  2 模拟 componentDidUpdate   用例子 3
  
  3 模拟 componentWillUnmount 用例子 4
            
            `}</Highlight>
        </div>)
    }

}

export default UseEffect