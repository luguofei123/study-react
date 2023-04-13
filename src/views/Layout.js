import { Route, Routes, useNavigate } from 'react-router-dom';
import WorkZone from '../page/WorkZone/WorkZone'
import 'highlight.js/styles/a11y-dark.css'
// a11y-dark
// androidstudio
// atelier-cave-dark
// import 'antd/dist/reset.css';
// 组件
import Component from './RactApi/Component/Component'
import PureComponent from './RactApi/Component/PureComponent'
import Memo from './RactApi/Component/Memo'
import ForwardRef from './RactApi/Component/ForwardRef'
import Fragment from './RactApi/Component/Fragment'
import LazySuspense from './RactApi/Component/LazySuspense'
import ProfilerT from './RactApi/Component/Profiler'
import StrictMode from './RactApi/Component/StrictMode'
// 工具
import CrateElement from './RactApi/react-tool/CrateElement'
import CloneElement from './RactApi/react-tool/CloneElement'
import CreatContent from './RactApi/react-tool/CreatContent'
import Children from './RactApi/react-tool/Children'
import CreateRef from './RactApi/react-tool/CreateRef'
import IsValidElement from './RactApi/react-tool/IsValidElement'
// 生命周期
import LifeCycle from './RactApi/lifeCycle/LifeCycle'
// react-hook
import UseState from './RactApi/react-hook/UseState'
import UseEffect from './RactApi/react-hook/UseEffect'
import UseMemo from './RactApi/react-hook/UseMemo'
import UseCallback from './RactApi/react-hook/UseCallback'
import UseRef from './RactApi/react-hook/UseRef'
import UseImperativeHandle from './RactApi/react-hook/UseImperativeHandle'
// react-dom
import CreatePortal from './RactApi/react-dom/CreatePortal'
import FlushSynct from './RactApi/react-dom/FlushSynct'
import UnstableBatchedUpdates from './RactApi/react-dom/UnstableBatchedUpdates'
// formily 测试
import Formily from './Formily/Formily'
// 单据设计器组件测试
import BillDesigner from './BillDesigner/index'
// tinperUI测试
import Table from './Tinper/Table/table';
import TreeSelect from './Tinper/TreeSelect'
// 测试react 插入组件方法
import ReactSlot from './ReactSlot'



import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    // ShopOutlined,
    // TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import React from 'react';
const { Content, Sider } = Layout;

