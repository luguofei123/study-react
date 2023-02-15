import React, { } from "react";
// 多页签
function LCDBtnToolbar (pros) {
    debugger
    let data = pros.uidata
    return (<span className={pros.className}>
        {data.children.map(i => {
            return <span key={i.key} style={{ margin: '20px' }}>{i.label}</span>
        })}
    </span>)
}

export default LCDBtnToolbar