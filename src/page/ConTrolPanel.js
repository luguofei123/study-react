import { Component } from 'react'
import Mybutton from './Mybutton'
class ConTrolPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            initValueList: [10, 20],
            sum: 30
        }
    }
    updateSum (value) {
        let sum = this.state.sum
        sum = sum + value
        this.setState({
            sum: sum
        })

    }
    render () {
        return (
            <div style={{ margin: '10px', textAlign: 'center' }}>
                <div>合计：{this.state.sum}</div>
                <Mybutton initValue={this.state.initValueList[0]} updateSum={this.updateSum.bind(this)} />
                <Mybutton initValue={this.state.initValueList[1]} updateSum={this.updateSum.bind(this)} />
                <Mybutton updateSum={this.updateSum.bind(this)} />
            </div>
        );
    }
}
export default ConTrolPanel;