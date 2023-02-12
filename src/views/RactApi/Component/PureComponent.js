import React from "react";

// `PureComponent`可能会因深层的数据不一致而产生错误的否定判断。所以慎用
// 组件会进行浅比较，对象的指针一样，不会触发变化 从而导致默认的`shouldComponentUpdate`结果返回false，界面得不到更新，要谨慎使用
// 在生命周期内强制让shouldComponentUpdate 返回true，界面可以得到更新
class Component extends React.PureComponent {
    constructor(pros) {
        // 调用父组件的构造器函数，必须是当前构造器第一行代码
        super(pros)
        this.state = {
            data: {
                number: 1,
            }
        }
    }
    // PureComponent内使用shouldComponentUpdate会报错
    // shouldComponentUpdate () {
    //     return true
    // }
    addNumber () {
        const { data } = this.state
        data.number++
        this.setState({ data })
        // this.setState({ data: { ...data } })
    }
    subNumber () {
        const { data } = this.state
        data.number--
        this.setState({ data })
        // this.setState({ data: { ...data } })
    }
    render () {
        let { number } = this.state.data
        return (<div>
            <div>
                <h3>PureComponent 组件</h3>
                <button onClick={this.addNumber.bind(this)} >增加</button>
                <span style={{ margin: '10px' }}>{number}</span>
                <button onClick={this.subNumber.bind(this)} >减少</button>
            </div>
        </div>)
    }

}

export default Component