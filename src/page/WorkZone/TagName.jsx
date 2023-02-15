
import React from "react";
class TagName extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render () {
        const { children } = this.props
        let props = { ...this.props }
        const { width = '100%', marginleft = 0, marginright = 0, margintop = 0, marginbottom = 0 } = this.props || {}
        let styles = { width, height: '100%', marginleft, marginright, margintop, marginbottom }
        const bodyStyle = { ...styles, background: props.body_color || 'transparent' }
        return (<span style={bodyStyle} id={this.props.uidata.key}>{children}</span>)
    }
}

export default TagName