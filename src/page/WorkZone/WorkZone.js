
import React from "react";
import uidata from './uidata'
import TagName from './TagName'

class WorkZone extends React.Component {
    render () {
        // 解析方法
        const parser = (data) => {

            let visibledData = []
            visibledData = data
            return visibledData.map(it => {
                let item = JSON.parse(JSON.stringify(it))
                if (item.children && item.children.length) {
                    if (item.parseChild === 0) {
                        return <TagName className={`${item.locked ? '' : `wx-${item.key}`}`} key={item.key} uidata={item} >{item.label + '组件：' + item.name}</TagName>
                    } else {
                        return <TagName className={`${item.locked ? '' : `wx-${item.key}`}`} key={item.key} uidata={item}>{parser(item.children)}</TagName>
                    }

                } else {
                    return <TagName className={`${item.locked ? '' : `wx-${item.key}`}`} key={item.key} uidata={item} >{item.label + '组件：' + item.name}</TagName>
                }
            })
        }

        let uidata1 = uidata.data.uidata

        let group = parser(uidata1)

        return (
            group
        )
    }
}

export default WorkZone