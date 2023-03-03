import React from 'react';
import ReactDOM from 'react-dom';
import { Scrollbars } from 'react-custom-scrollbars'
import './popup-menu.less';
// import YDFIcon from '../YDFIcon'
function closest (el, selector) {
  var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

  while (el) {
    if (matchesSelector.call(el, selector)) {
      break;
    }
    el = el.parentElement;
  }
  return el;
}
class PopupMenu extends React.Component {
  constructor(props) {
    super(props);
    this.scorpioMenu = ''

    const menus = {
      dataSource: props.data,
      children: this.resolveMenuData(props.data || []),
    };
    this.state = {
      menus
    }
    this.listenDocClick = this.listenDocClick.bind(this)
  }

  resolveMenuData (menuData) {
    const data = [];
    menuData.forEach(item => {
      const dataItem = {
        dataSource: item,
        show: false,
        children: (Array.isArray(item.children) && item.children.length > 0)
          ? this.resolveMenuData(item.children) : [],
      };
      data.push(dataItem);
    });
    return data;
  }

  componentDidMount () {
    window.addEventListener('click', this.listenDocClick, true);
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.listenDocClick, true);
  }

  // 监听点击事件，触发onClose事件
  listenDocClick (e) {
    const clickScope = this.scorpioMenu.contains(e.target);
    const findLockedClose = closest(e.target, '.popup-locked')
    if (!clickScope && !findLockedClose) {
      this.hide()
    }
  }

  onHoverMenuItem (action, item) {
    if (action === 'enter') {
      item.show = true;
    }
    if (action === 'leave') {
      item.show = false;
    }
    this.setState({
      menu: this.state.menu,
    })
  }

  onClickMenuItem (item, e) {
    // 如果是非末级不能关
    if (item.children && item.children.length) {
      return false
    }
    const { onMenuClick } = this.props;
    // 阻止react合成事件的冒泡
    e.stopPropagation();
    if (onMenuClick) {
      onMenuClick(item.dataSource)
      this.hide()
    }
  }

  hide () {
    if (PopupMenu.destroy) {
      PopupMenu.destroy()
    }
  }
  renderThumbHorizontal ({ style, props }) {
    let scstyle = { ...style, display: 'none' }
    return (<div style={scstyle} {...props} />)
  }
  // 渲染菜单项
  renderMenu (menus) {
    const menuItems = [];
    let count = 0
    menus.children.forEach((item, index) => {
      const disabled = item.dataSource.disabled === true;
      if (item.children.length > 0) {
        menuItems.push((
          <li
            className={`scorpio-menu-item ${disabled ? 'disabled' : ''}`}
            key={index}
            onMouseEnter={this.onHoverMenuItem.bind(this, 'enter', item)}
            onMouseLeave={this.onHoverMenuItem.bind(this, 'leave', item)}
            onClick={this.onClickMenuItem.bind(this, item)}
          >
            {/* <YDFIcon size={16} type={item.dataSource.icon} />{item.dataSource.label} */}
            <div className="scorpio-menu-submenu-icon" />
            <div className={`scorpio-menu-submenu-container ${item.show ? '' : 'hide'}`}>
              {this.renderMenu(item)}
            </div>
          </li>
        ));
      } else {
        if (item.dataSource.divider === true) {
          menuItems.push((
            <li className="divider" key={index} />
          ));
        } else {
          menuItems.push((
            <li
              className={`scorpio-menu-item ${disabled ? 'disabled' : ''}`}
              onClick={this.onClickMenuItem.bind(this, item)}
              key={index}
            >
              {/* <YDFIcon size={16} type={item.dataSource.icon} /> {item.dataSource.label} */}
            </li>
          ));
        }
      }
      if (!item.dataSource.divider) {
        count = count + 1
      }
    });
    const panelHeight = 32 * count
    const showScroll = panelHeight > 200
    const style = { height: `200px`, width: '120px', overflowY: 'auto', overflowX: 'hidden' }
    const menuList = (
      <ul className="scorpio-menu-list" style={showScroll ? style : null}>
        {showScroll ? <Scrollbars renderThumbHorizontal={this.renderThumbHorizontal.bind(this)} style={{ height: '100%' }}>
          {menuItems}
        </Scrollbars> : menuItems}
      </ul>
    )
    return menuList;
  }

  render () {
    const { x, y, children, className, zIndex, width } = this.props
    const {
      menus
    } = this.state;
    return (
      <div
        className={`scorpio-menu-container ${className || ''}`}
        ref={
          ref => {
            if (ref) { this.scorpioMenu = ref }
          }
        }
      >
        {children ? children : this.renderMenu(menus)}
      </div>
    );
  }
}

PopupMenu.newInstance = function newNotificationInstance (properties) {
  if (PopupMenu.destroy) {
    PopupMenu.destroy()
  }
  let props = properties || {};
  let div = document.createElement('div');
  div.style = `position:absolute;left:${props.x}px;top:${props.y}px;z-index:${props.zIndex};${props.width ? 'width:' + props.width + 'px' : ''}`
  document.body.appendChild(div);
  let notification = ReactDOM.render(React.createElement(PopupMenu, props), div);

  PopupMenu.destroy = () => {
    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
    PopupMenu.destroy = null
  }
  return {
    destroy () {
      if (PopupMenu.destroy) {
        PopupMenu.destroy()
      }
    },
  };
};

export default PopupMenu