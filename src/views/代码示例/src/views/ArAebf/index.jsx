/*
 * @Descripttion: 票夹详情
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-30 13:49:37
 * @FilePath: /study-react/src/views/代码示例/src/views/ArAebf/index.jsx
 */
import React, { Component } from 'react';
import { Message, Modal, Button, Table } from '@tinper/next-ui'
import ArAebfDetailHeader from './compoents/ArAebfDetailHeader'
import ArAebfDetailLeftSmall from './compoents/ArAebfDetailLeftSmall'
import ArAebfDetailLeftBig from './compoents/ArAebfDetailLeftBig'
import ArAebfDetailRight from './compoents/ArAebfDetailRight'
import {
  getAebfList,
  uploadFile,
  deleteInvoices,
  saveBills,
  updataBills,
  getDetailByFileId,
  getInvoicesLeft,
  getInvoiceDiffList,
  getBash64FileAndContentType
} from '../../../api/aebf/detail'
import { getUrlParameter, dunplicateId } from './compoents/utils'
import './index.less'
const $message = Message
class ArAebfDetail extends Component {
  constructor(props) {
    super(props)
    this.invoiceRef = React.createRef()
    this.state = {
      disabled: false,
      isCanSave: false,
      isLastPage: true,
      isFistPage: true,
      currentIndex: 1,  // 当前票第几个
      pageNum: 1,
      pageSize: 15,
      fileObj: {},  // 所有请求过的发票存在这个对象里面 
      showModel: '2',    // 默认显示样式
      listAebfClip: [],  // 票夹列表
      currentFolder: '', // 默认选中第一个票夹
      agencyCodeStr: '',
      agencyNameStr: '',
      pageType: '',   // 从哪个页面打开的
      pageTab: '',     // 从哪个tab打开的
      invoiceInfoList: [],
      currentInvoiceInfo: {}, // 当前选中的发票
      currentInvoiceInfoOld: {}, // 当前数据备份
      total: 0,         // 总条数
      startRow: 0,
      endRow: 0,
      prePage: 0,
      nextPage: 0,
      pages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      fileCount: 0,
      invoiceDiffList: [],
      isAddBillFlag: false,
      pdfOrOfdFile: '',
      zipFile: '',
      IS_MODIFI_AFTER_VERIFIED: '2',   // 检查通过的票是否允许修改 是 1  否 2
    }
  }
  // 上传文件参数
  upLoadProps = {
    name: 'file',
    action: '/iuap-apcom-file/rest/v1/file/u8c_test/' + new Date().getTime() + '/',
    showUploadList: false,
    multiple: true,
    accept: '.pdf,.ofd,.png,.jpg,.bmp,.jpeg,.gif,.svg'
  }
  componentDidMount () {
    this.initAebfDeail()
    document.getElementsByClassName('detail-left-small')[0].addEventListener('scroll', this.handerScrollLeft.bind(this), true)

  }
  // 票夹初始化
  initAebfDeail () {
    // 获取url参数，判断打开页面的类型
    let pageTab = getUrlParameter('pageTab')
    let disabled = false
    let pageType = ''
    if (pageTab === 'add') {
      pageType = 'add'
    } else if (pageTab === 'edit') {
      pageType = 'edit'
    } else {
      pageType = 'view'
      disabled = true
    }
    getAebfList({ clipType, pageTab }).then(res => {
      if (res.flag === 'success') {
        // 如果是编辑详情，需要查询详情接口
        this.setState({
          pageType: pageType,
          pageTab: pageTab,
          disabled: disabled,
          listAebfClip: res.data,
          currentFolder: clipId || res.data[0].clipId
        }, () => {
          this.getlistAebfInvoice(res.data[0].clipId, 'init')
        })
      } else {
        $message.error(`${res.msg}`)
      }
    })
  }
  // 根据url上的票夹信息，查询票夹下面的票据信息，但不包括图片信息,
  getlistAebfInvoice (defaultId, type) {
    let { pageTab, agencyCodeStr, clipType, invoiceInfoList, currentInvoiceInfo, pageNum, pageSize } = this.state
    const fileId = getUrlParameter('fileId')
    let invoiceId = getUrlParameter('invoiceId')
    const invoiceNo = getUrlParameter('invoiceNo') || ''
    const invoiceCode = getUrlParameter('invoiceCode') || ''
    let conditionsStr = getUrlParameter('conditionsStr')
    let conditions = JSON.parse(conditionsStr)
    let startTime = ''
    let endTime = ''
    if (conditions && conditions.length > 0) {
      conditions.forEach(item => {
        if (item.name === 'invoiceDate') {
          startTime = item.v1
          endTime = item.v2
        }
      })
    }
    let clipId = ''
    let pageNum1 = 1
    if (type === 'init') {
      clipId = getUrlParameter('clipId') || defaultId
      let clickIndex = this.jumperParam.clickIndex
      pageNum1 = Math.ceil(clickIndex / pageSize) || 1
    }
    let invoiceIds = []
    let param = {
      invoiceTypes: [],
      invoiceNo: invoiceNo,
      invoiceCode: invoiceCode,
      checkState: [],
      invoiceIds: invoiceIds,
      startTime: startTime,
      endTime: endTime,
      createUserName: '',
      vouNo: '',
      arBillNo: '',
      used: pageTab,
      exported: '',
      agencyCode: agencyCodeStr,
      edit: 'true',
      clipType: clipType,
      clipId: clipId,
      search: '',
      pageNum: type === 'init' ? pageNum1 : pageNum,
      pageSize: pageSize
    }
    getInvoicesLeft(param).then(res => {
      if (res.flag === 'success') {
        let result = res.data
        if (res.data.list.length === 0) return
        let { total, startRow, endRow, prePage, nextPage, fileCount, pageNum, pages, hasNextPage, hasPreviousPage } = result
        this.setState({
          total, startRow, endRow, prePage, nextPage, fileCount, pageNum, pages, hasNextPage, hasPreviousPage
        })
        result.list.forEach((item, index) => {
          let tmpFiledUuid = dunplicateId()
          let groupImg = {}
          if (item.invoiceId === invoiceId) {
            groupImg = {
              name: item.fileName,
              sourceImg: item.imgPreviewUrl,
              sourceImgHeight: item.sourceImgHeight,
              sourceImgWidth: item.sourceImgWidth,
              invoiceInfo: item,
              uuid: tmpFiledUuid
            }
            currentInvoiceInfo = groupImg
          } else {
            groupImg = {
              name: item.fileName,
              sourceImg: item.imgPreviewUrl,
              sourceImgHeight: item.sourceImgHeight,
              sourceImgWidth: item.sourceImgWidth,
              invoiceInfo: item,
              uuid: tmpFiledUuid
            }
          }

          if (type === 'pre') {
            invoiceInfoList.unshift(groupImg)
          } else {
            invoiceInfoList.push(groupImg)
          }
        })

        this.setState({
          invoiceInfoList: invoiceInfoList
        }, () => {

          if (type === 'init') {

            if (currentInvoiceInfo && Object.keys(currentInvoiceInfo).length) {
              this.showDetail(currentInvoiceInfo, currentInvoiceInfo?.invoiceInfo?.invoiceId, 'scroll')
            } else {
              this.showDetail(invoiceInfoList[0], invoiceInfoList[0].invoiceInfo?.invoiceId)
            }
          }
          if (type === 'delete') {
            this.showDetail(invoiceInfoList[0], invoiceInfoList[0].invoiceInfo?.invoiceId)
          }
        })

      } else {
        $message.error(`${res.msg}`)
      }
    })



  }
  // 判断当前是第几个
  getCurrentPage () {
    let { currentInvoiceInfo, invoiceInfoList, pageType } = this.state
    let currentIndex = 1
    invoiceInfoList.forEach((item, index) => {
      if (pageType === 'add') {
        if (item.invoiceInfo.invoiceNo === currentInvoiceInfo?.invoiceInfo?.invoiceNo) {
          currentIndex = index + 1
        }
      } else {
        if (item.invoiceInfo.invoiceId === currentInvoiceInfo?.invoiceInfo?.invoiceId) {
          currentIndex = index + 1
        }
      }

    })
    return currentIndex
  }
  // 头部事件 保存 下一页 上一页
  headerChange (type, value, currentInvoiceInfo) {
    if (type === 'radio') {
      console.log(currentInvoiceInfo)
      this.setState({
        showModel: value
      })
    }
    if (type === 'select') {
      console.log(currentInvoiceInfo)
      this.setState({
        currentFolder: value
      })
    }
    if (type === 'save') {
      console.log(currentInvoiceInfo)
      let result = this.saveBeforeCheckData()
      if (result) {
        // 调用保存接口
        this.handleSaveOrUpdata()
      }
    }
    if (type === 'prePage' || type === 'nextPage') {

      let { invoiceInfoList, isCanSave, pageType } = this.state
      let that = this
      if (isCanSave && pageType === 'edit') {
        this.TingperModal = Modal.info({
          title: '提示',
          content: (<div>
            <p>当前票据内容有修改，是否保存?</p>
          </div>),
          onOk (_e) {
            console.log('ok');
            that.handleSaveOrUpdata()
          },
          onCancel () {
            that.setState({
              isCanSave: false
            }, () => {
              that.goTopage(invoiceInfoList, value)
            })
          },
          afterClose: () => {
            console.log('afterclose');
            // 恢复修改的数据

            // that.goTopage(invoiceInfoList, value)
          },
          centered: true,
          keyboard: true,
          autoFocus: 'ok',
        });
      } else {
        this.goTopage(invoiceInfoList, value)
      }
    }

  }
  // 页码定位
  goTopage (invoiceInfoList, value) {
    let currentIndex = this.getCurrentPage()
    currentIndex = currentIndex + value
    let { total, startRow, endRow, pageNum, pageType } = this.state

    if (pageType === 'add') {
      if (currentIndex === 0) {
        $message.warning('当前是第一页!')
        return
      }
      if (currentIndex > invoiceInfoList.length) {
        $message.warning('当前是最后一页!')
        return
      }
    }

    if (invoiceInfoList[currentIndex - 1]) {
      // 请求详情
      let preInvoiceInfo = invoiceInfoList[currentIndex - 1]
      this.showDetail(preInvoiceInfo, preInvoiceInfo.invoiceInfo.fileId)

    } else {

      // 说明所有数据都查询完了
      if (invoiceInfoList.length === total) {

        if (currentIndex === 0) {
          $message.warning('当前是第一页!')
          return
        }
        if (currentIndex > total - 1) {
          $message.warning('当前是最后一页!')
          return
        }
      }
      // 下一页
      if (currentIndex > endRow) {
        this.setState({
          pageNum: pageNum + 1
        }, () => {
          this.getlistAebfInvoice('', 'next')
        })
      }
      // 上一页
      if (currentIndex < startRow) {
        this.setState({
          pageNum: pageNum - 1
        }, () => {
          this.getlistAebfInvoice('', 'pre')
        })
      }
    }
  }
  // 滚动监听
  handerScrollLeft (e, type) {
    let dom = document.getElementsByClassName('detail-left-small')[0]
    const clientHeight = dom.clientHeight;
    const scrollTop = dom.scrollTop;
    const scrollHeight = dom.scrollHeight;
    if (clientHeight + scrollTop === scrollHeight) {
      console.log('竖向滚动条已经滚动到底部')
      let { invoiceInfoList, hasNextPage, pageNum, total } = this.state
      if (invoiceInfoList.length === total) {
        return false
      }
      if (hasNextPage) {
        this.setState({
          pageNum: pageNum + 1
        }, () => {
          this.getlistAebfInvoice('', 'next')
        })
      }

    }
    if (scrollTop === 0) {
      console.log('竖向滚动条已经滚动到顶部')
      let { invoiceInfoList, hasPreviousPage, pageNum, total } = this.state
      if (invoiceInfoList.length === total) {
        return false
      }
      // 说明所有数据都查询完了
      if (hasPreviousPage) {
        this.setState({
          pageNum: pageNum - 1
        }, () => {
          this.getlistAebfInvoice('', 'pre')
        })
      }


    }

  }
  // 新增页面的按钮状态判断
  headerButtonStausAdd () {
    const { currentInvoiceInfo, invoiceInfoList } = this.state
    if (invoiceInfoList.length == 0 || invoiceInfoList.length == 1) {
      this.setState({
        isLastPage: true,
        isFistPage: true
      })
    } else {
      let field = 'invoiceNo'
      invoiceInfoList.forEach((item, index) => {
        if (item.invoiceInfo[field] === currentInvoiceInfo?.invoiceInfo[field]) {
          if (index === 0) {
            this.setState({
              isLastPage: false,
              isFistPage: true
            })
          } else if (index === invoiceInfoList.length - 1) {
            this.setState({
              isLastPage: true,
              isFistPage: false
            })
          } else {
            this.setState({
              isLastPage: false,
              isFistPage: false
            })
          }
        }
      })

    }
  }
  // 非新增页面按钮状态判断 需要判断有没有分页的情况 
  headerButtonStausOther () {
    const { currentInvoiceInfo, invoiceInfoList, total, startRow, endRow, pageNum } = this.state
    let currentIndex = this.getCurrentPage()
    this.setState({
      isLastPage: false,
      isFistPage: false
    })
  }
  // 判断按钮状态，是否可以点击
  headerButtonStaus () {
    const { pageType } = this.state
    if (pageType === 'add') {

      this.headerButtonStausAdd()

    } else {
      this.headerButtonStausOther()
    }

  }
  // 票据修改
  invoiceInfoChange (code, value) {
    let { currentInvoiceInfo, invoiceInfoList, pageType } = this.state
    currentInvoiceInfo.invoiceInfo[code] = value
    invoiceInfoList.forEach((item, index) => {
      if (pageType === 'add') {
        if (item.invoiceInfo.invoiceNo === currentInvoiceInfo?.invoiceInfo?.invoiceNo) {
          invoiceInfoList[index] = currentInvoiceInfo
        }
      }
      if (pageType === 'edit') {
        if (item.invoiceInfo.invoiceId === currentInvoiceInfo?.invoiceInfo?.invoiceId) {
          invoiceInfoList[index] = currentInvoiceInfo
        }
      }

    })
    this.setState({
      invoiceInfoList: invoiceInfoList,
      currentInvoiceInfo: currentInvoiceInfo,
      isCanSave: true
    })
  }
  // 左侧显示的照片是再次经过请求获取的base64数据 ,首次加载5个，滚动时仔再加载
  getBash64FileAndContentType (fileIds, list) {
    getBash64FileAndContentType(fileIds).then(res => {
      if (res.flag === 'success') {
        let resultImgArr = res.data
        const { invoiceInfoList } = this.state
        list.forEach((item, index) => {
          let tmpFiledUuid = dunplicateId()
          let groupImg = {}
          resultImgArr.forEach((item1, index1) => {
            if (item1.fileId === item.fileId && !item.sourceImg) {
              groupImg = {
                name: item.fileName,
                sourceImg: `data:image/jpeg;base64,${item1.base64String}`,
                sourceImgHeight: item1.sourceImgHeight,
                sourceImgWidth: item1.sourceImgWidth,
                invoiceInfo: item,
                uuid: tmpFiledUuid
              }
            }
          })

          invoiceInfoList.push(groupImg)
        })

        this.setState({
          invoiceInfoList: invoiceInfoList
        })
      }
    })
  }
  // 保存数据前要修改部分数据树的格式
  saveBeforeModifyData (list) {
    const { pageType } = this.state
    // 批量修改保存数据 
    if (pageType === 'add') {
      list.forEach(item => {
        if (item.invoiceInfo.vatDetails) {
          item.invoiceInfo.vatDetails.forEach(item1 => {
            if (item1.taxRate && Number(item1.taxRate) >= 1) {
              item1.taxRate = item1.taxRate + '%'
            }
          })
        }
      })
    }
    return list
  }
  // 判断是更新还是新增
  handleSaveOrUpdata (flag) {
    if (this.TingperModal) {
      setTimeout(() => {
        this.TingperModal.destroy();
      }, 300)
    }
    const { pageType } = this.state
    if (pageType === 'add') {
      this.billsSave(flag)
    } else {
      this.billsUpdata(flag)
    }
  }
  // 编辑保存
  billsUpdata (flag) {
    let { currentInvoiceInfo, currentFolder } = this.state
    let { invoiceInfo } = currentInvoiceInfo
    invoiceInfo.clipIds = currentFolder
    if (flag) {
      invoiceInfo.ignoreRule = '1'
    }
    updataBills(invoiceInfo).then(res => {
      if (res.flag === 'success') {
        $message.success(`${res.data}`)
        this.setState({
          isCanSave: false
        })
        let pageTypeStr = getUrlParameter('openBy')

        if (pageTypeStr === 'aebf') {
          localStorage.setItem('aebfFresh', 'refresh')
        }

      } else {
        this.dealWithError(res)
      }
    }).catch(res => {
      if (res.data.code === 999) {
        if (res.data.message) {
          let msg = res.data.message.split(' ')[1]
          let obj = {
            content: msg,
            duration: null
          }
          $message.error(obj)
        }
      }
    })
  }
  // 只有在新增单据才会调用这个方法
  billsSave (flag) {
    let { currentFolder, clipType, agencyCodeStr, agencyNameStr } = this.state
    let invoiceInfoListCopy = JSON.parse(JSON.stringify(this.state.invoiceInfoList))
    invoiceInfoListCopy = this.saveBeforeModifyData(invoiceInfoListCopy)
    let list = []
    let parenIdObj = {}
    invoiceInfoListCopy.forEach(item => {
      if (flag) {
        item.invoiceInfo.ignoreRule = '1'
      }
      if (parenIdObj[item.invoiceInfo.parentUuid]) {
        list.forEach(item1 => {
          if (item1.uuid === item.invoices.parentUuid) {
            item.invoiceInfo.clipIds = currentFolder
            item1.invoices.push(item.invoiceInfo)
          }
        })
      } else {
        item.invoiceInfo.clipIds = currentFolder
        item.invoices = [item.invoiceInfo]
        delete item.sourceImg
        delete item.invoiceInfo
        delete item.isShowMask
        list.push(item)
        parenIdObj[item.uuid] = ''
      }
    })

    saveBills(list, { clipType, agencyCodeStr, agencyNameStr }).then(res => {
      if (res.flag === 'success') {
        this.setState({
          isCanSave: false
        })
        let pageTypeStr = getUrlParameter('openBy')

        if (pageTypeStr === 'aebf') {
          localStorage.setItem('aebfFresh', 'refresh')
        }
        $message.success(`${res.msg}`)
      } else {
        this.dealWithError(res)
      }
    }).catch(res => {
      if (res.data.code === 999) {
        if (res.data.message) {
          let msg = res.data.message.split(' ')[1]
          let obj = {
            content: msg,
            duration: null
          }
          $message.error(obj)
        }
      }
    })

  }
  // 错误处理
  dealWithError (res) {
    let that = this
    if (res.msg?.includes('{')) {
      let msg = JSON.parse(res.msg)
      // 禁止
      if (msg.prohibitError && msg.prohibitError.length > 0) {
        let content = msg.prohibitError.map((item, index) => {
          return <div key={index}> <p>{item}</p></div>
        })
        Modal.error({
          title: '禁止',
          okText: '知道了',
          width: 700,
          cancelButtonProps: {
            style: {
              display: 'none'
            }
          },
          content: <div><h1 style={{ color: 'red', fontSize: 14, fontWeight: 'normal' }}>以下票据数据格式错误：</h1>{content}</div>,
        });

        return
      }
      // 警告
      if (msg.warnError && msg.warnError.length > 0) {
        let content = msg.warnError.map((item, index) => {
          return <div key={index}> <p>{item}</p></div>
        })
        Modal.warning({
          title: '警告',
          width: 700,
          okText: '保存',
          content: <div><h1 style={{ color: 'red', fontSize: 14, fontWeight: 'normal' }}>以下票据数据格式错误：</h1>{content}</div>,
          onOk (_e) {
            // 继续保存？ ignoreRule = 1
            that.handleSaveOrUpdata(true)
          },
        });
      }
      // 
    } else {

      $message.error(res.msg)
    }
  }
  // 详情显示
  showDetailAdd (item, id, type) {
    let { invoiceInfoList, IS_MODIFI_AFTER_VERIFIED } = this.state
    let currentInvoiceInfoOld = JSON.parse(JSON.stringify(item))
    invoiceInfoList.forEach(item1 => {
      item1.isShowMask = true
      if (item1.invoiceInfo.invoiceNo === item.invoiceInfo.invoiceNo) {
        item1.isShowMask = false
      }
    })
    this.loadCompByInvoice('')   // 先置空组件

    let disabled = false
    let isCanSave = true
    if (item?.invoiceInfo?.checkState === '1') {
      // 检查通过的票是否允许修改 是 1  否 2)
      if (IS_MODIFI_AFTER_VERIFIED === '1') {
        disabled = false
      }
      if (IS_MODIFI_AFTER_VERIFIED === '2') {
        disabled = true
      }
    }
    if (this.globView) {
      disabled = true
    }
    this.setState({
      invoiceInfoList: invoiceInfoList,
      currentInvoiceInfo: item,
      currentInvoiceInfoOld: currentInvoiceInfoOld,
      disabled: disabled,
      isCanSave: isCanSave

    }, () => {
      this.headerButtonStaus(type)
      this.loadCompByInvoice(item.invoiceInfo.invoiceType)
      // 需要将左侧票据滚到可视区域
      if (type === 'scroll') {
        let currentIndex = this.getCurrentPage()
        let scrollHeight = (currentIndex - 2) * 234
        if (document.getElementsByClassName('detail-left-small')[0]) {
          document.getElementsByClassName('detail-left-small')[0].scrollTop = scrollHeight
        }
      }
    })

  }
  // 其他详情显示
  showDetailOther (item, id, type) {
    let { invoiceInfoList, clipType, pageType, isCanSave } = this.state
    let that = this
    if (isCanSave) {
      this.TingperModal = Modal.info({
        title: '提示',
        content: (<div>
          <p>当前票据内容有修改，是否保存?</p>
        </div>),
        onOk (_e) {
          that.handleSaveOrUpdata()
        },
        onCancel () {
          that.setState({
            isCanSave: false
          }, () => {

            let param = {
              invoiceId: item.invoiceInfo.invoiceId,
              clipType: clipType
            }

            that.getDetailByFileId(param, item, type)
            that.getInvoiceDiffList(param, item, type)

          })
        },
        afterClose: () => {
          console.log('关闭取消')
        },
        centered: true,
        keyboard: true,
        autoFocus: 'ok',
      });
    } else {

      let param = {
        invoiceId: item.invoiceInfo.invoiceId,
        clipType: clipType
      }

      this.getDetailByFileId(param, item, type)
      this.getInvoiceDiffList(param, item, type)
    }

  }
  // 获取修改记录
  getInvoiceDiffList (param, item) {
    getInvoiceDiffList(param).then(res => {
      if (res.flag === 'success') {
        let invoiceDiffList = res.data
        this.setState({
          invoiceDiffList: invoiceDiffList
        })
      } else {
        $message.error(`${res.msg}`)
      }

    })
  }
  // 根据票夹id获取详情
  getDetailByFileId (param, item, type) {
    let { invoiceInfoList, clipType, pageType, isCanSave, IS_MODIFI_AFTER_VERIFIED } = this.state
    getDetailByFileId(param).then(res => {
      if (res.flag === 'success') {
        let clips = res.data.clips
        let invoice = res.data.invoice
        let disabled = false
        if (invoice.checkState === '1') {
          // 检查通过的票是否允许修改 是 1  否 2)
          if (IS_MODIFI_AFTER_VERIFIED === '1') {
            disabled = false
          }
          if (IS_MODIFI_AFTER_VERIFIED === '2') {
            disabled = true
          }

          isCanSave = false
        }

        if (this.globView) {
          disabled = true
        }

        let currentInvoiceInfoOld = JSON.parse(JSON.stringify(invoice))
        let currentInvoiceInfo = {}
        invoiceInfoList.forEach((item1, index) => {
          item1.isShowMask = true
          if (item1.invoiceInfo.invoiceId === item.invoiceInfo.invoiceId) {
            invoiceInfoList[index].invoiceInfo = invoice
            currentInvoiceInfo = invoiceInfoList[index]
            item1.isShowMask = false
          }
        })
        this.loadCompByInvoice('')   // 先置空组件
        this.setState({
          invoiceInfoList: invoiceInfoList,
          currentInvoiceInfo: currentInvoiceInfo,
          currentInvoiceInfoOld: currentInvoiceInfoOld,
          currentFolder: clips[0].clipId,
          disabled: disabled,
          isCanSave: isCanSave

        }, () => {
          this.headerButtonStaus()
          this.loadCompByInvoice(invoice.invoiceType)
          // 需要将左侧票据滚到可视区域
          if (type === 'scroll') {
            let currentIndex = this.getCurrentPage()
            let scrollHeight = (currentIndex - 2) * 234
            if (document.getElementsByClassName('detail-left-small')[0]) {
              document.getElementsByClassName('detail-left-small')[0].scrollTop = scrollHeight
            }
          }
        })
      } else {
        $message.error(`${res.msg}`)
      }
    })
  }
  // 点击缩略图，查询详情
  showDetail (item, id, type) {
    let { pageType } = this.state
    if (pageType === 'add') {
      this.showDetailAdd(item, id, type)
    } else {
      this.showDetailOther(item, id, type)

    }

  }
  // 加载发票组建
  loadCompByInvoice (type) {
    if (this.invoiceRef && this.invoiceRef.current.loadCompByInvoice) {
      this.invoiceRef.current.loadCompByInvoice(type)
    }
  }
  // 上传文件
  uploadFile (options, type) {
    const { onSuccess, onError, file, onProgress } = options
    const { clipType } = this.state
    // 判断文件大小
    if (file.size > 1024 * 1024 * 10) {
      $message.warning('文件大小不能超过10M!')
      return false
    }

    uploadFile(options, clipType).then(res => {
      if (res.error === false) {
        let fileData = res.data || []
        this.packedData([fileData])

      } else {
        $message.error(`${res.msg}`)
      }
    })
  }
  // 组装数据
  packedData (fileData) {
    let { invoiceInfoList } = this.state
    invoiceInfoList = JSON.parse(JSON.stringify(invoiceInfoList))
    for (let i = 0; i < fileData.length; i++) {
      let tmpFiledUuid = dunplicateId()
      let groupItem = fileData[i]
      groupItem.invoices.forEach((item, index) => {
        if (item.position && item.position.length === 4) {
          item.position = [item.position[0], item.position[2], item.position[1], item.position[2], item.position[1], item.position[3], item.position[0], item.position[3]]
        }
        item.uuid = dunplicateId()
        item.parentUuid = tmpFiledUuid
        let groupImg = {
          name: groupItem.invoices[0].fileName,
          sourceImg: `data:image/jpeg;base64,${groupItem.sourceImg}`,
          sourceImgHeight: groupItem.sourceImgHeight,
          sourceImgWidth: groupItem.sourceImgWidth,
          invoiceInfo: item,
          uuid: tmpFiledUuid,
          isFirst: index === groupItem.invoices.length - 1 ? true : false
        }
        invoiceInfoList.unshift(groupImg)
      })
    }
    this.loadCompByInvoice('')
    this.setState({
      invoiceInfoList: invoiceInfoList,
      currentInvoiceInfo: invoiceInfoList[0],
      isCanSave: true
    }, () => {
      const { currentInvoiceInfo } = this.state
      this.showDetail(currentInvoiceInfo, currentInvoiceInfo.invoiceInfo.invoiceNo, 'scroll')
      this.headerButtonStaus()
    })
  }
  // 删除文件 前端删除
  deleteByFront (info, fieldid, type) {
    let { invoiceInfoList } = this.state
    let deleteIndex = null
    if (type === 'deleteParent') {
      invoiceInfoList = invoiceInfoList.filter(i => i.uuid !== info.uuid)

      if (invoiceInfoList.length > 0) {
        deleteIndex = 1
      }

    } else {

      invoiceInfoList.forEach((item, index) => {
        if (item.invoiceInfo.rowDataId === info.invoiceInfo.rowDataId) {
          deleteIndex = index
          invoiceInfoList.splice(index, 1)
        }
      })
    }


    this.setState({
      invoiceInfoList: invoiceInfoList
    }, () => {

      if (invoiceInfoList.length > 0) {
        if (invoiceInfoList[deleteIndex]) {
          this.goTopage(invoiceInfoList, deleteIndex)
        } else {
          this.goTopage(invoiceInfoList, deleteIndex - 1)
        }
      } else {

        this.loadCompByInvoice('')
        this.setState({
          currentInvoiceInfo: {}
        })

      }

    })

  }
  // 删除票据
  deleteInvoices (info, fieldid, type) {
    let that = this
    const { pageType } = this.state
    this.TingperModal = Modal.info({
      title: '提示',
      content: (<div>
        <p>确定要删除该票据吗?</p>
      </div>),
      onOk (_e) {
        console.log('ok');
        if (pageType === 'add') {
          // 前端删除
          that.deleteByFront(info, fieldid, type)

        } else if (pageType === 'edit') {
          let list = [info.invoiceInfo]
          deleteInvoices(list).then(res => {
            if (res.flag === 'success') {
              that.getlistAebfInvoice('', 'delete')
            } else {
              $message.error(`${res.msg}`)
            }
          })
        } else {
          console.log('qita')
        }

      },
      afterClose: () => {
        console.log('afterclose');

      },
      centered: true,
      keyboard: true,
      autoFocus: 'ok',
    });

  }
  render () {
    const { disabled, pageType, showModel, listAebfClip, currentFolder, invoiceInfoList, isCanSave, isLastPage, isFistPage, currentInvoiceInfo, fileCount, total, invoiceDiffList, isAddBillFlag, pdfOrOfdFile, zipFile } = this.state
    let props = {
      pageType, currentInvoiceInfo, listAebfClip, currentFolder, showModel, disabled
    }
    return (<div className="ar-aebf">
      <ArAebfDetailHeader
        upLoadProps={this.upLoadProps}
        uploadFile={this.uploadFile.bind(this)}
        addBillUpload={this.addBillUpload.bind(this)}
        headerChange={this.headerChange.bind(this)}
        {...props}
      />
      {showModel === '2' ?
        <ArAebfDetailLeftSmall
          upLoadProps={this.upLoadProps}
          addBillUpload={this.addBillUpload.bind(this)}
          uploadFile={this.uploadFile.bind(this)}
          showDetail={this.showDetail.bind(this)}
          deleteInvoice={this.deleteInvoices.bind(this)}
          {...props}
        />
        : <ArAebfDetailLeftBig
          deleteInvoice={this.deleteInvoices.bind(this)}
          invoiceInfo={currentInvoiceInfo}
          invoiceInfoList={invoiceInfoList}
          {...props}
        />
      }
      <ArAebfDetailRight
        ref={this.invoiceRef}
        headerChange={this.headerChange.bind(this)}
        invoiceInfoChange={this.invoiceInfoChange.bind(this)}
        {...props}
      />

    </div>);
  }
}
export default ArAebfDetail;
