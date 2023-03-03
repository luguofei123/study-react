import React from 'react'
import { modal } from '_c/YDFModal'
import { UnorderedListOutlined } from '@ant-design/icons';
// import SelectDomTree from '../../SelectDomTree'
import LCDIconSelect from '../../LCDIconSelect'
import YDFIcon from '_c/YDFIcon'
import './style.less'
import { Icon } from '@tinper/next-ui';

const fixedCls = 'lcd-stepconfg'
const refIcon = React.createRef()
const selectIcon = (onSelect) => {
  const refIcon = React.createRef()
  let selectIcon = ''
  const onClick = (icon) => {
    onSelect(icon)
    selectIcon = icon
    modal.close()
  }

  modal.open(
    {
      title: '选择图标',
      height: 550,
      width: 400,
      visible: true,
      sysbar: [],
      onOk: () => {
        if (selectIcon) {
          onSelect(selectIcon)
        }
      },
      children: <LCDIconSelect ref={refIcon} onClick={onClick} />
    }
  )
}
export default class LCDIconConfig extends React.Component {
  constructor(props) {
    super(props)
  }
  state = {
    selectIcon : ''
  }
  // onClick = (icon) => {
  //   onSelect(icon)
  //   this.setStateselectIcon = icon
  //   modal.close()
  // }
  selectLink = () => {
    selectIcon((icon) => {
      if (this.props.onChange) {
        this.props.onChange(icon)
      }
    })
    // const onChange = this.onChange
    // const $modal = modal.open(
    //   {
    //     title: '选择图标',
    //     height: 550,
    //     width: 400,
    //     visible: true,
    //     sysbar: [],
    //     /*       resizing: ({ height, width, top, left, $custom }) => {
    //             if ($custom) {
    //               $custom.update({ height: height, width, top, left })
    //             }
    //           }, */
    //     onOk: () => {
    //       if (selectIcon) {
    //         onChange(selectIcon)
    //       }
    //     },
    //     children: <LCDIconSelect ref={refIcon} onClick={onClick} />
    //   }
    // )
  }
  /////////

  render() {
    const { value = '' } = this.props
    return (
      <div className={`${fixedCls}`}>
        {value !== '' ? <span className={`${fixedCls}-block`}><YDFIcon type={value} size={14} /></span> : <span className="empty">请选择图标</span>}
        <UnorderedListOutlined onClick={this.selectLink} size={18} />
      </div>
    )
  }
}