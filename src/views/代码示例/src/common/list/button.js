/*
 * @Descripttion: 不同页签权限按钮
 * @version: 
 * @Author: lugfa
 * @Date: 2023-08-29 13:56:32
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-29 14:21:09
 * @FilePath: /study-react/src/views/代码规范/button.js
 */
// 工具栏操作按钮显示逻辑
showTopButtonLogic = (viewModal) => {
    // 表格顶部的按钮显示
    if (viewModal.getNodeByCode('btn-tools')) {
        let btnList = viewModal.getNodeByCode('btn-tools').children
        let btnCodeArr = btnList.map(i => i.divCode)
        this.showButton(viewModal, btnCodeArr, false)
        let tabCode = listTableFun.searchParams?.externalData?.tabNo
        switch (tabCode) {
            case 'tabZC':
                this.showButton(viewModal, ['btn-dropdown', 'btn-delete', 'btn-print', 'btn-export'], true)
                break
            case 'tabDTJ':
                this.showButton(viewModal, ['btn-dropdown', 'btn-submit', 'btn-delete', 'btn-print', 'btn-export'], true)
                break
            case 'tabYTJ':
                this.showButton(viewModal, ['btn-call-back', 'btn-print', 'btn-export'], true)
                break
            case 'tabSHZ':
                this.showButton(viewModal, ['btn-print', 'btn-export'], true)
                break
            case 'tabYZS':
                this.showButton(viewModal, ['btn-print', 'btn-export'], true)
                break
            case 'tabDSH':
                this.showButton(viewModal, ['btn-audit', 'btn-unaudit', 'btn-print', 'btn-export'], true)
                break
            case 'tabYSH':
                this.showButton(viewModal, ['btn-call-back', 'btn-print', 'btn-export'], true)
                break
            case 'tabALL':
                this.showButton(viewModal, ['btn-print', 'btn-export', 'btn-import'], true)
                break
            case 'tabALLAudit':
                this.showButton(viewModal, ['btn-print', 'btn-export'], true)
                break
            case 'tabUncollect':
                this.showButton(viewModal, ['btn-startCollected', 'btn-collected', 'btn-export'], true)
                break
            case 'tabCollected':
                this.showButton(viewModal, ['btn-uncollected', 'btn-export'], true)
                break
            default:
                break

        }

    }
}

//  表格行上的按钮显示逻辑
showRowButtonLogic = (viewModal, row, rowIndex, rowTools) => {
    // 表格行上的按钮显示
    let newRowTools = []
    if (viewModal.getNodeByCode('btn-table-row-tools')) {
        let tabCode = listTableFun.searchParams?.externalData?.tabNo
        let btnCodeArr = []
        switch (tabCode) {
            case 'tabZC':
                btnCodeArr = ['btn-edit', 'btn-copy']
                break
            case 'tabDTJ':
                // 如果是退回的单子 要显示流程，否则不显示流程 btn-flow
                if (row.procinstId) {
                    btnCodeArr = ['btn-edit', 'btn-copy', 'btn-flow']
                } else {
                    btnCodeArr = ['btn-edit', 'btn-copy']
                }
                break
            case 'tabYTJ':
                btnCodeArr = ['btn-copy', 'btn-flow']
                break
            case 'tabSHZ':
                btnCodeArr = ['btn-copy', 'btn-flow']
                break
            case 'tabYZS':
                // 报销，借款  办结 和 取消办结  btn-row-conclude 和 btn-row-unconclude
                if (row.isEnd === 1) {
                    btnCodeArr = ['btn-copy', 'btn-flow', 'btn-row-unconclude']
                } else if (row.isEnd === 2) {
                    btnCodeArr = ['btn-copy', 'btn-flow', 'btn-row-conclude']
                } else {
                    btnCodeArr = []
                }
                break
            case 'tabDSH':
                btnCodeArr = ['btn-edit', 'btn-copy', 'btn-flow', 'btn-row-audit', 'btn-row-unaudit']
                break
            case 'tabYSH':
                btnCodeArr = ['btn-copy', 'btn-flow', 'btn-row-call-back', 'btn-row-un-audit']
                if (row.billStatus === 6) {
                    if (row.verifyState === 1) {
                        btnCodeArr = ['btn-copy', 'btn-flow', 'btn-row-un-audit']
                    } else {
                        btnCodeArr = ['btn-copy', 'btn-flow']
                    }
                } else {
                    btnCodeArr = ['btn-copy', 'btn-flow', 'btn-row-call-back']
                }
                break
            case 'tabALL':
                btnCodeArr = ['btn-copy']
                break
            case 'tabALLAudit':
                btnCodeArr = ['btn-copy', 'btn-flow']
                break
            default:
                btnCodeArr = []
                break
        }
        // 还款单没有复制按钮
        if (row.billCateCode.includes('REPAY')) {
            btnCodeArr = btnCodeArr.filter(code => code !== 'btn-copy')
        }
        newRowTools = rowTools.filter(item => {
            return btnCodeArr.indexOf(item.divCode) !== -1
        })

    }
    return newRowTools
}