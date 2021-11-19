import React, { Children } from 'react'; 

const PermissionsButton=(props)=>{

    const  PermissionsButtonList=JSON.parse(sessionStorage.getItem('Functions')||"[]");

    return PermissionsButtonList.findIndex(item=>props.permission===item)>-1?props.children:null;

}

export default PermissionsButton;