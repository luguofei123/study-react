import React, { } from "react";
const Content = React.createContext()
// 函数组件一般写法
// 注意：如果Consumer上一级一直没有Provider,则会应用defaultValue作为value。
// 只有当组件所处的树中没有匹配到Provider时，其defaultValue参数才会生效。
class Son extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            name: props.name,
            number: props.number
        }
    }
    render () {
        let { name, number } = this.state
        return <div>
            <h1> name: {name}</h1>
            <h1> number: {number}</h1>
            <Content.Consumer>
                {(value) => {
                    return <div {...value}>{value.name + value.number}</div>
                }}
            </Content.Consumer>
        </div>
    }
}
function Parent (props) {
    return <Content.Consumer>
        {(value) => <Son {...value} />}
    </Content.Consumer>
}
// 类组件一般写法
class CreatContent extends React.Component {
    constructor(props) {
        // 调用父组件的构造器函数，必须是当前构造器第一行代码
        super(props)
        this.state = {
            name: '鲁国飞',
            number: '18911563700',
        }
    }
    render () {
        let data = this.state
        return (<Content.Provider value={data}>
            <Parent />
        </Content.Provider>)
    }

}

export default CreatContent