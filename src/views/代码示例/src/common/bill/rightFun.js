/*
 * @Descripttion: 右侧区域
 * @version: 
 * @Author: jiamf1
 * @Date: 2023-05-19 12:33:11
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-21 16:22:52
 */
import arBillCommonFun from "./arBillCommonFun"
import service from '../const/service'

export default {
  vehicleObj: {},
  // 初始化监听
  initRightHandle (viewModal) {
    // 费用标准-目的地
    if (viewModal.get('travelPlace')) {
      this.getVehicleList(viewModal) // 获取费用标准交通工具值集
      // 监听目的地
      viewModal.on('travelPlace', 'onChange', param => {
        const obj = {
          billTypeCode: arBillCommonFun.billContext.billTypeCode,
          vehicleCode: this.vehicleObj.vehicleCode || '2',
          vehicleName: this.vehicleObj.vehicleName || '火车',
          arriPlaceCode: param.data?.eleCode || param.data?.value,
          arriPlaceName: param.data?.eleName || param.data?.displayValue,
          meetingType: ''
        }
        this.standardApiHandle(viewModal, obj)
      })
      // 监听费用标准-交通工具
      viewModal.on('rigthExpStandard', 'onChange', param => {
        const vehicle = param.data
        const arriPlace = viewModal.get('travelPlace').state
        this.vehicleObj = {
          vehicleCode: vehicle.code,
          vehicleName: vehicle.name
        }
        const obj = {
          billTypeCode: arBillCommonFun.billContext.billTypeCode,
          vehicleCode: vehicle.code,
          vehicleName: vehicle.name,
          arriPlaceCode: arriPlace.referValue?.eleCode,
          arriPlaceName: arriPlace.referValue?.eleName,
          meetingType: ''
        }
        this.standardApiHandle(viewModal, obj)
      })
    }

    // 智能稽查
    setTimeout(() => {
      if (viewModal.get('IntelligentAuditingWapper')) {
        viewModal.on('IntelligentAuditing', 'onChange', param => {
          console.log(param)
        })
        const baseDataObj = arBillCommonFun.getAreaData(viewModal, 'BASE')?.[0]
        if (baseDataObj?.currentNode) {
          let yondifEnv = localStorage.getItem('yondifEnv')
          if (yondifEnv) {
            yondifEnv = JSON.parse(yondifEnv)
          }
          let id = viewModal.getBillId()
          let nodeId = baseDataObj.currentNode
          // id = '20230612134753888249294438'
          // nodeId = 'sid-35BE2B76-244B-4ED2-875F-F0320FCB1586'
          const urlstr = `billId=${id}&nodeId=${nodeId}&agencyCode=${yondifEnv.unitCode}`
          this.getIntelligentAuditing(viewModal, urlstr)
        } else {
          console.log(baseDataObj)

          // setTimeout(() => {
          //   viewModal.showNode('IntelligentAuditingWapper', false)
          // }, 100)
        }
      }
    }, 300)

  },
  // 组装传参，获取费用标准
  // data 费用数据，type 费用显示方式
  getExpenseStandard (viewModal, data, type) {
    // 不存在右侧费用标准区域，返回return
    if (!viewModal.get('rigthExpStandard')) {
      return false
    }
    let param = {}
    switch (type) { // 费用展示方式
      case '04': // 差旅-行程归集
        param = {
          billTypeCode: arBillCommonFun.billContext.billTypeCode,
          vehicleCode: data.vehicleCode,
          vehicleName: data.vehicleName,
          arriPlaceCode: data.arriPlaceCode,
          arriPlaceName: data.arriPlaceName,
          meetingType: ''
        }
        break
      case '03': // 会议、培训
        param = data
        param['vehicleCode'] = ''
        param['vehicleName'] = ''
        param['arriPlaceCode'] = ''
        param['arriPlaceName'] = ''
        break
      default:
        break
    }
    this.vehicleObj = {
      vehicleCode: data.vehicleCode,
      vehicleName: data.vehicleName
    }
    if (viewModal.get('travelPlace')) {
      viewModal.get('travelPlace').update({ value: param.arriPlaceCode, displayValue: param.arriPlaceName })
    }
    this.standardApiHandle(viewModal, param, type)
  },
  // 调取接口，获取费用标准
  standardApiHandle (viewModal, param, type) {
    viewModal.post({
      url: `/${service.BASE_BE_URL}/ar/basicset/setting/getDynamicExpenseStandard`,
      data: param,
      waitfor: false
    }).then(res => {
      let data = res.data
      if (data && data.length) {
        data.forEach(item => {
          let allColumn = []
          if (item.trafficHead && item.trafficHead.length) {
            item.trafficHead.forEach(ele => {
              if (ele.children) {
                allColumn = [...allColumn, ...ele.children]
              } else {
                allColumn.push(ele)
              }
            })
          }
          item.allColumn = allColumn
        })
      }
      viewModal.get('rigthExpStandard').setExpStandard(data, param, type)
    })
  },
  getVehicleList (viewModal) {
    viewModal.request({
      url: `/${service.BASE_BE_URL}/ar/basicset/setting/getVehicleList`,
      waitfor: false
    }).then(res => {
      if (res.error === false) {
        viewModal.get('rigthExpStandard').setVehicleList(res.data)


        // const objInit = {
        //   billTypeCode: arBillCommonFun.billContext.billTypeCode,
        //   vehicleCode: vehicle.code,
        //   vehicleName: vehicle.name,
        //   arriPlaceCode: arriPlace.referValue?.eleCode,
        //   arriPlaceName: arriPlace.referValue?.eleName,
        //   meetingType: ''
        // }

        // this.standardApiHandle(viewModal, objInit)
      }
    })
  },
  // 智能稽核接口
  getIntelligentAuditing (viewModal, str) {
    viewModal.request({
      url: `/${service.BASE_BE_URL}/ar/process/auditpointcheck/getCheckResult?${str}`,
      waitfor: false
    }).then(res => {
      if (res.error === false) {
        viewModal.get('IntelligentAuditing').init(res.data)
      }
    })
  }
}
