import {Component} from 'react'
import Todo from './ToDo.tsx'
import {ConfigProvider} from 'antd';
import enUS from 'antd/lib/locale/en_US';
import '@ant-design/pro-table/dist/table.css';
import '@ant-design/pro-field/dist/field.css';
import '@ant-design/pro-form/dist/form.css';
import '@ant-design/pro-card/dist/card.css';
import 'antd/dist/antd.css';

function App() {
  return (
    <ConfigProvider locale = {enUS}>
      <div className="App">
        <Todo/>
      </div>
    </ConfigProvider>
  );
}

export default App;
