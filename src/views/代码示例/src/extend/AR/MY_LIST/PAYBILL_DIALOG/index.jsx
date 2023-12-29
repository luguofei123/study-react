/*
 * @Descripttion:
 * @version:
 * @Author: jiamf1
 * @Date: 2023-04-28 13:33:23
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-22 17:34:19
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
        api: commonMethod.mergeApi([], actions.paybill_dialog),
        mounted () {
            const data = window.parent.colloctData
            viewModal.get('tableContainer').loadData(data)
            result.smqEvent()

            // 监控单据跳转 单据id字段需要设置成链接
            viewModal.get('tableContainer').state.columns.forEach(item => {
                if (item.name === 'link' && item.dataField.indexOf('arBillNo') !== -1) {
                    viewModal.on(item.key, 'onCellClick', (param) => {
                        result.customOpen('view', param.data)
                    })
                }
            })
        },
        dialogConfirm () {
            const selectRows = viewModal.get('tableContainer').getSelectRow()
            if (selectRows.length === 0) {
                viewModal.Message.info('请选择单据!')
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
        },
        // 打开单据页
        customOpen (eidtType, data, isEdit) {
            const type = eidtType
            let url =
                '/yondif-pvdf-fe/#/BillRender?billId=' +
                data.id +
                '&status=' +
                data.billStatus +
                '&editMod=' +
                type +
                '&fromPageshoudan=' +
                'fromPageshoudan' +
                '&fromPage=' +
                result.pageCode +
                '&tabNo=' +
                result.searchParams?.externalData?.tabNo
            if (isEdit) {
                url = `${url}&isEdit=${isEdit}`
            }

            commonMethod.openBill({ viewModal: viewModal, data: data, url: url, fromPageshoudan: 'fromPageshoudan' })
        },
    }
    return result
}
