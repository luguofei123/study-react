/*
 * @Descripttion: 
 * @version: 
 * @Author: lugfa
 * @Date: 2023-08-15 19:32:14
 * @LastEditors: lugfa
 * @LastEditTime: 2023-12-31 12:58:49
 * @FilePath: /study-react/src/views/RactApi/Test.jsx
 */
import React, { useCallback } from 'react';
import useScroll from './my-hook/UseScroll';

function ScrollTop () {
    const { y } = useScroll();

    const goTop = useCallback(() => {
        document.body.scrollTop = 0;
    }, []);

    const style = {
        position: "fixed",
        right: "10px",
        bottom: "10px",
    };
    // 当滚动条位置纵向超过 300 时，显示返回顶部按钮
    if (y > 300) {
        return (
            <button onClick={goTop} style={style}>
                Back to Top
            </button>
        );
    }
    // 否则不 render 任何 UI
    return null;
}
export default ScrollTop 