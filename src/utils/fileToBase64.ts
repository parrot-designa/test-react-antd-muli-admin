export default async function(file) {
    return new Promise((resolve,reject)=>{
        let image = file; //获取文件域中选中的图片
        let reader = new FileReader(); //实例化文件读取对象
        reader.readAsDataURL(image); //将文件读取为 DataURL,也就是base64编码
        reader.onload = function(ev) { //文件读取成功完成时触发
            var dataURL = ev.target.result; //获得文件读取成功后的DataURL,也就是base64编码
            resolve(dataURL)
        }
    }) 
     
}