// import { Component } from 'react'
// import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
// import './App.css';
// import ConTrolPanel from './page/ConTrolPanel'
// import Table from './page/Table'
// import TableReact from './page/TableReact'
// // import TableReactEdit from './page/TableReactEdit/TableReactEdit'
// import TableAnt from './page/TableAnt'
// import Myform from './page/Myform'
// import Times from './page/Times'
// import Ceshi from './page/Ceshi'
// import InputQrcode from './page/InputQrcode'

// class App extends Component {
//   render () {
//     return (
//       <BrowserRouter>

//         <div className="App">
//           <div>
//             <Link to='/form'>表单</Link>
//             <Link to='/table'>ali-react-table表格</Link>
//             <Link to='/table1'>@tanstack/react-table表格</Link>
//             {/* <Link to='/table2'>@tanstack/react-table编辑表格</Link> */}
//             <Link to='/table3'>ant表格</Link>
//             <Link to='/conTrolPanel'>按钮</Link>
//             {/* <Link to='/time'>时钟</Link> */}
//             {/* <Link to='/test'>测试</Link> */}
//             <Link to='/qrcode'>二维码</Link>
//           </div>

//           <Routes>
//             <Route path="/form" exact element={<Myform />} />
//             <Route path="/table" exact element={<Table />} />
//             <Route path="/table1" exact element={<TableReact />} />
//             {/* <Route path="/table2" exact element={<TableReactEdit />} /> */}
//             <Route path="/table3" exact element={<TableAnt />} />
//             <Route path="/conTrolPanel" exact element={<ConTrolPanel />} />
//             <Route path="/time" exact element={<Times />} />
//             <Route path="/test" exact element={<Ceshi />} />
//             <Route path="/qrcode" exact element={<InputQrcode defaultValue="ff" />} />
//           </Routes>


//         </div>

//       </BrowserRouter>
//     );
//   }
// }

// export default App


import React from "react";
import { Provider } from "react-redux";
import zhCN from "antd/es/locale/zh_CN";
// import "antd/dist/antd.variable.less";
// import { hot } from 'react-hot-loader/root';
import Router from "./router/index";
import store from "./redux/index";
import { ConfigProvider } from "antd";
// import './assets/css/common.css'
// import '/public/css/common.css'

ConfigProvider.config({
  theme: {
    primaryColor: "#EE2223",
  },
});
class App extends React.Component {
  render () {
    return (

      <ConfigProvider>
        <Provider store={store}>
          <Router />
        </Provider>
      </ConfigProvider>

    );
  }
}

export default App;

