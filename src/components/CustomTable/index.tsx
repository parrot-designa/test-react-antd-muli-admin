import React, { useEffect, useState } from 'react';
import styles from './index.module.less';
import { message, Table,Modal } from 'antd'; 
import TableTop from '../TableTop';
import TableToolbar from '../TableToolbar'; 
import CustomButton from '@/components/CustomButton';
import Action from './Action';
import { ExclamationCircleOutlined ,CaretRightOutlined,CaretDownOutlined } from '@ant-design/icons';
import WhiteSpace from '@/components/WhiteSpace'; 
import ActionButton from '@/components/ActionButton';
import AliDownload from '@/hooks/AliDownload';
import PermissionsButton from '@/components/PermissionsButton';
import share from '@/utils/share'

const CustomTable = (props) => {

    const { 
        pagination, 
        showTableTop = true, 
        showTableToolbar=true,
        showHeader = true, 
        dataSource, 
        columns:propsColumns,
        //点击添加按钮
        onAdd=()=>{},
        onDelete=()=>{} ,
        onTableChange,
        setSelectedKeys,
        tableTopProps,
        showWhiteSpace=true,
        hasAddButton=true,
        hasDeleteButton=true,
        loading,
        noselection,
        expandIconColumnIndex=0,
        expandedKeys,
        onClickExpand,
        customDeleteButtonText="删除",
        customAddButtonText,
        hasShearButton=false,
        hasSearchButton=false,
        renderRight=true,
        title=true,
        scroll,
        printModule,
        deleteAllText,
        fileTypeTable,
        permissonModule,
        isMyResource,
        isRtype,
        isRecycle,
        isMy
    } = props;

    const columns=[...propsColumns];
     
    const download=async (record)=>{
        const url=await AliDownload(record); 
        window.open(url);
    }


    const downLoadColumns={
            title: '下载',
            dataIndex: 'download',
            key: 'download',
            align: 'center',
            render: (current,record) => {
                return <PermissionsButton permission={`${permissonModule}:Download`}>
                    <ActionButton onClick={()=>download(record)} />
                </PermissionsButton>
            }
    };

    const shareColumns={
            title: '分享',
            dataIndex: 'share',
            key: 'share',
            align: 'center',
            render: (current,record) => {
                return <PermissionsButton permission={`${permissonModule}:Get`}>
                    <ActionButton type="copy" onClick={()=>share(`/fileDetail?fileId=${record.id}&fileName=${record.fileName}`)}/>
                </PermissionsButton>
            }
    } 

    if(fileTypeTable){
        columns.push(downLoadColumns)
        columns.push(shareColumns)
    }

    const [tableColumns,setTableColumns]=useState(columns);
 
    const handleChangeColumns=(checked)=>{
        let changeTableColumns=columns.reduce((total,currentValue,currentIndex)=>{
            if(checked.indexOf(currentValue.key)>-1){
                return total.concat(currentValue)
            }
            return total;
        },[])

        if(fileTypeTable){ 
            changeTableColumns.push(downLoadColumns)
            changeTableColumns.push(shareColumns)
        } 
        setTableColumns(changeTableColumns)
    }

    const handleTableChange=(pagination, filters, sorter)=>{
        onTableChange?.(pagination, filters, sorter)
    }

    const [selectedRows,setSelectedRows]=useState([]);

    const handleChangeSelectedRowKeys=(selectedRowKeys,selectedRows)=>{ 
        setSelectedRows(selectedRows)
        setSelectedKeys?.(selectedRowKeys)
    }

    const onDeleteSelected=()=>{ 
        if(!selectedRows.length){
            message.error(deleteAllText?"确定要移至回收站吗？":"请选择要删除的数据")
        }else{
            Modal.confirm({
                title: '信息',
                icon: <ExclamationCircleOutlined />,
                content: deleteAllText||'确定要删除选中数据吗？',
                okText: '确认',
                cancelText: '取消',
                onOk:()=>onDelete?.(selectedRows.map(item=>item.id))
            });
            
        }
    }

    const onShearSelected=()=>{
        if(!selectedRows.length){
            message.error("请选择要剪切的文件")
            return ;
        }
        props?.onShear?.(selectedRows.map(item=>item.id))
    }

    const tableProps:any={
        
    }

    if(!noselection){
        tableProps.rowSelection={ 
            type:"checkbox",
            selectedRowKeys:selectedRows.map(item=>item.id),
            onChange:handleChangeSelectedRowKeys
        }
    }

    if(scroll){
        tableProps.scroll=scroll
    }

    if(title){
        tableProps.title=()=>{ return showTableToolbar ? <TableToolbar 
            renderLeft={
                <>
                    {hasAddButton && customAddButtonText==="上传"? <CustomButton type="add" onClick={onAdd} addText={customAddButtonText}></CustomButton> :<PermissionsButton permission={isRtype?`${permissonModule}:Get`:`${permissonModule}:Save`}> 
                    <CustomButton type="add" onClick={onAdd} addText={customAddButtonText}></CustomButton>
                    </PermissionsButton>}
                    {hasShearButton && <CustomButton type="sheer" onClick={onShearSelected} permission={`${permissonModule}:Update`}>剪切</CustomButton>}
                    {hasDeleteButton && (isRecycle || isMy) ?  <CustomButton type="delete" onClick={onDeleteSelected} deleteText={customDeleteButtonText}>
                            </CustomButton> :<PermissionsButton permission={isMyResource?`${permissonModule}:Recycle`:`${permissonModule}:Delete`}>
                            <CustomButton type="delete" onClick={onDeleteSelected} deleteText={customDeleteButtonText}>
                            </CustomButton>
                        </PermissionsButton>}
                    {hasSearchButton && <CustomButton type="search" onClick={props?.onLeftSearch}>高级搜索</CustomButton>}
                  
                </>
            }
            renderRight={
                <>
                    {renderRight && <Action 
                        isColumns
                        isExport
                        isPrint
                        dataSource={dataSource}
                        originColumns={columns.filter(item=>item.key!=='id')}
                        filterColumns={tableColumns}
                        onChangeColumns={handleChangeColumns}
                        pagination={pagination}
                        printModule={printModule}
                    />}
                </>
            }
        />:null}
    }

    return (
        <div className={styles.customTable}>

            { showTableTop && <TableTop {...tableTopProps}></TableTop>} 

            { showWhiteSpace && <WhiteSpace />}

            <div>
                
                <Table
                    columns={tableColumns}
                    dataSource={dataSource}
                    bordered={true}
                    size="small"
                    rowKey="id"
                    loading={loading}
                    
                    expandable={{
                        expandIconColumnIndex,
                        expandedRowKeys:expandedKeys,
                        expandIcon: ({ expanded, onExpand, record }) =>{
                            const isHasChildren=record.children && record.children.length
                            return isHasChildren?expanded ? (
                                <CaretDownOutlined onClick={e => onExpand(record, e)} />
                                ) : (
                                <CaretRightOutlined onClick={e => onExpand(record, e)} />
                                ):<div style={{marginRight:10,display:'inline-block'}}></div>
                        },
                        onExpand:onClickExpand
                            
                    }}
                    {...tableProps}
                    onChange={handleTableChange}
                    pagination={pagination} 
                > 
                </Table>
            </div>
        </div>
    )
}

export default CustomTable;