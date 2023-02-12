import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
const layout = lazy(() => import('../views/Layout'));

function SuspenseRoute (Comp, props = {}) {
    return (
        <Suspense fallback={<div />}>
            <Comp {...props} />
        </Suspense>
    )
}
const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={SuspenseRoute(layout)} path="/layout" />
            </Routes>
        </BrowserRouter >
    );
};

export default Router;
