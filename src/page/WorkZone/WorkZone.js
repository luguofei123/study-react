
import React from "react";
import uidata from './uidata'
import widgets from './component/index'
import TagName from './TagName'

class WorkZone extends React.Component {
    render () {
        // 解析方法
        const parser = (data) => {

            let visibledData = []
            visibledData = data
            return visibledData.map(it => {
                const COMP = widgets[it.name] || TagName
                let item = JSON.parse(JSON.stringify(it))
                if (item.children && item.children.length) {
                    if (item.parseChild === 0) {
                        return <COMP className={`${item.locked ? it.name : `wx-${item.key}-${it.name}`}`} key={item.key} uidata={item} ></COMP>
                    } else {
                        return <COMP className={`${item.locked ? it.name : `wx-${item.key}-${it.name}`}`} key={item.key} uidata={item}>{parser(item.children)}</COMP>
                    }


                } else {
                    return <COMP className={`${item.locked ? it.name : `wx-${item.key}-${it.name}`}`} key={item.key} uidata={item} >{item.label + '组件：' + item.name}</COMP>
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