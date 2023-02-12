import { Component } from 'react'
class Time extends Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }

    componentDidMount () {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount () {
        clearInterval(this.timerID);
    }

    tick () {
        this.setState({
            date: new Date()
        });
    }
    render () {
        return (
            <div style={{ margin: '10px', textAlign: 'center' }}>
                {this.state.date.toLocaleTimeString()}
            </div>
        );
    }
}
export default Time;