//@ts-nocheck
import React, { useState, useRef } from 'react'
import { Button, Space, Dropdown, Checkbox, Menu } from 'antd';

import {
  FilterOutlined,
  ExportOutlined,
  PrinterOutlined
} from '@ant-design/icons';
import useClickListener from '@/hooks/useClickListener';
import { exportExcel } from '@/utils/exportExcel';
import { useHistory,useLocation } from 'react-router-dom'

const Action = (props) => {

  const history = useHistory()

  const { isColumns, isExport, pagination,isPrint, filterColumns, dataSource, onChangeColumns, originColumns,printModule } = props;

  const filterNodeRef = useRef(null);
  const exportNodeRef = useRef(null);
  const printNodeRef = useRef(null);

  const handleChangeMenu = (args) => {
    onChangeColumns && onChangeColumns(args)
  }

  const [filterVisible, setFilterVisible] = useState(false);
  const [exportVisible, setExportVisible] = useState(false);

  const filterButtonRef = useRef(null);
  const exportButtonRef = useRef(null);
  const printButtonRef = useRef(null);

  const clickScreen = (e) => {

    if(!filterButtonRef || !filterButtonRef.current){
      return ;
    }
    //是否是点击filter按钮
    const isInFilterButton = filterButtonRef.current.contains(e.target);
    const isInExportButton = exportButtonRef.current.contains(e.target);
    const isInExcelButton = filterButtonRef.current.contains(e.target);


    if (isInFilterButton || isInExportButton || isInExcelButton) {
      return;
    }

    //是否在filter点击事件内
    const isInFilter = filterNodeRef && filterNodeRef.current && filterNodeRef.current.contains(e.target);
    const isInExport = exportNodeRef && exportNodeRef.current && exportNodeRef.current.contains(e.target);

    if (filterVisible && !isInFilter) {
      setFilterVisible(false)
    }
    //点击完立马消失
    if (exportVisible) {
      setExportVisible(false)
    }
  }

  useClickListener(clickScreen, filterVisible, exportVisible)

  const filterMenu = (
    <div ref={filterNodeRef}>
      <Checkbox.Group defaultValue={filterColumns.map(item => item.key)} onChange={handleChangeMenu} >
        <Menu>
          {originColumns.filter(item=>item.title!=='下载'&&item.title!=='分享').map(item => (
            <Menu.Item key={item.key}><Checkbox value={item.key}>{item.title}</Checkbox></Menu.Item>
          ))}
        </Menu>
      </Checkbox.Group>
    </div>
  )

  /**
   * 获取剩余的dataSource
   * @param dataSource 
   * @param filterColumns 
   */
  const filterDataSource = (dataSource, filterColumns) => {
    const filterKeys = filterColumns.map(item => item.key);
    return dataSource.reduce((total, currentItem, currentIndex) => {
      let currentKeys = Object.keys(currentItem);
      let intersectionKeys = currentKeys.filter(function (val) { return filterKeys.indexOf(val) > -1 })
      let item = {}
      for (let key of intersectionKeys) {
        item[key] = currentItem[key]
      }
      item['key'] = currentItem['key']
      return total.concat(item)
    }, [])
  }

  const handleExport = (type = 'excel') => () => {
    const filterColumns2=filterColumns.filter(item=>item.name!=='下载'&&item.name!=='分享')
    const filterData = filterDataSource(dataSource,filterColumns2);
   
    let entozh = {}
    filterColumns2.forEach(item => {
      entozh[item.key] = item['title']
    }) 
    exportExcel(filterData, entozh, type === 'excel' ? 'xlsx' : 'csv')
  }

  const exportMenu = (
    <div ref={exportNodeRef}>
      <Menu>
        <Menu.Item key={'importcvs'} onClick={handleExport('csv')}>导出到Csv文件</Menu.Item>
        <Menu.Item key={'importexcel'} onClick={handleExport('excel')}>导出到Excel文件</Menu.Item>
      </Menu>
    </div>
  )

  const renderCustom = originColumns && originColumns.length ? <Dropdown visible={filterVisible} overlay={filterMenu} placement="bottomRight">
    <Button ref={filterButtonRef} shape="round" tabIndex={0} icon={<FilterOutlined />} onClick={() => setFilterVisible(!filterVisible)} />
  </Dropdown> : <Button ref={filterButtonRef} shape="round" icon={<FilterOutlined />} />

  const renderExport = <Dropdown visible={exportVisible} overlay={exportMenu} placement="bottomRight">
    <Button ref={exportButtonRef} shape="round" tabIndex={0} icon={<ExportOutlined />} onClick={() => setExportVisible(!exportVisible)} />
  </Dropdown>
 

  const navigateToPrint = () => {  
    const filterColumns2=filterColumns.filter(item=>item.name!=='下载'&&item.name!=='分享')
    sessionStorage.setItem('PRINTMODULE',printModule);
    sessionStorage.setItem('PRINTCOLUMNS',JSON.stringify(filterColumns2));
    sessionStorage.setItem('PRINTCURRENT',pagination.current);
    sessionStorage.setItem('PRINTSIZE',pagination.pageSize);
    window.open(`#/print?printModule=${printModule}`);
  }

  return (
    <Space>
      { isColumns && renderCustom}
      { isExport && renderExport}
      { isPrint && <Button ref={printButtonRef} shape="round" icon={<PrinterOutlined />} onClick={navigateToPrint} />}
    </Space>
  )
}

export default Action;