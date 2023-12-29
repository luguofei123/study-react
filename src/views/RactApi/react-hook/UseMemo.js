import React, { useState, useEffect, useMemo } from "react";
import Highlight from 'react-highlight'
import { Button } from 'antd';
// **useMemo**:与`memo`的理念上差不多，都是判断是否满足当前的限定条件来决定是否执行`callback`函数，
// 而`useMemo`的第二个参数是一个数组，通过这个数组来判定是否更新回掉函数
// 当一个父组件中调用了一个子组件的时候，父组件的 state 发生变化，会导致父组件更新，而子组件虽然没有发生改变，但也会进行更新。
// 简单的理解下，当一个页面内容非常复杂，模块非常多的时候，函数式组件会**从头更新到尾**，只要一处改变，
// 所有的模块都会进行刷新，这种情况显然是没有必要的。
// 我们理想的状态是各个模块只进行自己的更新，不要相互去影响，那么此时用`useMemo`是最佳的解决方案。
// 这里要尤其注意一点，**只要父组件的状态更新，无论有没有对自组件进行操作，子组件都会进行更新**，`useMemo`就是为了防止这点而出现的

// useMemo是用来缓存计算属性的，它会在发现依赖未发生改变的情况下返回旧的计算属性值的地址。
// useMemo 绝不是用的越多越好，缓存这项技术本身也需要成本。
// useMemo的使用场景之一是:只需要给拥有巨大计算量的计算属性缓存即可。
// useMemo的另一个使用场景是：当有计算属性被传入子组件，并且子组件使用了react.memo进行了缓存的时候,为了避免子组件不必要的渲染时使用

// 作用：
// 首先useMemo它使用来做缓存用的，只有当一个依赖项改变的时候才会发生变化，否则拿缓存的值，就不用在每次渲染的时候再做计算
// 场景：
// 既然是用作缓存来用，那场景就可能有：
// 比如说当你登陆之后，你的个人信息一般是不会变的，当你退出登陆，重新输入另外一个人的账号密码之后，这个时候个人信息可能就变了，
// 那这样我就可以把账号和密码`两个作为依赖项，当他们变了，那就更新个人信息，否则拿缓存的值，从而达到优化的目的
// 也许有时候，你可能需要从A页面跳转到B页面，并携带一些参数，那就会从路由下手，
// 类似于：http://localhost:3000/home/:id/:name或者http://localhost:3000//home?id=123&name=zhangsan，
// 然后B页面基于这些参数做一些查询操作，那路由不变，其实这些查询出来的数据应该是不变的（当然其中包含增删改操作除外），
// 那就可以把这些路由参数当作依赖项，只有依赖项变了，该页面的数据才会变

// 1. useMemo的作用
// useMemo相当于vue的计算属性，只有当它所依赖的值发生变化的时候，useMemo才会重新返回一个新的值。
// 2. useMemo的返回值
// 如果用useMemo返回一个数据的话， 而这个数据里面一些是常量，一些是变量的话，只有对应的变量会发生变化，
// 而其它的常量是不会变化的，所以如果要对useMemo的返回值进行一些splice操作的话，是无法起作用的。

// memo 使用例子  `true`则不更新，为`false`更新
// const isEqual(prevProps, nextProps) {
//     // 自定义对比方法
//   }

//   const MemoriedComp = React.memo(Comp, isEqual);


// 因为其自己本身已经定义好的数据结构是没办法改变的，改变的只是里面的变量
// 函数组件一般写法

// const Son = memo((pros) => {
//     console.log(111111)
//     return <div>
//         <Button>{pros.count1}</Button>
//         <Button>{pros.count2}</Button>
//     </div>
// })
function Child (pros) {
    let [number, setNumber] = useState(1)
    let [count1, setCount1] = useState(100)
    let [count2, setCount2] = useState(1000)
    const addNumber = () => {
        setNumber(num => {
            debugger
            return num + 1
        })
    }
    const subNumber = () => {
        setNumber(num => num + 1)
    }
    // 通过usememo后，只有count改变后才会重新计算
    const useMemoMessage1 = useMemo(() => {
        console.log('我计算了一遍useMemoMessage1')
        return 'useMemoMessage1=' + count1
    }, [count1])
    // 对比数据 只要组件重新渲染，旧会执行一次
    const useMemoMessage2 = () => {
        console.log('我计算了一遍useMemoMessage2')
        return 'useMemoMessage2=' + count2
    }
    useEffect(() => {
        console.log('子组件1重新渲染')
    })
    return (<div>
        <h3>函数子组件</h3>
        <Button onClick={addNumber} >增加</Button>
        <span style={{ margin: '10px' }}>{number}</span>
        <Button onClick={subNumber} >减少</Button>
        <div style={{ margin: '10px 0' }}>
            <Highlight className='javascript'>
                {`
    通过usememo后，只有count改变后才会重新计算

    const useMemoMessage1 = useMemo(() => {

        console.log('我计算了一遍useMemoMessage1')

        return 'useMemoMessage1=' + count1

    }, [count1])

    对比数据 只要组件重新渲染，就会执行一次

    const useMemoMessage2 = () => {

        console.log('我计算了一遍useMemoMessage2')

        return 'useMemoMessage2=' + count2

    }
  `}</Highlight>
            <Button onClick={() => { setCount1(count => count + 1) }} >测试memo count1++</Button>
            <span style={{ margin: '10px 10px' }}>{count1}</span>
            <span >{useMemoMessage1}</span>
            <div style={{ margin: '10px 0px' }}>
                <Button onClick={() => { setCount2(count => count + 1) }} >测试memo count2++</Button>
                <span style={{ margin: '10px 10px' }}>{count2}</span>
                <span style={{ margin: '10px 10px' }}>{useMemoMessage2()}</span>
            </div>
            {/* <Son count1={useMemoMessage1} count2={useMemoMessage2()} /> */}
        </div>
    </div>)
}
// 类组件一般写法
class UseMemo extends React.Component {
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
        return (<div style={{ textAlign: 'left' }}>
            <Highlight className='javascript'>
                {`
  useMemo：判断是否满足当前的限定条件来决定是否执行callback函数

  语法： const value = useMemo(callback,[dep]);

  当依赖dep 发生变化的时候才执行callback,callback返回的是一个计算结果； dep没有发生变化，组件将直接使用缓存的结果；
  `}</Highlight>
            <Child />
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <h3>class 父类组件</h3>
                <Button onClick={this.addNumber.bind(this)} >增加</Button>
                <span style={{ margin: '10px' }}>{number}</span>
                <Button onClick={this.subNumber.bind(this)} >减少</Button>
            </div>
            <Highlight className='javascript'>
                {`  
  useMemo 用法总结

  1 useMemo 是用来缓存计算属性的，它会在发现依赖未发生改变的情况下返回旧的计算属性值的地址

  2 useMemo 绝不是用的越多越好，缓存这项技术本身也需要成本。
  
  3 useMemo 的使用场景之一是:只需要给拥有巨大计算量的计算属性缓存即可。

  4 useMemo 的另一个使用场景是：当有计算属性被传入子组件，并且子组件使用了react.memo进行了缓存的时候,为了避免子组件不必要的渲染时使用
            
            `}</Highlight>
        </div>)
    }

}

export default UseMemo