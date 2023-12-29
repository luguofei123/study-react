/*
 * @Descripttion: 票夹api
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 15:20:28
 * @LastEditors: lugfa
 * @LastEditTime: 2023-08-29 19:26:31
 * @FilePath: /study-react/src/views/代码示范/api.js
 */
import axios from '../api.request'
import service from '../../common/const/service'
const headers = { "content-type": "multipart/form-data" }
export const getAebfList = ({ clipType, agencyCodeStr, pageTab }) => {
    // 获取发票列表
    return axios.request({
        url: `/${service.BASE_BE_URL}/bm/clip/listAebfClip?clipType=${clipType}&agencyCodeStr=${agencyCodeStr}&used=${pageTab}`,
        method: "get",
        data: {},
        waitfor: false,
    });
}
// 附件上传 并识别
export const uploadFile = (options, clipType) => {
    let files = options.file
    let formData = new FormData()
    formData.append("file", files);
    return axios.request({
        url: `${options.action}`,
        method: "post",
        data: formData,
        waitfor: true,
        headers: headers,
    }).then(res => {
        if (res.count) {
            const data = res.data
            let formDataSave = new FormData()
            formDataSave.append("file", files);
            formDataSave.append('invoiceFrom', clipType)
            data.forEach(item => {
                Object.keys(item).forEach(key => {
                    formDataSave.append(key, item[key]);
                })
            })
            return axios.request({
                url: `/${service.BASE_BE_URL}${'/bm/ocr/discernAndSaveAttachment'}`,
                method: "post",
                data: formDataSave,
                waitfor: true,
                headers: headers,
            })
        }
    })
}

// 发票保存
export const saveBills = (list, param) => {
    return axios.request({
        url: `/${service.BASE_BE_URL}/bm/invoice/save/invoices?agencyCode=${param.agencyCodeStr}&tabType=${param.clipType}&agencyName=${param.agencyNameStr}`,
        method: "post",
        data: list,
        waitfor: true,
    })
}
// 发票更新
export const updataBills = (info) => {
    return axios.request({
        url: `/${service.BASE_BE_URL}/bm/invoice/update/invoice`,
        method: "post",
        data: info,
        waitfor: true,
    })
}

// 下载附件
export const downloadFile = (fileId) => {
    return new Promise(function (resolve, reject) {
        axios.request({
            method: 'get',
            url: `/${service.BASE_BE_URL}/bm/attachment/downloadFile/${fileId}`,
            responseType: 'blob',
            withCredentials: true
        }).then(res => {
            resolve(res)
        }).catch(error => {
            console.log(error)
        })
    })
}
// 根据invoiceId查询详情 
export const getDetailByFileId = (param) => {
    return axios.request({
        url: `/${service.BASE_BE_URL}/bm/invoice/query/detail/${param.invoiceId}/${param.clipType}`,
        method: "get",
        data: {},
        waitfor: false,
    });
}
// 获取修改记录
export const getInvoiceDiffList = (param) => {
    return axios.request({
        url: `/${service.BASE_BE_URL}/bm/diff/getInvoiceDiffList/${param.invoiceId}`,
        method: "get",
        data: {},
        waitfor: false,
    });
}
// 从我的票夹或者单位票夹跳转到详情 ，左侧数据和缩略图
export const getInvoicesLeft = (param) => {
    return axios.request({
        url: `/${service.BASE_BE_URL}/bm/invoice/query/invoices`,
        method: "post",
        data: param,
        waitfor: true,
    })
}
// 获取缩略图
export const getBash64FileAndContentType = (fileIds) => {
    return axios.request({
        url: `/${service.BASE_BE_URL}/bm/attachment/listThumbnailBash64FileAndContentType`,
        method: "post",
        data: fileIds,
        waitfor: true,
    })
}
// 删除发票 aebf/invoice/delete/invoices
export const deleteInvoices = (list) => {
    return axios.request({
        url: `/${service.BASE_BE_URL}/bm/invoice/delete/invoices`,
        method: "post",
        data: list,
        waitfor: true,
    })
}
// 上传增票
export const uploadVatFiles = (formData) => {
    return axios.request({
        url: `/${service.BASE_BE_URL}/bm/attachment/uploadVatFiles`,
        method: "post",
        data: formData,
        waitfor: true,
        headers: headers,
    })
}
// 获取系统配置
export const getAllSystemConfig = (obj) => {
    return axios.request({
        url: `/${service.BASE_BE_URL}/ar/sysset/arsyssetup/getArSysSetupListByCondition`,
        method: "post",
        data: obj,
        waitfor: false
    })
}
