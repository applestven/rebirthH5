// import { changeDpiBlob } from 'changedpi'
import { base64ImgtoFile } from "./base64URL"
// import { changeDpiBlob} from "./blobDpi"
import { changeDpiBlob} from "./blobDpi"
export function drawAndClipImage(file, fileName) {
  return new Promise((reslove,reject)=>{
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = e => {
      const src = e.target.result
      const image = new Image()
      image.src = src
      image.onload = () => {
        const canvas = document.createElement('canvas')
        const width = image.width
        const height = image.height
        //需要dpi为300的 
        // const scaleFactor = 300 / 96;
        // const width = Math.ceil( image.width * scaleFactor)
        // const height = Math.ceil( image.height * scaleFactor)

        canvas.width = width
        canvas.height = height
        // 计算圆形图片的圆心及图片半径
        const circle = {
          x: width / 2,
          y: height / 2,
          r: width / 2
        }
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, width, height)
        // 在canvas开始绘制前填充白色透明背景并设置透明度，用以清除图片裁剪后透明区域变成黑色的问题
        context.fillStyle = 'rgba(255, 255, 255, 0)'
        context.fillRect(0, 0, width, height)

        // 开始路径画圆，剪切处理
        context.save() // 保存当前canvas的状态
        context.beginPath()
        context.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2, false) // 创建弧/曲线(用于创建圆形或部分圆)
        context.clip() // 从原始画布剪切任意形状和尺寸的区域
        context.drawImage(image, 0, 0)
        context.restore() // 返回之前保存过的路径状态和属性，恢复状态

        // 将canvas图片转换成 blob数据
        canvas.toBlob(blob => {
          changeDpiBlob(blob, 300).then(function(blob){

            const file = new File([blob], fileName, { type: blob.type })
          
            // this.$emit('emitPar', { imgUrl: URL.createObjectURL(blob), fileData: file })
            // imageFit 为业务需要
            reslove({file:file ,content:URL.createObjectURL(blob),imageFit:'contain'})
            // use your changed blob
          })
        
          // 内部注释参考 getCropBlob方法 else部分
          
          
          
        })

        // changeDpiBlob
        // let imgbase64Data = canvas.toDataURL('image/jpeg',1)
        // let circleBase64  = changedpi.changeDpiDataUrl(imgbase64Data,300)
        // console.log("@imgData" , imgData);
        // reslove({file:base64ImgtoFile(circleBase64) ,content:circleBase64,imageFit:'contain'})
        // changedpi.changeDpiDataUrl()
      }
      image.onerror = err => {}
    }
    reader.onerror = err => {}
  })
    
  }


//   裁剪为圆形图片