import React from 'react';
import { Space } from 'antd';
import styles from './index.module.less';
 


const TableToolbar = (props) => {

    const { renderLeft,renderRight } = props;

    return (
        <div className={styles.toolbar}> 
            <div className={styles.container}>
                <Space className={styles.left}>{renderLeft}</Space>
                <Space className={styles.right}>{renderRight}</Space>
            </div>
        </div>
    )
}

export default TableToolbar;