/*
 * @Descripttion: 
 * @version: 
 * @Author: lugfa
 * @Date: 2023-08-30 10:02:33
 * @LastEditors: lugfa
 * @LastEditTime: 2023-09-01 18:27:38
 * @FilePath: /study-react/src/views/代码示例/src/common/bill/button.js
 */
// 新增时显示按钮
initBtn = (viewModal) => {
    this.tools = viewModal.getNodeByCode('btn-tools')
    const fromPage = commonMethod.getUrlParameter('fromPage')
    const tabNo = commonMethod.getUrlParameter('tabNo')
    const billId = viewModal.getBillId()
    const billData = viewModal.getDetailData(billId)  // billStatus
    const billStatus = billData?.billStatus // 单据状态
    this.tools.children.forEach(item => {
        if (viewModal.editMod() === 'new') {
            // 新增时，只显示暂存、保存、取消、删除
            if (
                item.divCode === 'btn-save' ||
                item.divCode === 'btn-moment-save' ||
                item.divCode === 'btn-cancel' ||
                item.divCode === 'btn-save-submit' ||
                item.divCode === 'btn-delete'
            ) {
                viewModal.showNode(item.divCode, true)
            } else {
                viewModal.showNode(item.divCode, false)
            }
        } else if (viewModal.editMod() === 'view') {
            if (item.divCode === 'btn-save' || item.divCode === 'btn-moment-save' || item.divCode === 'btn-save-submit') {
                viewModal.showNode(item.divCode, false)
            }
            // 查看状态下 有提交按钮的话需要显示提交按钮
            if (item.divCode === 'btn-submit' && billStatus !== 0) {
                viewModal.showNode(item.divCode, true)
            }
        } else if (viewModal.editMod() === 'edit') {
            // 隐藏修改
            if (item.divCode === 'btn-modify') {
                viewModal.showNode(item.divCode, false)
            }
            // 查看状态下 有提交按钮的话需要显示提交按钮
            if (item.divCode === 'btn-submit' && billStatus === 0) {
                viewModal.showNode(item.divCode, false)
            }
        }
    })
    // 审核单列表打开单据详情，显示按钮
    if (fromPage && fromPage.includes('SH')) {
        const verifyState = billData?.verifyState || ''  // 单据确认状态
        const collectStatus = billData?.collectStatus || ''
        // 审核单进来
        this.tools.children.forEach(item => {
            // 打印、取消按钮一直显示
            if (item.divCode === 'btn-print' || item.divCode === 'btn-cancel') {
                viewModal.showNode(item.divCode, true)
            } else {
                switch (tabNo) {
                    case 'tabDSH': // 待审核页签，显示保存（编辑态）、通过、退回、打印按钮 收单/取消收单
                        if (
                            item.divCode === 'btn-modify' ||
                            item.divCode === 'btn-audit' ||
                            item.divCode === 'btn-unaudit' ||
                            (viewModal.editMod() === 'edit' && item.divCode === 'btn-save') ||
                            (item.divCode === 'btn-uncollected' && collectStatus === 1) ||
                            (item.divCode === 'btn-collected' && collectStatus === 2)
                        ) {
                            viewModal.showNode(item.divCode, true)
                        } else {
                            viewModal.showNode(item.divCode, false)
                        }
                        break
                    case 'tabYSH': // 已审核页签，显示撤回（单据状态=审批中）、销审（单据状态=已终审）、打印按钮、授权按钮
                        if (
                            (item.divCode === 'btn-call-back' && billStatus !== 6) ||
                            (item.divCode === 'btn-un-audit' && billStatus === 6) ||
                            (item.divCode === 'btn-authorize' && billStatus === 6)
                        ) {

                            if (item.divCode === 'btn-un-audit' && billStatus === 6) {

                                if (verifyState === 1) {
                                    viewModal.showNode(item.divCode, true)
                                } else {
                                    viewModal.showNode(item.divCode, false)
                                }
                            } else {
                                viewModal.showNode(item.divCode, true)
                            }

                        } else {
                            viewModal.showNode(item.divCode, false)
                        }
                        break
                    default:
                        viewModal.showNode(item.divCode, false)
                        break
                }
            }
        })
    }
}
// 按钮事件监听
btnAction = (viewModal) => {
    const that = this
    viewModal.on('btn-directApprove', 'onClick', param => {
        this.customDirectApprove(viewModal)
    })
    // 自定义删除
    viewModal.on('btn-delete', 'onClick', param => {
        this.customDetele(viewModal)
        return true
    })
    // 自定义取消
    viewModal.on('btn-cancel', 'onClick', param => {
        this.customCancel(viewModal)
    })
    // 确认收单
    viewModal.on('btn-collected', 'onClick', param => {
        this.customCollected(viewModal)
    })
    // 取消收单
    viewModal.on('btn-uncollected', 'onClick', param => {
        this.customUncollected(viewModal)
    })
    // 表格上方的 智能识别
    viewModal.on('btn-orc', 'onClick', param => {
        this.showOrcDialog(viewModal, false)
    })
    // 保存并提交
    viewModal.on('btn-save-submit', 'onClick', param => {
        // 提交单据是否在控制期限
        if (!this.showTipsWhenNoPromise(viewModal, arBillCommonFun.allSystemConfig, arBillCommonFun?.billContext?.billTypeCode)) {
            return false
        }

        window.saveBillBefore = dataObj => {
            // 借款单保存前校验
            if (arBillCommonFun?.billContext?.billTypeCode.includes('LOAN_')) {
                if (!arLoanCommonFun.saveBillBeforeCheck(viewModal)) {
                    return false
                }
            }
            // 报销单 保存前费用和结算不能未0
            if (arBillCommonFun?.billContext?.billTypeCode.includes('EXP_')) {
                if (!arBillCommonFun.saveBillBeforeCheck(viewModal)) {
                    return false
                }
            }
            // 还款单必须关联至少一条借款单
            if (arBillCommonFun?.billContext?.billTypeCode.includes('REPAY_')) {
                if (!arRepayCommonFun.saveBillBeforeCheck(viewModal)) {
                    return false
                }
            }
            // 保存前 所有的列表数据需要排序
            this.orderAllDataBeforSave(viewModal)
            if (that.saveFlag) {
                that.saveFlag = false
                return { extendData: { flag: 1 } } // flag为1就不校验remind
            } else {
                return { extendData: { flag: 2 } } // 第一次点击保存flag为2
            }
        }
        window.saveBillAfter = dataObj => {
            if (dataObj.flag === 'error') {
                // 把yondif提示的信息关掉
                let yondifmsg = window.parent.document.getElementById('yondifmsg')
                if (yondifmsg) {
                    yondifmsg.remove()
                }
                if (dataObj.error.data.forbidInfo && dataObj.error.data.forbidInfo.length > 0) {
                    const error = dataObj.error.data.forbidInfo.map(item => <div>{item}</div>)
                    viewModal.Message.create({ content: <div style={{ textAlign: 'left' }}>单据检查未通过:{error}</div>, color: 'danger', duration: null })
                    return false
                }
                if (dataObj.error.data.reminderInfo && dataObj.error.data.reminderInfo.length > 0) {
                    viewModal.Modal.error({
                        title: '提示',
                        content: dataObj.error.data.reminderInfo.map(items => <p key={items}>{items}</p>),
                        onOk () {
                            that.saveFlag = true
                            viewModal.get('btn-save-submit').onClick()
                        }
                    })
                }
                return false
            } else {

                this.doWorkFlow(viewModal, '', dataObj.data.arBill, 'batchStart')
                setTimeout(() => {
                    viewModal.showNode('btn-save', false)
                    viewModal.showNode('btn-moment-save', false)
                    viewModal.showNode('btn-save-submit', false)
                    viewModal.showNode('btn-modify', true)
                    viewModal.showNode('btn-submit', true)
                    this.freshEntyValues(viewModal)
                    this.baseDataObjSave = dataObj.data.arBill    // 保存后要赋值，否则提交会失败
                    // 保存后更新脚部信息
                    billUtils.showFootInfo(viewModal)
                }, 1500)

            }
            return true

        }
        return true
    })
    // 保存单据
    viewModal.on('btn-save', 'onClick', param => {
        window.saveBillBefore = dataObj => {
            // 借款单保存前校验
            if (arBillCommonFun?.billContext?.billTypeCode.includes('LOAN_')) {
                if (!arLoanCommonFun.saveBillBeforeCheck(viewModal)) {
                    return false
                }
            }
            // 报销单 保存前费用和结算不能未0
            if (arBillCommonFun?.billContext?.billTypeCode.includes('EXP_')) {
                if (!arBillCommonFun.saveBillBeforeCheck(viewModal)) {
                    return false
                }
            }
            // 还款单必须关联至少一条借款单
            if (arBillCommonFun?.billContext?.billTypeCode.includes('REPAY_')) {
                if (!arRepayCommonFun.saveBillBeforeCheck(viewModal)) {
                    return false
                }
            }
            // 保存前 所有的列表数据需要排序
            this.orderAllDataBeforSave(viewModal)
            if (that.saveFlag) {
                that.saveFlag = false
                return { extendData: { flag: 1 } } // flag为1就不校验remind
            } else {
                return { extendData: { flag: 2 } } // 第一次点击保存flag为2
            }
        }
        window.saveBillAfter = dataObj => {
            if (dataObj.flag === 'error') {
                // 把yondif提示的信息关掉
                let yondifmsg = window.parent.document.getElementById('yondifmsg')
                if (yondifmsg) {
                    yondifmsg.remove()
                }
                if (dataObj.error.data.forbidInfo && dataObj.error.data.forbidInfo.length > 0) {
                    const error = dataObj.error.data.forbidInfo.map(item => <div>{item}</div>)
                    viewModal.Message.create({ content: <div style={{ textAlign: 'left' }}>单据检查未通过:{error}</div>, color: 'danger', duration: null })
                    return false
                }
                if (dataObj.error.data.reminderInfo && dataObj.error.data.reminderInfo.length > 0) {
                    viewModal.Modal.error({
                        title: '提示',
                        content: dataObj.error.data.reminderInfo.map(items => <p key={items}>{items}</p>),
                        onOk () {
                            that.saveFlag = true
                            viewModal.get('btn-save').onClick()
                        }
                    })
                }
                return false
            } else {
                setTimeout(() => {
                    viewModal.showNode('btn-save', false)
                    viewModal.showNode('btn-moment-save', false)
                    viewModal.showNode('btn-save-submit', false)
                    viewModal.showNode('btn-modify', true)
                    viewModal.showNode('btn-submit', true)
                    this.freshEntyValues(viewModal)
                    this.baseDataObjSave = dataObj.data.arBill    // 保存后要赋值，否则提交会失败
                    // 保存后更新脚部信息
                    billUtils.showFootInfo(viewModal)
                }, 1500)

            }
            return true

        }
        return true
    })
    // 暂存
    viewModal.on('btn-moment-save', 'onClick', param => {
        window.stagingBillBefore = dataObj => {
            this.orderAllDataBeforSave(viewModal)
            return true

        }
        window.stagingBillAfter = dataObj => {
            viewModal.showNode('btn-save', false)
            viewModal.showNode('btn-moment-save', false)
            viewModal.showNode('btn-save-submit', false)
            viewModal.showNode('btn-modify', true)
            this.freshEntyValues(viewModal)
            return true
        }

        return true
    })
    // 提交
    viewModal.on('btn-submit', 'onClick', param => {
        // 提交单据是否在控制期限
        if (!this.showTipsWhenNoPromise(viewModal, arBillCommonFun.allSystemConfig, arBillCommonFun?.billContext?.billTypeCode)) {
            return false
        }
        this.doWorkFlow(viewModal, '', '', 'batchStart')
    })
    // 退回
    viewModal.on('btn-unaudit', 'onClick', param => {
        this.doWorkFlow(viewModal, '', '', 'batchBack')
    })
    // 撤回
    viewModal.on('btn-call-back', 'onClick', param => {
        this.doWorkFlow(viewModal, '', '', 'batchCancel')
    })
    // 销审
    viewModal.on('btn-un-audit', 'onClick', param => {
        this.doWorkFlow(viewModal, '', '', 'batchActivate')
    })
    // 通过
    viewModal.on('btn-audit', 'onClick', param => {
        this.doWorkFlow(viewModal, '', '', 'batchApprove')
    })
    //  授权
    viewModal.on('btn-authorize', 'onClick', param => {
        arBillCommonFun.openModal({ data: { billNo: '', remark: '' } }, viewModal)
    })
    // 点击修改显示保存和暂存
    viewModal.on('btn-modify', 'onClick', param => {

        // 提交单据是否在控制期限
        if (!this.showTipsWhenNoPromise(viewModal, arBillCommonFun.allSystemConfig, arBillCommonFun?.billContext?.billTypeCode)) {
            return false
        }
        viewModal.editMod('edit')
        viewModal.setBillEditable(1)
        viewModal.showNode('btn-modify', false)
        viewModal.showNode('btn-submit', false)
        viewModal.showNode('btn-save', true)
        viewModal.showNode('btn-moment-save', true)
        viewModal.showNode('btn-save-submit', true)
        if (viewModal.getNodeByCode('schCard')) {
            // 行程归集
            const singleList = arBillCommonFun.getAreaDivCode('DETAIL')
            const mutiList = arBillCommonFun.getAreaDivCode('DETAILMUTI')
            viewModal.setDisabled({ divCode: 'generate-expense', disabled: false })
            viewModal.setDisabled({ divCode: 'trip-confirm', disabled: true })
            // viewModal.setDisabled({divCode: 'trip-cancel', disabled: true})
            if (!travelFun.isMulti) {
                viewModal.setDisabled({ divCode: travelFun.btnAddOtherExp, disabled: true })
            }
            // 行程可编辑，费用不能编辑
            travelFun.setDisabled(viewModal, travelFun.tripDivCode, 'isEdit')
            if (!travelFun.isMulti) {
                travelFun.setDisabled(viewModal, singleList)
            } else {
                travelFun.setDisabled(viewModal, mutiList)
            }
        }
    })
}