import React, { } from "react";
// 多页签
function LCDCard (pros) {
    debugger
    let data = pros.uidata
    return (<div className={pros.className}>
        <span>{data.label}</span>
        {pros.children}
    </div>)
}

export default LCDCard