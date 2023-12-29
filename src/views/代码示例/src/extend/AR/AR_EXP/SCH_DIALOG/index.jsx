/*
 * @Descripttion: 差旅费-新增、编辑行程弹框
 * @version:
 * @Author: jiamf1
 * @Date: 2023-04-28 13:33:23
 * @LastEditors: lugfa
 * @LastEditTime: 2023-06-27 18:56:30
 */
import commonMethod from "@/common/utils";
import actions from '@/common/const/actions.json'
// import service from '@/common/const/service'

export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([], actions.sch_dialog),
        divCode: '', // 区域divCode
        divCodeEnty: '', // 实体数据的divCode
        entydata: {}, // 行程数据
        mounted () {
            let type = ''
            if (window.parent.schType) {
                type = window.parent.schType
            } else {
                type = window.parent[0].schType
            }
            result.entydata = viewModal.getEntyValues()
            for (let i in result.entydata) {
                if (typeof result.entydata[i] === 'object' && result.entydata[i].enty) {
                    // 判断是带有实体的数据
                    result.divCodeEnty = i
                }
            }
            let data = {}
            if (window.parent.editData) {
                data = window.parent.editData
            } else {
                data = window.parent[0].editData
            }
            if (type === 'editSch') {
                // 编辑的行程数据
                result.setEditData(data)
            }

        },
        // 编辑的行程数据回显
        setEditData (data) {
            viewModal.setEntyValues(result.divCodeEnty, data) // 赋值
            viewModal.reloadWidgetData(result.divCodeEnty) // 刷新组件
        },
        // 确认按钮
        dialogConfirm () {
            const checkList = viewModal.validateCheck() // 检查行程表单必填项
            checkList.then(errorList => {
                if (errorList.length) {
                    viewModal.Message.error('请输入必填项！')
                    return false
                }
                const parentData = window.parent
                let travelRow = {}
                for (let i in result.entydata) {
                    if (typeof result.entydata[i] === 'object' && result.entydata[i].enty) {
                        // 判断是带有实体的数据
                        travelRow = JSON.parse(JSON.stringify(result.entydata[i].data))
                    }
                }
                if (parentData.getTravelData) {
                    window.parent.getTravelData('confirm', travelRow)
                } else {
                    window.parent[0].getTravelData('confirm', travelRow)
                }
            })
        },
        // 取消按钮
        dialogCancel () {
            if (window.parent.getTravelData) {
                window.parent.getTravelData('cancel')
            } else {
                window.parent[0].getTravelData('cancel')
            }
        }
    }
    return result
}
