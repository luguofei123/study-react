import React from 'react'
import { LayoutItem } from './LayoutItem.jsx'
export default class LayoutItemMemo extends React.Component {
    constructor(props) {
        super(props)
    }
    shouldComponentUpdate(nextProps, nextState) {
        // console.log(nextProps)
        const { item, provided, parentKey } = nextProps
        if (parentKey === undefined) {
            return true
        } else {
            //同一级重新渲染
            return item.parentKey === parentKey
        }
        return true
    }
    render() {
        return (
            <>
                <LayoutItem {...this.props} />
            </>
        )
    }
}