//加载额外扩展脚本
import { loadJS, loadJSON } from '@/api/load-src'
import { guid } from '_u/utils.js'
import ht from './HelperTools'
import { ViewModal } from './ViewModal'
let publicPath = '/yondif-pvdf-fe/'
if (process.env.NODE_ENV === 'development') {
    publicPath = '/'
}
export const loadExtraJS = async (billId,isDesigner=false) => {

    await loadJS(`YDFComponents`, `${publicPath}common-js/pub/YDFComponents.jsx?v=${guid()}`)
    // 引入扩展脚本
    const cfg = await loadJSON(`${publicPath}common-js/config.json`)
    ht.setExtraJS({ ...window['YDFComponents'](ViewModal) })
    const { moduleCode, billTypeCode } = ht.getGlobalProps()
    //console.log(moduleCode, billTypeCode, publicPath, '加载扩展脚本')
    if (!billTypeCode) {
        console.log('加载扩展脚本：缺少单据类型code')
        return false
    }
    if (!cfg[moduleCode]) {
        console.log('加载扩展脚本：缺少moduleCode')
        return false
    }
    if (!cfg[moduleCode][billTypeCode]) {
        console.log('加载扩展脚本：路径不正确：')
        return false
    }

    const { path } = cfg[moduleCode][billTypeCode]

        await loadJS(`${moduleCode}_${billTypeCode}`, !path ? `${publicPath}common-js/${moduleCode}/${billTypeCode}.jsx?v=${guid()}` : `${path}?v=${guid()}`)
        if (!window[`${moduleCode}_${billTypeCode}`](ViewModal)) {
            console.log(`扩展脚本编写有问题，返回对象命名为${moduleCode}_${billTypeCode}`)
        }

        await ht.setExtraJS({ ...window[`${moduleCode}_${billTypeCode}`](ViewModal), ...window['YDFComponents'](ViewModal) })
        const { init } = ht.getExtraJS()
        console.log(ht.getExtraJS(), '默认的方法')
        // 初始化方法,
        if (init) {
            console.log('执行扩展脚本初始化方法')
            init(billId)

        }
    
}