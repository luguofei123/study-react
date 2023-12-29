/*
 * @Descripttion:
 * @version:
 * @Author: jiamf1
 * @Date: 2023-04-28 13:33:23
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-03 19:49:18
 */
/**
 * 批量收单弹窗
 * @param {*} viewModal
 * @returns
 */
import commonMethod from "@/common/utils";
import actions from '@/common/const/actions.json'
import service from '@/common/const/service'

export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: commonMethod.mergeApi([], actions.collect_dialog),
        mounted () {
            const data = window.parent.colloctData
            viewModal.get('tableContainer').loadData(data)
            result.smqEvent()
        },
        dialogConfirm () {
            const selectRows = viewModal.get('tableContainer').getSelectRow()
            if (selectRows.length === 0) {
                viewModal.Message.info('请选择要收单的单据!')
                return
            } else {
                window.parent.colloctDataCallback('confirm', selectRows)
            }

        },
        dialogCancel () {
            window.parent.colloctDataCallback('cancel')
        },
        // 扫码枪
        smqEvent () {
            let smqCode = ''
            let id = ''
            let lastTime = 0
            let nextTime = 0
            let newCode = ''
            document.onkeypress = function (e) {
                newCode = e.keyCode
                console.log(newCode)
                nextTime = new Date().getTime()
                if (nextTime - lastTime < 100 || lastTime === 0) {
                    smqCode += String.fromCharCode(newCode)
                    smqCode = smqCode.replace(/\r/g, "");
                    if (smqCode.length === 26) {
                        id = smqCode
                        result.getCollectedBillInfo(id)
                        smqCode = ''
                    }
                } else {
                    smqCode = String.fromCharCode(newCode)
                    smqCode = smqCode.replace(/\r/g, "");

                    if (smqCode.length === 26) {
                        id = smqCode
                        result.getCollectedBillInfo(id)
                        smqCode = ''
                    }
                }
                lastTime = nextTime
            }
        },
        getCollectedBillInfo (id) {
            let data = {
                id: id,
            }
            const url = `/${service.BASE_BE_URL}/ar/bill/collectBill/getBillInfo`
            viewModal.post({ url, data: data }).then(res => {
                if (res.error === false) {
                    // let list = window.parent.colloctData
                    let list = viewModal.get('tableContainer')?.getTableData()?.data || [] // 获取表格数据
                    let ids = list.map(i => i.id)
                    if (ids.indexOf(id) === -1) {
                        list.push(res.data)
                        viewModal.get('tableContainer').loadData(list)
                    }
                } else {
                    viewModal.Message.error(res.message);
                }
            })
        }
    }
    return result
}
