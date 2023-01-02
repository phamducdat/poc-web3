import React from 'react';
import Home from "./components/home";
import {Content} from "antd/es/layout/layout";

const App = props => {
    return (
        <div style={{alignItems: 'center', textAlign: 'center'}}>
                <Home/>
        </div>
    );
};

App.propTypes = {};

export default App;