const items = [
    { key: '/design', label: '单据设计器渲染', icon: UserOutlined, },
    {
        key: 'React', label: 'React API', icon: VideoCameraOutlined, children: [
            {
                key: 'React-Component', label: '组件类', icon: '', children: [
                    { key: 'Component', label: 'Component', icon: '' },
                    { key: 'PureComponent', label: 'PureComponent', icon: '' },
                    { key: 'memo', label: 'memo', icon: '' },
                    { key: 'forwardRef', label: 'forwordRef', icon: '' },
                    { key: 'Fragment', label: 'Fragment', icon: '' },
                    { key: 'lazySuspense', label: 'lazy+Suspense', icon: '' },
                    { key: 'Profiler', label: 'profiler', icon: '' },
                    { key: 'StrictMode', label: 'StrictMode', icon: '' }
                ]
            },
            {
                key: 'React-Tool', label: '工具类', icon: '', children: [
                    { key: 'CrateElement', label: 'CrateElement', icon: '' },
                    { key: 'CloneElement', label: 'CloneElement', icon: '' },
                    { key: 'CreatContent', label: 'CreatContent', icon: '' },
                    { key: 'Children', label: 'Children', icon: '' },
                    { key: 'createRef', label: 'createRef', icon: '' },
                    // { key: 'createFactory', label: 'createFactory', icon: '' },
                    { key: 'isValidElement', label: 'isValidElement', icon: '' },
                    // { key: 'version', label: 'version', icon: '' },
                ]
            },
            {
                key: 'react-hook', label: 'react-hook', icon: '', children: [
                    { key: 'useState', label: 'useState', icon: '' },
                    { key: 'useEffect', label: 'useEffect', icon: '' },
                    { key: 'useMemo', label: 'useMemo', icon: '' },
                    { key: 'useCallback', label: 'useCallback', icon: '' },
                    { key: 'useRef', label: 'useRef', icon: '' },
                    { key: 'useImperativeHandle', label: 'unstable_batchedUpdates', icon: '' },
                ]
            },
            {
                key: 'react-dom', label: 'react-dom', icon: '', children: [
                    { key: 'createPortal', label: 'createPortal', icon: '' },
                    { key: 'flushSync', label: 'flushSync', icon: '' },
                    { key: 'unstableBatchedUpdates', label: 'unstableBatchedUpdates', icon: '' },
                ]
            },
            {
                key: 'lifeCycle', label: '生命周期', icon: '', children: [
                    { key: 'lifeCycle1', label: '生命周期和执行顺序', icon: '' },
                ]
            },
        ]
    },
    {
        key: 'Formily', label: 'Formily', icon: UploadOutlined
    },
    { key: 'BillDesigner', label: 'BillDesigner测试', icon: BarChartOutlined, },
    { key: '/ReactSlot', label: '测试ReactSlot', icon: CloudOutlined, },
    {
        key: 'tinperUI', label: 'tinperUI', icon: AppstoreOutlined, children: [
            { key: 'table', label: 'Table', icon: '' },
            { key: 'treeSelect', label: 'TreeSelect', icon: '' },
        ]
    },
    // { key: '/7', label: '菜单1', icon: TeamOutlined, },
    // { key: '/8', label: '菜单1', icon: ShopOutlined, }
].map((item, index) => {
    if (item.children) {
        return {
            key: item.key,
            icon: React.createElement(item.icon),
            label: item.label,
            children: item.children
        }
    } else {
        return {
            key: item.key,
            icon: item.icon ? React.createElement(item.icon) : '',
            label: item.label,

        }
    }

}
);
const App = () => {
    const navigate = useNavigate()
    const menuClick = (e) => {
        console.log(e)
        navigate(e.key, { replace: true })
    }
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout hasSider>
            <Sider
                style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    bottom: 0,
                }}
            >
                <div
                    style={{
                        height: 32,
                        margin: 16,
                        background: 'rgba(255, 255, 255, 0.2)',
                    }}
                />
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']} items={items} onClick={menuClick} />
            </Sider>
            <Layout
                className="site-layout"
                style={{
                    marginLeft: 200,
                }}
            >
                {/* <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                ></Header> */}
                <Content
                    style={{
                        margin: '24px 16px 0',
                        overflow: 'initial',
                    }}
                >
                    <div
                        style={{
                            padding: 24,
                            textAlign: 'center',
                            background: colorBgContainer,
                        }}
                    >
                        <Routes>
                            <Route exact path='/design' element={<WorkZone />}></Route>
                            {/* 组件 */}
                            <Route exact path='/Component' element={<Component />}></Route>
                            <Route exact path='/PureComponent' element={<PureComponent />}></Route>
                            <Route exact path='/memo' element={<Memo />}></Route>
                            <Route exact path='/forwardRef' element={<ForwardRef />}></Route>
                            <Route exact path='/Fragment' element={<Fragment />}></Route>
                            <Route exact path='/lazySuspense' element={<LazySuspense />}></Route>
                            <Route exact path='/Profiler' element={<ProfilerT />}></Route>
                            <Route exact path='/StrictMode' element={<StrictMode />}></Route>
                            {/* 工具 */}
                            <Route exact path='/CrateElement' element={<CrateElement />}></Route>
                            <Route exact path='/CloneElement' element={<CloneElement />}></Route>
                            <Route exact path='/CreatContent' element={<CreatContent />}></Route>
                            <Route exact path='/Children' element={<Children />}></Route>
                            <Route exact path='/createRef' element={<CreateRef />}></Route>
                            <Route exact path='/isValidElement' element={<IsValidElement />}></Route>
                            {/* 生命周期 */}
                            <Route exact path='/lifeCycle1' element={<LifeCycle />}></Route>
                            {/* react-hook */}
                            <Route exact path='/useState' element={<UseState />}></Route>
                            <Route exact path='/useEffect' element={<UseEffect />}></Route>
                            <Route exact path='/useMemo' element={<UseMemo />}></Route>
                            <Route exact path='/useCallback' element={<UseCallback />}></Route>
                            <Route exact path='/useRef' element={<UseRef />}></Route>
                            <Route exact path='/useImperativeHandle' element={<UseImperativeHandle />}></Route>
                            {/* react-dom */}
                            <Route exact path='/createPortal' element={<CreatePortal />}></Route>
                            <Route exact path='/flushSync' element={<FlushSynct />}></Route>
                            <Route exact path='/unstableBatchedUpdates' element={<UnstableBatchedUpdates />}></Route>
                            {/* formily */}
                            <Route exact path='/Formily' element={<Formily />}></Route>
                            {/*  ARPanel 组件测试 */}
                            <Route exact path='/BillDesigner' element={<BillDesigner />}></Route>
                            {/* 测试其他 */}
                            <Route exact path='/ReactSlot' element={<ReactSlot />}></Route>
                            {/* tinper */}
                            <Route exact path='/table' element={<Table />}></Route>
                            <Route exact path='/treeSelect' element={<TreeSelect />}></Route>
                        </Routes>
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};
export default App;