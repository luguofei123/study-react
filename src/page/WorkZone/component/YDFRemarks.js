import React, { } from "react";
// 多页签
function YDFRemarks (pros) {
    debugger
    let data = pros.uidata
    return (<>
        {data.children.map(i => {
            return <span key={i.key} style={{ margin: '20px' }}>{i.props.brafteditor}</span>
        })}
    </>)
}

export default YDFRemarks