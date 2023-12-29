/**
 * 打开弹窗组件，父组件子组件互相传值用例
 * @param {*} viewModal
 * @returns
 */
import commonMethod from '../../common/utils' // 工具方法
export default (viewModal) => {
    const result = {
        // api自定义动作，code和文件名一致，label描述  API是公共的自定义方法
        api: [
            {"code": "showModalsmessage", "label": "弹窗自定义"},
            {"code": "closeModalsmessage", "label": "关闭弹窗自定义"}
        ],
        create() {
        },
        mounted() {
            if (window.parent && window.parent.getmessages) {
                // 接受父组件传值
                console.log(window.parent.setowenData)
            }
        },
        showModals() {
            window.setowenData = window.modalcloseData
            window.getmessages = function () {
                // 接受父组件传值
                console.log(window.modalcloseData)
                viewModal.closePageModal('showmodalOpen')
            }
            viewModal.showModal({
                pageUrl: '/yondif-pvdf-fe/#/BillRender?code=myshowModalopen&cacheUI=0&editMod=true',
                title: '试着打开',
                margintop: 80,
                pageId: 'showmodalOpen',
                "props": {
                    // 同 上面的参数 pageUrl，此处可不写
                    "serviceurl": "/yondif-pvdf-fe/#/BillRender?code=myshowModalopen&cacheUI=0&editMod=true",
                    "width": 80,
                    "height": 80,
                    // unit_type 可不写，宽高默认单位是 %
                    // "unit_type": {
                    //   "label": "px",
                    //   "value": "px"
                    // }
                },
            })
        },
        closeModalsmessage() {
            let data = viewModal.getEntyValues()
            let datakey = data['20230425100611329113891510194'].data
            window.parent.modalcloseData = JSON.parse(JSON.stringify(datakey))
            window.parent.getmessages()
        },
    }
    return result
}
