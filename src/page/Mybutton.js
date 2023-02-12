import { Component } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'antd';
import 'antd/dist/reset.css';

class Mybutton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: this.props.initValue || 0
        }

        Mybutton.propTypes = {
            initValue: PropTypes.number,
            updateSum: PropTypes.func

        }
        Mybutton.defaultProps = {
            initValue: 0,
            updateSum: f => f
        }

    }
    handlerClick (flag, e) {
        debugger
        let preValue = this.state.count
        flag === '+' ? preValue += 1 : preValue -= 1
        this.setState({
            count: preValue
        })

        this.props.updateSum(preValue - this.state.count)

    }
    render () {
        return (
            <div style={{ margin: '10px', textAlign: 'center' }}>
                <Button type="primary" onClick={this.handlerClick.bind(this, '+')}>Button+</Button>

                <span style={{ margin: '0 10px', display: 'inline-block', width: '200px' }}>{this.state.count}</span>
                <Button type="primary" onClick={this.handlerClick.bind(this, '-')}>Button-</Button>
            </div>
        );
    }
}
export default Mybutton;