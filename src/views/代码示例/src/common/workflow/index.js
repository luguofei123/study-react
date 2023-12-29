/*
 * @Descripttion: 工作流和自定义通用方法
 * @version: 
 * @Author: lugfa
 * @Date: 2023-08-29 13:56:32
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-30 09:42:40
 * @FilePath: /study-react/src/views/代码示例/workflow.js
 */

// 自定义删除
customDetele = (btn, rowData) => {
    listBtnFun.customListDetele(viewModal, btn, rowData)
}
// 自定义复制
customCopy = (btn, rowData) => {
    listBtnFun.customListCopy(viewModal, btn, rowData)
}
// 自定义编辑
customEditor = (btn, rowData) => {
    listBtnFun.customEditor(viewModal, btn, rowData)
}
// 自定义查看
customView = (btn, rowData) => {
    listBtnFun.customView(viewModal, btn, rowData)
}
// 自定义提交
customWorkFlowStart = (btn, rowData) => {
    listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchStart')
}
// 自定义收回
customWorkFlowCancel = (btn, rowData) => {
    listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchCancel')
}
// 自定义审批
customWorkFlowApprove = (btn, rowData) => {
    listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchApprove')
}
// 自定义销审
customWorkFlowActivate = (btn, rowData) => {
    listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchActivate')
}
// 自定义驳回
customWorkFlowBack = (btn, rowData) => {
    listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchBack')
}
// 自定义作废
customWorkFlowDiscard = (btn, rowData) => {
    listBtnFun.doWorkFlow(viewModal, btn, rowData, 'batchDiscard')
}
// 自定义流程弹窗
customWorkOpenWorkFlow = (btn, rowData) => {
    listBtnFun.doWorkFlow(viewModal, btn, rowData, 'workflowTraceFull')
}
// 自定义办结
customConclude = (btn, rowData) => {
    listBtnFun.customConclude(viewModal, btn, rowData)
}
// 自定义取消办结
customUnconclude = (btn, rowData) => {
    listBtnFun.customUnconclude(viewModal, btn, rowData)
}
// 自定义开始收单
customStartCollected = (btn, rowData) => {
    listBtnFun.customStartCollected(viewModal, btn, rowData)
}
// 自定义确认收单
customCollected = (btn, rowData) => {
    listBtnFun.customCollected(viewModal, btn, rowData)
}
// 自定义取消收单
customUncollected = (btn, rowData) => {
    listBtnFun.customUncollected(viewModal, btn, rowData)
}
// 工作流具体调用
doWorkFlowAction = (viewModal, btn, rowData, batchWorkFlowType) => {
    // 提交
    if (batchWorkFlowType === 'batchStart') {
        // 提交单据是否在控制期限
        if (!btnFun.showTipsWhenNoPromise(viewModal, listTableFun.allSysConfig, data[0].billTypeCode)) {
            return false
        }
        let obj = {}
        data.forEach(ele => {
            obj[ele.id] = ele.billTypeCode
        })
        // 提交前审核校验
        viewModal.post({
            url: `/${service.BASE_BE_URL}/ar/bill/batchSubmitBeforeCheck`,
            data: obj,
            waitfor: true
        }).then(res => {
            if (res.error === false) {
                const resData = res.data
                if (resData && Object.keys(resData).length) {
                    let forbidInfo = []
                    let reminderInfo = []
                    Object.keys(resData).forEach(key => {
                        if (resData[key].forbidInfo && resData[key].forbidInfo.length > 0) {
                            resData[key].forbidInfo.unshift('单据编号：' + key)
                            forbidInfo.push(resData[key].forbidInfo)
                        }
                        if (resData[key].reminderInfo && resData[key].reminderInfo.length > 0) {
                            resData[key].reminderInfo.unshift('单据编号：' + key)
                            reminderInfo.push(resData[key].reminderInfo)
                        }
                    })
                    if (forbidInfo.length > 0) {
                        const error = forbidInfo.map(item => <div>{item}</div>)
                        viewModal.Message.create({ content: <div style={{ textAlign: 'left' }}>单据检查未通过:{error}</div>, color: 'danger', duration: null })

                    } else if (reminderInfo.length > 0) {
                        viewModal.Modal.error({
                            title: '提示',
                            content: reminderInfo.map(items => <p key={items}>{items}</p>),
                            onOk () {
                                viewModal.doBatchWorkFlow({
                                    fn: batchWorkFlowType,
                                    data: baseDataObj,
                                    _cb: msg => {
                                        if (msg.error === 0) {
                                            that.completeWorkFlow(viewModal)
                                        }
                                    }
                                })
                            }
                        })

                    } else {
                        // 工作流程
                        viewModal.doBatchWorkFlow({
                            fn: batchWorkFlowType,
                            data: data,
                            _cb: msg => {
                                if (msg.error === 0) {
                                    this.completeWorkFlow(viewModal)
                                }
                            }
                        })
                    }

                } else {
                    // 工作流程
                    viewModal.doBatchWorkFlow({
                        fn: batchWorkFlowType,
                        data: data,
                        _cb: msg => {
                            if (msg.error === 0) {
                                this.completeWorkFlow(viewModal)
                            }
                        }
                    })
                }
            }
        })
    } else if (batchWorkFlowType === 'batchActivate') {
        //销审
        let obj = {
            billType: data[0].billTypeCode,
            id: data[0].id
        }
        viewModal.post({
            url: `/${service.BASE_BE_URL}/ar/bill/checkBeforeRestart`,
            data: obj,
            waitfor: true
        }).then(res => {
            if (res.error === false) {
                const resData = res.data
                if (resData && Object.keys(resData).length) {
                    let forbidInfo = []
                    let reminderInfo = []
                    Object.keys(resData).forEach(key => {
                        if (resData[key].forbidInfo && resData[key].forbidInfo.length > 0) {
                            resData[key].forbidInfo.unshift('单据编号：' + key)
                            forbidInfo.push(resData[key].forbidInfo)
                        }
                        if (resData[key].reminderInfo && resData[key].reminderInfo.length > 0) {
                            resData[key].reminderInfo.unshift('单据编号：' + key)
                            reminderInfo.push(resData[key].reminderInfo)
                        }
                    })
                    if (forbidInfo.length > 0) {
                        const error = forbidInfo.map(item => <div>{item}</div>)
                        viewModal.Message.create({ content: <div style={{ textAlign: 'left' }}>单据检查未通过:{error}</div>, color: 'danger', duration: null })

                    } else if (reminderInfo.length > 0) {
                        viewModal.Modal.error({
                            title: '提示',
                            content: reminderInfo.map(items => <p key={items}>{items}</p>),
                            onOk () {
                                viewModal.doWorkFlow({
                                    fn: 'activate',
                                    data: data[0],
                                    _cb: (msg) => {
                                        if (msg.error === 0 || msg === 2) {
                                            this.completeWorkFlow(viewModal)
                                        }
                                    }
                                })
                            }
                        })

                    } else {
                        // 工作流程
                        viewModal.doWorkFlow({
                            fn: 'activate',
                            data: data[0],
                            _cb: (msg) => {
                                if (msg.error === 0 || msg === 2) {
                                    this.completeWorkFlow(viewModal)
                                }
                            }
                        })
                    }

                } else {
                    viewModal.doWorkFlow({
                        fn: 'activate',
                        data: data[0],
                        _cb: (msg) => {
                            if (msg.error === 0 || msg === 2) {
                                this.completeWorkFlow(viewModal)
                            }
                        }
                    })
                }
            }
        })

    } else {
        viewModal.doBatchWorkFlow({
            fn: batchWorkFlowType,
            data: data,
            _cb: (msg) => {
                if (msg.error === 0 || msg === 2) {
                    this.completeWorkFlow(viewModal)
                }
            }
        })
    }
}