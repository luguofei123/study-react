
export default {
    // 千分位以及小数点转换
    toThousandFix (value) {
        if (value === 0) {
            return '0.00'
        }
        if (value === undefined || value === '' || value === null || value === 'null') {
            return ''
        }
        if (value) {
            if (typeof value === 'number') {
                value = value.toFixed(2)
            }
            /*原来用的是Number(value).toFixed(0)，这样取整时有问题，例如0.51取整之后为1，感谢Nils指正*/
            const intPart = Math.trunc(value) //获取整数部分
            const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') //将整数部分逢三一断
            let floatPart = '.00' //预定义小数部分
            const value2Array = value.split('.')
            //=2表示数据有小数位
            if (value2Array.length == 2) {
                floatPart = value2Array[1].toString() //拿到小数部分

                if (floatPart.length == 1) {
                    //补0,实际上用不着
                    return intPartFormat + '.' + floatPart + '0'
                } else {
                    return intPartFormat + '.' + floatPart.substr(0, 2)
                }
            } else {
                return intPartFormat + floatPart
            }
        }
    },
    // 去除千分位
    deStr (val) {
        let num = 0
        if (val !== null && val !== undefined) {
            num = parseFloat((val + '').replace(/,/g, ''))
            if (isNaN(num)) {
                num = 0
            }
        }
        return num
    },
    //时间戳转日期
    formatDates (date) {
        if (!date) {
            return ''
        }
        if (typeof date == 'string') {
            if (date.length > 12) {
                date = new Date(parseInt(date)) //时间戳
            } else {
                date = new Date(date) //年月日
            }
        } else {
            date = new Date(date) //转换成Data();
        }

        const y = date.getFullYear()
        console.log(y)
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? '0' + d : d
        return y + '-' + m + '-' + d
    },
    // 获取当前业务日期 如 2023-07-01
    getDate (dateVal) {
        let date = new Date()
        if (dateVal) { // 业务日期
            date = new Date(dateVal)
        }
        let year = date.getFullYear()  // 得到当前年份
        let month = date.getMonth() + 1
        month = month >= 10 ? month : '0' + month // 补零
        let day = date.getDate() // 得到当前天数
        day = day >= 10 ? day : '0' + day // 补零
        return year + '-' + month + '-' + day // 这里传入的是字符串
    },
    // 获取当月第一天
    getStartTime () {
        let date = new Date()
        date.setDate(1) // 将当前时间的日期设置成第一天
        let year = date.getFullYear()  // 得到当前年份
        let month = date.getMonth() + 1 // 得到当前月份（0-11月份，+1是当前月份）
        month = month >= 10 ? month : '0' + month // 补零
        let day = date.getDate() // 得到当前天数，实际是本月第一天，因为前面setDate(1) 设置过了
        day = day >= 10 ? day : '0' + day // 补零
        return year + '-' + month + '-' + day // 这里传入的是字符串
    },
    // 当年的第一天 如 2023-01-01
    getYearStartTime (dateVal) {
        let date = new Date()
        if (dateVal) { // 业务日期
            date = new Date(dateVal)
        }
        date.setDate(1) // 将当前时间的日期设置成第一天
        date.setMonth(0)
        let year = date.getFullYear()  // 得到当前年份
        let month = date.getMonth() + 1
        month = month >= 10 ? month : '0' + month // 补零
        let day = date.getDate() // 得到当前天数，实际是本月第一天，因为前面setDate(1) 设置过了
        day = day >= 10 ? day : '0' + day // 补零
        return year + '-' + month + '-' + day // 这里传入的是字符串
    },
    // 获取当月的前一天
    getTimeBeforeOne () {
        let date = new Date()
        let year = date.getFullYear()  // 得到当前年份
        let month = date.getMonth() + 1 // 得到当前月份（0-11月份，+1是当前月份）
        month = month >= 10 ? month : '0' + month // 补零
        let day = date.getDate() - 1 // 得到当前天数的前一天
        day = day >= 10 ? day : '0' + day // 补零
        return year + '-' + month + '-' + day // 这里传入的是字符串
    },
    // 判断日期是否是当前日期的前一天
    checkTimeBeforeOne (val) {
        let dateVal = new Date(val)
        let date = new Date()
        let year = date.getFullYear()
        if (year < dateVal.getFullYear()) {
            return false
        }
        let month = date.getMonth() + 1
        if (month < dateVal.getMonth()) {
            return false
        }
        let day = date.getDate() - 1
        if (day < dateVal.getDate()) {
            return false
        }
        return true
    },
    // 获取中英文字节长度
    countCharacters (str) {
        let totalCount = 0
        for (let i = 0; i < str.length; i++) {
            const c = str.charCodeAt(i)
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                totalCount++
            } else {
                totalCount += 2
            }
        }
        return totalCount
    },
    // 未注册的页面，比如会议报销单录入页面
    // 需要传code、title、url
    // serviceCode需要页面依赖的服务编码（但是感觉好像可以传任意已注册的服务编码）
    openServiceByUrl (viewModal, { code, title, url }) {
        jDiwork.getState(data => {
            const serviceCode = data.activeTab
            jDiwork.openService(serviceCode, {}, {
                code, // 自定义code，需唯一，可选（新开页签必须传递）
                title, // 页签显示名称，可选（新开页签必须传递
                url // iframe 的url
            })
        })
    },
    // 已经注册的服务页面，比如我的报销 可以通过serviceCode直接打开
    openServiceByServiceCode (viewModal, serviceCode) {
        viewModal.openService({
            serviceCode: serviceCode
        })
    },
    // 公共自定义事件和自己的事件合并 重复的以actionCommon的数据为准
    mergeApi (api, actionCommon) {
        const arr = actionCommon.slice()
        const codeArr = actionCommon.map(i => i.code)
        if (Array.isArray(api)) {
            api.forEach(item => {
                if (codeArr.indexOf(item.code) === -1) {
                    arr.push(item)
                }
            })
        }
        return arr
    },
    // 获取url上的参数
    getUrlParameter (key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        var r = window.location.href.substring(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
    },
    showPage (viewModal, url, data, title, pageId, isProps, isModal) {
        let params = {
            pageUrl: url,
            title: title ? title : data.billTypeName,
            margintop: 0,
            pageId: pageId ? pageId : `p${data.id}`,
        }
        if (isProps) {
            params.props = isProps
        }
        if (isModal) {
            // 弹框
            params.margintop = 80
            viewModal.showModal(params)
        } else {
            // 全屏
            viewModal.showPage(params)
        }


    },
    // 表单数据清空
    clearFormValues (viewModal, data, divCode) {
        let obj = {}
        data.forEach(item => {
            if (item.defaultValue) {
                obj[item.dataField] = item.defaultValue
            } else {
                obj[item.dataField] = ''
            }
            if (item.enty && item.enty.replaceItems) {
                const replaceItems = item.enty.replaceItems
                replaceItems.forEach(ele => {
                    if (ele.to.fieldname && !ele.to.fieldname.includes('displayname')) {
                        obj[ele.to.fieldname] = ''
                    }
                })
            }
        })
        obj.id = ''
        viewModal.setEntyValues(divCode, obj)
        viewModal.reloadWidgetData(divCode)
    },
    // 打开单据
    openBill ({ viewModal, data, url, title, pageId, isDefault, closeType, props, isModal, fromPageshoudan }) {
        // isProps: 一般弹框才会用到，用于设置弹框的宽高，isModal是否是弹窗，closeType是否需要关闭，默认需要关闭，不需要的话传'0',isDefault是否打开默认模版,1是默认，2不是默认
        return new Promise((resolve, reject) => {
            const billContext = viewModal.getContext()  // 获取单据类型信息
            let billUrl = ''
            let appCode = billContext.moduleCode
            const templateCode = billContext.billMoldCode
            if (appCode === 'ABM') {
                appCode = 'AAR'
            }

            let defaultType = isDefault ? isDefault : 2
            let isClose = closeType ? closeType : '1'
            const postUrl = `/yondif-pvdf-be/ybill/v1/billTemplate/selectRoleTemplate?isDefault=${defaultType}`
            let code = ''
            let params = {
                templateCode: templateCode,
                mofDivCode: billContext.mofDivCode,
                agencyCode: billContext.agencyCode,
                fiscalYear: billContext.env.fiscalYear || billContext.env.setYear,
                billTypeCode: data.billTypeCode,
                moduleCode: appCode,
                procinstId: data.procinstId,
                engineCode: service.BASE_BE_URL
            }
            viewModal.post({
                url: postUrl,
                data: params,
                waitfor: true,
            }).then(res => {
                code = res.data ? res.data.code : ''
                billUrl = `${url}&code=${code}&appCode=${appCode}`
                this.showPage(viewModal, billUrl, data, title, pageId, props, isModal)
                if (isClose === '1') {
                    window.colsePageDetail = listBtnFun.colsePageDetailCallback.bind(null, viewModal, data)
                }
            })
        })

    },
    // 判断是否为空
    isNull: function (target) {
        if (typeof target == 'undefined' || null == target || '' === target || 'null' == target || 'undefined' === target) {
            return true
        } else {
            return false
        }
    },
    deepClone (source) {
        if (typeof source !== 'object' || source == null) {
            return source;
        }
        const target = Array.isArray(source) ? [] : {};
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                if (typeof source[key] === 'object' && source[key] !== null) {
                    target[key] = this.deepClone(source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
        return target;
    },
    // 数据去重
    filterData (data, key) {
        let arr = data
        if (data && data.length) {
            arr = data.filter((x, index) => {
                let arrKey = []
                data.forEach(item => {
                    arrKey.push(item[key])
                })
                return arrKey.indexOf(x[key]) === index
            })
        }
        return arr
    },
    // 获取上下文环境变量
    getYondifEnv (key) {
        let yondifEnv = localStorage.getItem('yondifEnv')
        if (yondifEnv) {
            yondifEnv = JSON.parse(yondifEnv)
        } else {
            yondifEnv = {}
        }

        if (key) {
            if (yondifEnv[key]) {
                return yondifEnv[key]
            } else {
                return null
            }

        } else {
            return yondifEnv
        }
    }
}
