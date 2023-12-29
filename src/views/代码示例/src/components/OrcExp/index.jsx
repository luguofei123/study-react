/*
 * @Descripttion: 电子票-报销弹窗
 * @version: 
 * @Author: lugfa
 * @Date: 2023-06-10 09:12:37
 * @LastEditors: lugfa
 * @LastEditTime: 2023-09-05 15:30:00
 * @FilePath: /yondif-a-ar-fe/yondif/src/components/AEBF/OrcExp/index.jsx
 */
import { Component, createRef } from 'react';
import ApplySelect from './ApplySelect'
import InvoiceSelect from './InvoiceSelect'
import ExpensConfirm from './ExpensConfirm'
import commonMethod from '@/common/utils' // 工具方法
import service from '@/common/const/service'
import axios from '@/api/api.request'
const { Button, Modal, Table, Message } = TinperNext
const $message = Message
export default class OrcExp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      totalSelectNumber: 0,
      totalSelectMoney: '0.00',
      title: '',
      showModal: true,
      fromParent: this.props.from,
      isRowButton: this.props.isRowButton,   // 是否是行上智能识别
      rowData: this.props.rowData,      // 行上智能识别数据
      billTypeInfo: this.props?.billTypeInfo,
      billTypeCode: this.props?.billTypeInfo?.billTypeCode || '',
      steps: '',
      treeDataExp: this.props?.billTypeInfo?.expExpenseTypeList || [],    // expExpenseTypeList  // arTypeExpenseList
      expensBackParam: { excludeIds: [] },    // 记录费用确认的数据 便于返回第一步后，选择票据生成费用进行添加
      invoiceSelectList: [], // 两个来源，一个是从我的票夹选择的数据；一个是从弹窗选择票据页面选择的票据
      applySelectList: this.props?.applySelectList || [],  // 选择的申请单
      historyTravelRow: this.props?.historyTravelRow || null,
      historyExpenseList: this.props?.historyExpenseList || [],
      allSysConfig: null

    }
    // 三个组件的ref
    this.ApplySelectRef = createRef(null)
    this.InvoiceSelectRef = createRef(null)
    this.ExpensConfirmRef = createRef(null)
  }
  agencyCodeStr = ''
  agencyNameStr = ''
  userCode = ''
  selectApply = 'select-apply'
  selectInvoice = 'select-invoice'
  selectExpens = 'select-expens'
  componentDidMount () {
    // 获取上下文环境信息
    let yondifEnv = localStorage.getItem('yondifEnv')
    if (yondifEnv) {
      yondifEnv = JSON.parse(yondifEnv)
      this.agencyCodeStr = yondifEnv?.full?.agency?.agencyCode
      this.agencyNameStr = yondifEnv?.full?.agency?.agencyName
      this.userCode = yondifEnv.userCode
    }
    // 来自我的票夹
    // 传递过来的数据结构
    //   let param = {
    //     from: 'AEBF',
    //     billTypeInfo: props.data,
    //     invoiceSelectList: selectRows
    // }
    if (this.state.fromParent === 'AEBF') {
      let { billTypeInfo, invoiceSelectList } = this.props
      this.setState({
        billTypeInfo: billTypeInfo,
        invoiceSelectList: invoiceSelectList
      }, async () => {
        let flag = await this.isHaveApply()
        if (flag) {
          this.goToSteps(this.selectApply)
        } else {
          this.goToSteps(this.selectExpens)
        }
      })

    }
    // 来自报销单据详情的智能识别
    if (this.state.fromParent === 'AR') {
      this.goToSteps(this.selectInvoice)
    }

    // 获取配置信息
    this.getAllSystemConfig()
  }
  // 获取全局配置
  getAllSystemConfig () {
    let yondifEnv = localStorage.getItem('yondifEnv')
    if (yondifEnv) {
      yondifEnv = JSON.parse(yondifEnv)
    }
    const data = {
      mofDivCode: yondifEnv.rgCode,
      agencyCode: yondifEnv.unitCode,
      fiscalYear: yondifEnv.setYear,
      paramCodesList: []
    }
    let sendData = {
      url: `/${service.BASE_BE_URL}/${'ar/sysset/arsyssetup/getArSysSetupListByCondition'}`,
      method: "post",
      data: data,
      waitfor: false,
    }
    axios.request(sendData).then(res => {
      if (res.error === false) {
        this.setState({
          allSysConfig: res.data
        })
      } else {
        $message.error(`${res.msg}`)
      }
    })
  }
  goToSteps (str, param) {
    let title = ''
    let steps = str
    switch (str) {
      case this.selectApply:
        title = '选择申请单'
        break
      case this.selectInvoice:
        title = '发票选择列表'
        if (param?.type === 'addBill') {
          this.setState({
            expensBackParam: param
          })
        }
        break
      case this.selectExpens:
        title = '费用确认'
        break
      default:
        break

    }
    this.setState({
      title: title,
      steps: steps
    })
  }
  // 跳转到票据采集页面
  jumperToBill (type, row) {
    if (type === 'add') {
      // url = '/yondif-ar2-fe/yondif/index.html/#/arAebfDetail?&fromPage=MYABE&pageType=add&pageTab=tabWSY'
      jDiwork.openService('74bf4aa1-5fc8-40b1-bccc-420a5809ad55', {
        pageType: 'add',
        clipId: this.InvoiceSelectRef.current.state.currentClipId,
        openBy: 'aebf',
        nouse: 'nouser',
      })
    } else {
      jDiwork.openService('74bf4aa1-5fc8-40b1-bccc-420a5809ad55', {
        fileId: row.fileId,
        invoiceId: row.invoiceId,
        invoiceNo: row.invoiceNo,
        invoiceCode: row.invoiceCode,
        clipId: row.clipId,
        pageType: 'view',
        openBy: 'aebf',
        nouse: 'nouser',
      })
    }

  }
  // 判断有没有申请单 
  async isHaveApply () {
    const { billTypeCode } = this.state
    let param = {
      billType: billTypeCode,
      agencyCode: this.agencyCodeStr
    }
    let flag = false
    let sendData = {
      url: `/${service.BASE_BE_URL}/ar/invoice/relateBill/choiceApply`,
      method: "post",
      data: param,
      waitfor: true,
    }
    let res = await axios.request(sendData)
    if (res.error === false) {
      let result = res.data
      if (result && Object.keys(result).length > 0) {
        flag = true
      } else {
        flag = false
      }
    }
    return flag
  }
  getTableData = () => {
    return this.state
  }
  // 关闭弹框
  close = () => {
    let { steps, expensBackParam } = this.state
    if (steps === this.selectInvoice && expensBackParam?.tableData) {
      let param = {
        index: null,
        item: null,
        tableData: expensBackParam.tableData,
        type: 'cancelBill',
        excludeIds: []

      }
      this.setState({
        expensBackParam: param
      })
      this.goToSteps(this.selectExpens)

    } else {
      this.setState({
        showModal: false
      })
    }

  }
  // 票据生成费用 行上的
  invoiceToExpenseList (invoiceSelectList) {
    let { billTypeInfo } = this.props
    let invoiceIds = invoiceSelectList.map(item => item.invoiceId)
    let param = {
      arTypeInvoiceBO: billTypeInfo,
      invoiceIds: invoiceIds,
      isMerge: 'Y'
    }
    let sendData = {
      url: `/${service.BASE_BE_URL}/bm/invoice/invoiceToExpenseList`,
      method: "post",
      data: param,
      waitfor: true,
    }
    axios.request(sendData).then(res => {
      if (res.error === false) {
        let list = res.data
        // 直接调用生成费用的方法
        let { billTypeInfo } = this.props
        let { rowData } = this.state
        let param = {
          data: [],
          billTypeInfo: billTypeInfo,
          applySelectList: [],
          generatorMode: 'collect',
          isRowButton: true,
          rowData: rowData,
          expenseList: list.expenseList,
          fileList: list.fileList
        }
        this.generatorExpense(param)

      } else {
        $message.warning(res?.message)
      }

    }).catch(err => {
      $message.error(err?.data?.message)
    })
  }
  checkBill (selectRows) {
    let ifPass = true
    const { allSysConfig } = this.state
    const invoiceForbid = allSysConfig.invoiceForbid
    const invoiceReminder = allSysConfig.invoiceReminder
    let invoiceOther = allSysConfig.invoiceOther
    // 禁止
    if (invoiceForbid) {
      let arr = []
      let invoiceForbidArr = invoiceForbid.split(';')
      // 系统的状态和票夹的状态不一致，需要前端手动调整
      let statusObj = {
        '1': '3',
        '2': '4',
        '3': '0',
        '4': '2'
      }
      invoiceForbidArr = invoiceForbidArr.map(i => {
        return statusObj[i]
      })
      selectRows.forEach(i => {
        if (invoiceForbidArr.indexOf(i.checkState) !== -1) {
          arr.push(i)
        }
      })
      if (arr.length > 0) {
        ifPass = false
        let tep = []
        arr.forEach((item, index) => {
          if (index === arr.length - 1) {
            tep.push(<div><div>发票【{item.invoiceNo}】查验结果【{item.checkStateName}】,</div>
              <div>不能继续报销！</div></div>)
          } else {
            tep.push(<div> 发票【{item.invoiceNo}】查验结果【{item.checkStateName}】,</div>)
          }

        })
        Modal.error({
          title: '禁止',
          content: tep,
          width: 500,
          okButtonProps: { style: { display: 'none' } }
        })
        return ifPass
      }

    }
    // 日期检查 已选票据开票日期与报销日期所在年度不同时，需进行提醒
    if (invoiceOther === '1') {
      let appDateYear = new Date().getFullYear()
      let arr = []
      selectRows.forEach(i => {
        // 有票据日期
        if (i.invoiceDate && i.invoiceDate.slice(0, 4) !== appDateYear + '') {
          arr.push(i)
        }
        // 没有票据日期 就用采票日期createDate
        if (!i.invoiceDate && i.createDate.slice(0, 4) !== appDateYear + '') {
          arr.push(i)
        }
      })
      if (arr.length > 0) {
        ifPass = false
        let tep = [<div>使用了上年开具的票据:</div>]
        arr.forEach((item, index) => {
          if (index === arr.length - 1) {
            tep.push(<span>【{item.invoiceNo}】,是否继续报销?</span>)
          } else {
            tep.push(<span>【{item.invoiceNo}】,</span>)
          }

        })

        let that = this
        Modal.confirm({
          title: '提醒',
          content: tep,
          width: 500,
          onOk () {
            that.gotoStepTwo(that.state.isRowButton, that.InvoiceSelectRef.current.state.selectRowsAll)
          }
        })
        return ifPass
      }

    }
    // 提醒
    if (invoiceReminder) {
      let arr = []
      let invoiceReminderArr = invoiceReminder.split(';')
      // 系统的状态和票夹的状态不一致，需要前端手动调整
      let statusObj = {
        '1': '3',
        '2': '4',
        '3': '0',
        '4': '2'
      }
      invoiceReminderArr = invoiceReminderArr.map(i => {
        return statusObj[i]
      })
      selectRows.forEach(i => {
        if (invoiceReminderArr.indexOf(i.checkState) !== -1) {
          arr.push(i)
        }
      })
      if (arr.length > 0) {
        ifPass = false
        let tep = []
        arr.forEach((item, index) => {
          if (index === arr.length - 1) {
            tep.push(<div><div>发票【{item.invoiceNo}】查验结果【{item.checkStateName}】,</div>
              <div>是否继续报销?</div></div>)
          } else {
            tep.push(<div> 发票【{item.invoiceNo}】查验结果【{item.checkStateName}】,</div>)
          }

        })
        let that = this
        Modal.confirm({
          title: '提醒',
          content: tep,
          width: 500,
          onOk () {
            that.gotoStepTwo(that.state.isRowButton, that.InvoiceSelectRef.current.state.selectRowsAll)
          }
        })
        return ifPass
      }
    }
    return ifPass
  }
  // 这个单独拿出来，便于弹窗确认调用
  gotoStepTwo (isRowButton, invoiceSelectList) {
    if (isRowButton) {
      this.invoiceToExpenseList(invoiceSelectList)

    } else {
      this.setState({
        invoiceSelectList: [...invoiceSelectList]
      }, () => {
        this.goToSteps(this.selectExpens)
      })
    }
  }
  confirm (steps, type) {
    const { data, from } = this.props
    let { billTypeCode, applySelectList, isRowButton, rowData } = this.state

    // 选择申请单
    if (steps === this.selectApply) {
      let applySelectList = this.ApplySelectRef.current.state.selectedRows
      if (applySelectList && applySelectList.length > 0) {
        this.setState({
          applySelectList: applySelectList
        }, () => {
          this.goToSteps(this.selectExpens)
        })

      } else {
        $message.warning('请选择可关联的申请单！')
      }
    }
    // 选择票据后确认进入费用确认界面
    if (steps === this.selectInvoice) {
      let invoiceSelectList = this.InvoiceSelectRef.current.state.selectRowsAll


      if (invoiceSelectList && invoiceSelectList.length > 0) {
        // 票据校验
        if (!this.checkBill(invoiceSelectList)) return
        // 如果是行上选择智能识别，跳过第二步
        this.gotoStepTwo(isRowButton, invoiceSelectList)

      } else {
        $message.warning('请选择需要报销的票据！')
      }

    }
    if (steps === this.selectExpens) {
      let schTableData = this.ExpensConfirmRef.current.state.schTableData
      let noSchTable = this.ExpensConfirmRef.current.state.noSchTable
      let dataList = []
      let generatorMode = type

      if (billTypeCode.includes('TRIP')) {
        // 人员检查
        if (!this.checkPeople(schTableData)) {
          return
        }


        schTableData.forEach(i => {
          dataList.push(...i.tableList)
        })
      } else {
        // 费用检查
        if (!this.checkExpense(noSchTable)) {
          return
        }
        dataList = noSchTable
      }

      dataList = this.setMailbill(dataList)
      let applyExpenseList = this.ExpensConfirmRef.current.state.applyExpenseList
      let { billTypeInfo } = this.props
      let param = {
        data: dataList,
        billTypeInfo: billTypeInfo,
        applySelectList: applySelectList,
        applyExpenseList: applyExpenseList,
        generatorMode: generatorMode,
        isRowButton: isRowButton,
        rowData: rowData
      }
      this.generatorExpense(param)
    }

  }
  // 主副票关系
  setMailbill (tableData) {
    tableData.forEach(item => {
      item.childFilePath = ''
      item.childInvoiceId = ''
      let childFilePathArr = []
      let childInvoiceIdArr = []
      tableData.forEach(item1 => {
        if (item1.relationMainBill && item1.relationMainBill === item.invoiceNo) {
          childFilePathArr.push(item1.filePath)
          childInvoiceIdArr.push(item1.invoiceId)
        }
      })
      childFilePathArr = new Set(childFilePathArr)
      childFilePathArr = Array.from(childFilePathArr)
      childInvoiceIdArr = new Set(childInvoiceIdArr)
      childInvoiceIdArr = Array.from(childInvoiceIdArr)
      item.childFilePath = childFilePathArr.join(',')
      item.childInvoiceId = childInvoiceIdArr.join(',')
    })

    return tableData
  }
  // 生成费用的方法
  generatorExpense (param) {
    // 数据校验放在这里

    this.props.generatorExpense(param)
  }
  // 人员检查  relationMainBill 有值的不需要检查
  checkPeople (schTableData) {
    let isNotEmptyList = []
    schTableData.forEach((item, index) => {
      if (item.tableList && Array.isArray(item.tableList) && !item.noMatchFlag) {
        item.tableList.forEach((item1, index1) => {
          if (!item1.travelerName && !item1.relationMainBill) {
            isNotEmptyList.push(
              <div>行程【 {item.deptPlaceName} -{'>'}{item.arriPlaceName}】第 {index1 + 1}行出差人为空，请先选择出差人！</div>
            )
          }
        })
      }
    })

    if (isNotEmptyList.length > 0) {
      isNotEmptyList.push(<div>不允许继续操作！</div>)
      Modal.error({
        title: '禁止',
        content: isNotEmptyList,
        width: 500,
        okButtonProps: { style: { display: 'none' } }
      })
      return false
    }

    return true
  }
  // 费用检查不能为空
  checkExpense (noSchTable) {
    let isNotEmptyList = []
    noSchTable.forEach((item1, index1) => {
      if (!item1.expenseItemCode && !item1.relationMainBill) {
        isNotEmptyList.push(
          <div>【 第 {index1 + 1}费用为空，请先选择费用！</div>
        )
      }
    })
    if (isNotEmptyList.length > 0) {
      isNotEmptyList.push(<div>不允许继续操作！</div>)
      Modal.error({
        title: '禁止',
        content: isNotEmptyList,
        width: 500,
        okButtonProps: { style: { display: 'none' } }
      })
      return false
    }

    return true
  }
  // 更新金额合计
  updateTotal (obj) {
    let { totalSelectNumber, totalSelectMoney } = obj
    this.setState({
      totalSelectNumber: totalSelectNumber,
      totalSelectMoney: totalSelectMoney
    })

  }
  // 底部按钮显示
  showBottomButton (steps, billTypeCode) {
    let dom = null
    if (steps === this.selectApply) {
      dom = <>
        <Button colors="secondary" style={{ marginRight: 8 }} onClick={this.goToSteps.bind(this, this.selectExpens)}>跳过</Button>
        <Button colors='primary' onClick={this.confirm.bind(this, steps)}>确定</Button>
      </>
    }
    if (steps === this.selectInvoice) {
      dom = <>
        <Button colors="secondary" style={{ marginRight: 8 }} onClick={this.jumperToBill.bind(this, 'add')}>票据采集</Button>
        <Button colors='primary' onClick={this.close.bind(this, steps)}>取消</Button>
        <Button colors='primary' onClick={this.confirm.bind(this, steps)}>确定</Button>
      </>
    }
    if (steps === this.selectExpens) {
      if (billTypeCode.includes('TRIP')) {
        dom = <>
          <Button colors="secondary" style={{ marginRight: 8 }} onClick={this.close.bind(this, steps)}>取消</Button>
          <Button colors='primary' onClick={this.confirm.bind(this, steps, 'trip')}>确定</Button>
        </>
      } else {
        dom = <>
          <Button colors="secondary" onClick={this.close.bind(this, steps)} style={{ marginRight: 8 }}>取消</Button>
          <Button colors='primary' onClick={this.confirm.bind(this, steps, 'noTrip')}>确定</Button>
          {/* <Button colors='primary' onClick={this.confirm.bind(this, steps, 'collect')}>汇总生成</Button>
          <Button colors='primary' onClick={this.confirm.bind(this, steps, 'detail')}>明细生成</Button> */}
        </>
      }
    }
    return dom
  }
  render () {
    let {
      title,
      showModal, steps, billTypeCode, totalSelectNumber,
      totalSelectMoney, treeDataExp, billTypeInfo, invoiceSelectList,
      applySelectList, expensBackParam,
      isRowButton = false,
      historyExpenseList = [],
      historyTravelRow = null,
      fileList = [] } = this.state
    return <div>
      <Modal className={'aebf-dialog'}
        title={title} visible={showModal} showPosition={{ y: 40 }} onCancel={this.close.bind(this)} width={'90%'} height={'90%'}>
        <Modal.Body>
          {steps === this.selectApply ? <ApplySelect
            ref={this.ApplySelectRef}
            billTypeCode={billTypeCode}
            agencyCodeStr={this.agencyCodeStr} /> : ''}
          {steps === this.selectInvoice ? <InvoiceSelect
            ref={this.InvoiceSelectRef}
            jumperToBill={this.jumperToBill.bind(this)}
            billTypeCode={billTypeCode}
            updateTotal={this.updateTotal.bind(this)}
            userCode={this.userCode}
            expensBackParam={expensBackParam}
            isRowButton={isRowButton}
            billTypeInfo={billTypeInfo}
            historyExpenseList={historyExpenseList}
            agencyCodeStr={this.agencyCodeStr} /> : ''}
          {steps === this.selectExpens ? <ExpensConfirm
            ref={this.ExpensConfirmRef}
            updateTotal={this.updateTotal.bind(this)}
            treeData={treeDataExp}
            billTypeInfo={billTypeInfo}
            billTypeCode={billTypeCode}
            historyTravelRow={historyTravelRow}
            historyExpenseList={historyExpenseList}
            fileList={fileList}
            expensBackParam={expensBackParam}
            isRowButton={isRowButton}
            applySelectList={applySelectList}
            invoiceSelectList={invoiceSelectList}
            goToSteps={this.goToSteps.bind(this)} /> : null}
        </Modal.Body>
        <Modal.Footer>
          {
            steps === this.selectApply ? '' : <div className='aebf-total-money'>
              <span>已选<span>{totalSelectNumber}</span>条，</span>
              <span>合计金额 <span style={{ color: 'rgb(255, 102, 51)' }}>{commonMethod.toThousandFix(totalSelectMoney)}</span></span>
            </div>
          }
          <div className='aebf-foot-opration'>
            {this.showBottomButton(steps, billTypeCode)}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  }
}

