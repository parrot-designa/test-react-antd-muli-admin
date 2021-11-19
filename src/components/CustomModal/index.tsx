import React from 'react';
import { Modal } from 'antd';


const CustomModal = React.forwardRef((props: any, ref: any) => {

    const { visible,title,children,type,size="small",clickCancel,customTitle }=props;
 

    return (
        <>
            <Modal 
                footer={null} 
                visible={visible} 
                title={customTitle?customTitle:type==='add'?`添加${title}`:type==='view'?`查看${title}`:`编辑${title}`} 
                width={size==='small'?400:size==='big'?800:520}    
                onCancel={clickCancel}
                destroyOnClose
                afterClose={props?.afterClose}
                maskClosable={false}
            >
                {children}
            </Modal>
        </>
    )
})

export default CustomModal;