import React, { } from "react";
// Children: 提供处理this.props.children不透明数据结构的实用程序.
// 却发现我们便利的三个元素被包了一层，像这种数据被称为不透明，我们想要处理这种数据，就要以来React.Chilren 来解决
// 函数组件一般写法
// 打印出来的是透明的数据
function Child1 (props) {
    console.log(props.children)
    return props.children
}
// 打印出来的是不透明数据
function Child2 (props) {
    console.log(props.children)
    return props.children
}
// 处理后 打印出来的是透明的数据
function Child3 (props) {
    const res = React.Children.map(props.children, (item) => item)
    console.log(res)
    return res
}
// Children.forEach 
// Children.forEach：与Children.map类似，不同的是Children.forEach并不会返回值，而是停留在遍历阶段
function Child4 (props) {
    React.Children.forEach(props.children, (item) => console.log(item))
    return props.children
}
// Children.count 返回Child内的总个数，等于回调传递给map或forEach将被调用的次数
function Child5 (props) {
    const res = React.Children.count(props.children)
    console.log(res) // 4
    return props.children
}
// Children.only
// 验证Child是否只有一个元素，如果是，则正常返回，如果不是，则会报错
function Child6 (props) {
    const res = React.Children.only(props.children)
    console.log(res)
    return props.children
}
// Children.toArray
// Children.toArray：以平面数组的形式返回children不透明数据结构，每个子元素都分配有键。
// 如果你想在你的渲染方法中操作子元素的集合，特别是如果你想this.props.children在传递它之前重新排序或切片，这很有用。
// 这里需要注意的是key,经过Children.toArray处理后，会给原本的key添加前缀，以使得每个元素key的范围都限定在此函数入参数组的对象内。
function Child7 ({ children }) {
    console.log(`原来数据:`, children)
    const res = React.Children.toArray(children)
    console.log(`扁平后的数据:`, res)
    return res
}
// 类组件一般写法
class Children extends React.Component {
    constructor(pros) {
        // 调用父组件的构造器函数，必须是当前构造器第一行代码
        super(pros)
        this.state = {
            number: 1,
            content: '测试',
        }
    }
    render () {
        return (<div>
            <Child1>
                <p>大家好，我是刘德华1</p>
                <p>大家好，我是刘德华1</p>
                <p>大家好，我是刘德华1</p>
            </Child1>
            <Child2>
                {[1, 2, 3].map((item, index) => <p key={index}>大家好，我是刘德华2</p>)}
                <p>大家好，我是刘德华2</p>
            </Child2>
            <Child3>
                {[1, 2, 3].map((item, index) => <p key={index}>大家好，我是刘德华3</p>)}
                <p>大家好，我是刘德华3</p>
            </Child3>
            <Child4>
                {[1, 2, 3].map((item, index) => <p key={index}>大家好，我是刘德华4</p>)}
                <p>大家好，我是刘德华4</p>
            </Child4>
            <Child5>
                {[1, 2, 3].map((item, index) => <p key={index}>大家好，我是刘德华5</p>)}
                <p>大家好，我是刘德华5</p>
            </Child5>
            <Child6>
                <p>大家好，我是刘德华6</p>
                {/* <p>大家好，我是刘德华6</p> */}
            </Child6>
            <Child7>
                {[1, 2, 3].map((item) => [5, 6].map((ele) => <p key={`${item}-${ele}`}>大家好，我是小杜杜</p>))}
                <p>大家好，我是小杜杜</p>
            </Child7>
        </div>)
    }

}

export default Children