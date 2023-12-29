/*
 * @Descripttion: 检查结果
 * @version: 
 * @Author: lugfa
 * @Date: 2023-05-29 09:38:38
 * @LastEditors: lugfa
 * @LastEditTime: 2023-06-01 11:01:44
 * @FilePath: /yondif-a-ar-fe/yondif/src/views/ArAebf/Detail/compoents/CheckResult/index.jsx
 */
import { Tooltip } from '@tinper/next-ui';
import React, { Component } from 'react';
import './index.less'
class CheckResult extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checkStatus: {
                0: '查验异常',
                1: '查验通过',
                2: '查验不通过',
                3: '未查验',
                4: '无法查验',
                5: '不支持查验'
            }
        }
    }
    render () {
        const { invoiceInfo, background } = this.props
        const { checkState } = invoiceInfo
        const { checkStatus } = this.state
        const getClass = () => {
            let cls = ''
            if (checkState === '0' || checkState === '2') {
                cls = 'check-result error-result'
            }
            else if (checkState === '1') {
                cls = 'check-result success-result'
            } else {
                cls = 'check-result'
            }


            return cls
        }
        const styles = {
            background: background
        }
        return (checkState ? <Tooltip title={invoiceInfo.checkReason}>
            <div className={getClass()}>
                <div className="inner-circle"></div>
                <div className="check-status-box" style={styles}>
                    <div className="check-status">
                        {checkStatus[checkState]}
                    </div>
                </div>
            </div>
        </Tooltip> : '');
    }
}
CheckResult.defaultProps = {
    background: 'white'
}
export default CheckResult;
