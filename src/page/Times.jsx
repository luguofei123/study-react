import { Component } from 'react'
import Time from './Time';
class Times extends Component {

    render () {
        return (
            <div style={{ margin: '10px', textAlign: 'center' }}>
                <Time />
                <Time />
                <Time />
            </div>
        );
    }
}
export default Times;