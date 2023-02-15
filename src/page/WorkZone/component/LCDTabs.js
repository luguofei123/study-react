import React, { } from "react";
// 多页签
function LCDTabs (pros) {
    debugger
    let data = pros.uidata
    return (<div className={pros.className}>
        {data.children.map(i => {
            return <span key={i.key} style={{ margin: '20px' }}>{i.label}</span>
        })}
    </div>)
}

export default LCDTabs