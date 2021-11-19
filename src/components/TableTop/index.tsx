import React from 'react';
import style from './index.module.less';
import { Button, Space } from 'antd';
import {
    SearchOutlined,
    PlusOutlined
} from '@ant-design/icons';



const TableTop = (props) => {

    const { children, search = false, add = false,onSearch=()=>{} } = props;

    return (
        <div>

            <Space>
                {children}

                {search && <Button onClick={onSearch} type="primary">
                    <SearchOutlined />搜索
                </Button>}
                {add && <Button>
                    <PlusOutlined />添加
                </Button>}

            </Space>

        </div>
    )
}

export default TableTop;