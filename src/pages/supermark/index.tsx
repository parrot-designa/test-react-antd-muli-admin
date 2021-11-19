import React ,{useState,useEffect}from 'react';
import { Row ,Col } from 'antd'; 
import Tree from './Tree';
import Table from './Table';
import Api from '@/api/system/rtype'
import useWindowResize from '@/hooks/useWindowResize';


const Supermark=()=>{

    const [customHeight]=useWindowResize(180);
    
    const [foldId,setFoldId]=useState(1);

    const getList=()=>{
        Api.tree().then(res=>{ 
            if(res && res.length){
                setFoldId(res[0].id)
            }
        });
    }

    useEffect(()=>{
        getList()
    },[]);

    const handleSelect=(e)=>{ 
        if(e.length){
            setFoldId(e[0]);
        }
        
    }

    return (
        <Row style={{height:customHeight}}  gutter={32}>
           <Col span={6} style={{height:'100%'}}>
               <Tree 
                    foldId={foldId}
                    onSelect={handleSelect}
               />
            </Col>
           <Col span={18} style={{height:'100%',background:'white'}}>
               <Table foldId={foldId}/>
            </Col>
        </Row>
    )
}


export default Supermark;