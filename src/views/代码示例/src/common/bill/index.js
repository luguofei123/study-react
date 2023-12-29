/*
 * @Descripttion: 
 * @version: 
 * @Author: lugfa
 * @Date: 2023-08-30 10:02:33
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-30 10:38:25
 * @FilePath: /study-react/src/views/代码示例/src/common/bill/index.js
 */
// const treeData = viewModal.getNodeByCode('root').children // 模型结构
// this.setDivCode(treeData) // 组装实体数据的divCode
// 根据实体code获取到各区域ui数据
setDivCode = (data) => {
    data.forEach(item => {
        const { dataType, divCode, nodeType, name, enty, children, key: formKey, label, parentKey } = item
        if (name !== 'root' && dataType === 'enty' && enty) { // 查找存在实体的节点数据
            const { code } = enty.info
            this.divCodeList.forEach(ele => {
                if (ele.entyCode === code) {
                    const rCode = []
                    let rCodeStr = ''
                    if (enty.queryParams) { // 当前节点是否配置过滤条件，获取过滤的变量
                        const items = enty.queryParams.items
                        items.forEach(it => {
                            rCode.push(it.r.code)
                        })
                        rCodeStr = rCode.join(',')
                    }
                    const param = { // 组装数据
                        divCode: divCode,
                        key: formKey,
                        rCode: rCodeStr,
                        children: children,
                        label: label,
                        parentKey: parentKey,
                        nodeType: nodeType,
                        enty: enty
                    }
                    ele.data.push(param)
                }
            })
        } else {
            if (divCode === 'relateBtnBox') {
                this.relateFlag = true
                relationFun.initRelateAllAreaCde(children) // 初始化获取关联区域
            }
            if (children && children.length) {
                this.setDivCode(children)
            }
        }
    })
    return true
}

// 获取当前实体编码所在区域类型
getAreaType = (code) => {
    const item = this.divCodeList.find(ele => ele.entyCode === code)
    const eareaType = item?.type || ''
    return eareaType
}
// 获取各个区域的entyCode
getEntyCode = (type) => {
    const item = this.divCodeList.find(ele => ele.type === type)
    const entyCode = item.entyCode || ''
    return entyCode
}
// 获取各个区域的数据 -- 数组
getAreaData = (viewModal, type) => {
    let dataArr = []
    const entyValues = viewModal.getEntyValues()
    this.divCodeList.forEach(item => {
        if (item.type === type && item.data && item.data.length) {
            item.data.forEach(ele => {
                if (Array.isArray(entyValues[ele.key].data)) { // 判断是否是数组
                    dataArr.push(...entyValues[ele.key].data)
                } else {
                    dataArr.push(entyValues[ele.key].data)
                }
            })
        }
    })
    return dataArr
}
// 获取整个区域的数据对象 -- 对象
getAreaDataObj = (viewModal) => {
    let dataObj = {}
    const entyValues = viewModal.getEntyValues()
    this.divCodeList.forEach(item => {
        dataObj[item.type] = []
        const data = item.data
        data.forEach(ele => {
            if (Array.isArray(entyValues[ele.key].data)) { // 判断是否是数组
                dataObj[item.type].push(...entyValues[ele.key].data)
            } else {
                dataObj[item.type].push(entyValues[ele.key].data)
            }
        })
    })
    return dataObj
}
// 获取各区域实体ui元数据
getAreaDivCode = (type) => {
    let divCodeArr = []
    this.divCodeList.forEach(item => {
        if (item.type === type && item.data && item.data.length) {
            divCodeArr = item.data
        }
    })
    return divCodeArr
}