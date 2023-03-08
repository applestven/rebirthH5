<template lang="">
    <div class="taleft fs12 ">
        <div v-if="!loading.flag">
            <div class="cblue" style="display:flex;justify-content: space-between;">
            <!-- <div @click="changeDialog('1')">如何上传双面图片?</div> -->
            <div @click="changeDialog('1')">
                <div v-html="noticeConfig[0].title"></div>
            </div>
                <van-button type="danger" class="br5" @click="uploadImg()" style="height:2rem">上传</van-button>
            </div>
            <!-- <div class="cblue" @click="changeDialog('2')">如何编辑预览图？</div><br> -->
            <div class="cblue" @click="changeDialog('2')">
                <div v-html="noticeConfig[1].title"></div>
            </div><br>
            <!-- <div class="cblue" @click="changeDialog('3')">
                关于裁切误差:<br>
                虚线框为大概裁切位置，因裁切误差存在，亲要注意<br>
                以下情况:<br>
                1.裁切会存在不对称，尤其是带框图<br>
                2.图片要铺满整个框，不能刚好放在虚线框内，否则切出来会出现白边<br>
                3.特别重要图片文字内容要离虚线位置大概3mm左右，参考虚线与外框的距离为2mm<br>
            </div> -->
            <div class="cblue" @click="changeDialog('3')">
                <div v-html="noticeConfig[2].title"></div>
            </div>
            
            <!-- 图片上传区域 -->
            <div style="color:rgb(51,51,51)" v-for="(item ,i) in groudList" >
                <div style="width:100% ;display:flex;justify-content:space-between" class="mt15">
                    <div style="width:46%"  @click="clickGroud(i ,0)" >
                        <van-uploader style="display:block" :after-read="afterRead" v-model="item.frontList" :preview-full-image="false" :max-count="1">
                            <div style="width:10rem ; height:11rem ; " class="bcgray" >
                                <van-icon name="plus" style="top:40%;left:40% ;" size="2rem" />
                                <!-- <img :src="item.frontList[0].content"> -->
                            </div>
                        </van-uploader>
                        <br>
                        <div class="tacenter">正面</div>
                    </div>
                    <div style="width:46% ;"  @click="clickGroud(i ,1)" >
                        <van-uploader style="display:block" :after-read="afterRead" v-model="item.reverseList" :preview-full-image="false" :max-count="1">
                            <div style="width:10rem ; height:11rem ; " class="bcgray" >
                                <van-icon name="plus" style="top:40%;left:40% ;" size="2rem" />
                            </div>
                        </van-uploader>
                        <br>
                        <div class="tacenter">背面</div>
                    </div>
                    
                </div>
                <div class="tacenter">
                    数量: <input v-model="item.number" style="width:3.5rem" class="tacenter" /> 张
                </div>
                <hr> 
            </div>
            <p class="tacenter cblue" @click="addGroup"> 增加一组</p>
            
            <!-- 裁剪板 -->
            <van-dialog v-model="show"  show-cancel-button width="95%" style="height:auto;overflow-y:auto;padding:5px" :lockScroll="false" @cancel="cancel" @confirm="confirm"> 
                <div style="height:auto;overflow:auto;" class="mt15">
                <div style="width:100%;height:300px;">
                    <vueCropper
                    :fixedBox="true"
                    @realTime="realTime"
                    style="height:300px"
                    :autoCrop="true"
                    :autoCropWidth="queryData.width"
                    :autoCropHeight= "queryData.height"
                    ref="cropper"
                    :img="option.img"
                    :outputSize="option.size"
                    :outputType="option.outputType"
                    :enlarge="coefficient"
                    ></vueCropper>
                </div>
                <div class="tacenter mb30">
                    <van-button type="primary" @click="handlerOption('clockwise')" >顺时针</van-button>
                    <van-button type="primary" @click="handlerOption('anticlockwise')">逆时针</van-button>
                    <van-button type="primary" @click="handlerOption('add')">+</van-button>
                    <van-button type="primary" @click="handlerOption('crease')">-</van-button>
                    <van-button type="primary" @click="handlerOption('restoration')">复位</van-button>
                </div>
                <!-- 截图预览 -->
                <p class="tacenter">截图预览:</p>
                <div style="height:250px;">
                        <div style="width:90%;height:200px;padding:10px;position: relative;display:flex;justify-content:center">
                            <div :style="{border:'1px dashed grey', width:queryData.width - 4+'px', height:queryData.height -4 +'px',position: 'absolute',top:'11px'}"></div>
                            <img :src="previewStyle.url" alt="" :style="previewStyle">
                        </div>
                    </div>
                </div>
            
                <!-- <img src="https://img01.yzcdn.cn/vant/apple-3.jpg" /> -->
            </van-dialog>
        </div>

        <!-- 图片上传页 -->
        <div v-if="loading.flag">
            <div style="width:100% ;height:8rem;" class="tacenter">
                <img :src="loading.status == 0 ? '/success.png' :loading.status == 1 ? '/fail.png' : '/fresh.gif'" alt="" style="width:5rem">
                <div class="mt15 mb30">
                    {{ loading.status == 0  ? '图片上传成功' : loading.status == 1 ? '图片上传失败' : '正在上传' }}
                </div>
            </div>
            <van-button type="info" @click="feedback('continueUp')" class="mt15 br5" block v-show="loading.status == 0">继续上传其他尺寸图片</van-button>
            <van-button type="danger" @click="feedback('out')" class="mt15 br5" block v-show="loading.status == 0">退出订单号验证</van-button>
            <van-button type="danger" @click="feedback('resUp')" class="mt15 br5 mb30" block v-show="loading.status == 1">重新上传</van-button>
            <br><br>
            <div v-html="noticeText"></div>
            <div class="cblue">
                <!-- <div>关于色差问题</div> <br> -->
                <div v-html="noticeConfig[3].title" @click="changeDialog('4')"></div> <br>
                   
                <!-- <div>关于图片上传与售后问题</div><br> -->
                <div v-html="noticeConfig[4].title" @click="changeDialog('5')"></div><br>
                    
                <div v-html="noticeConfig[5].title" @click="changeDialog('6')"> 
                    <!-- 关于图片裁切误差:
                    虚线框为大概裁切位置，因裁切误差存在，亲要注意一下情况: <br>
                    1.裁切会存在不对称，尤其是带框图 <br>2.图片要铺满整个框，不能刚好放在虚线框内，否则
                    切出来会出现白边 <br>
                    3.特别重要图片文字内容要离虚线位置大概3mm左右，参考虚线与外框的距离为2mm -->
                </div>

            </div>
            

        </div>

        <!-- 弹窗视频 -->
        <van-dialog v-model="dialog.flag"  width="90%">
                <div style="font-size:12px" class="padding10 taleft mb15 mt15">
                    <!-- 关于裁切误差:<br>
                    虚线框为大概裁切位置，因裁切误差存在，亲要注意<br>
                    以下情况:<br>
                    1.裁切会存在不对称，尤其是带框图<br>
                    2.图片要铺满整个框，不能刚好放在虚线框内，否则切出来会出现白边<br>
                    3.特别重要图片文字内容要离虚线位置大概3mm左右，参考虚线与外框的距离为2mm<br> -->
                    <div v-html="
                    dialog.type == 1 ? noticeConfig[0].container :
                     dialog.type == 2 ? noticeConfig[1].container : 
                     dialog.type == 3 ? noticeConfig[2].container : 
                     dialog.type == 4 ? noticeConfig[3].container : 
                     dialog.type == 5 ? noticeConfig[4].container :  noticeConfig[5].container ">
                    </div>
                </div>
                <video v-if="dialog.flag" 
                    :src="dialog.type == 1 ? noticeConfig[0].video : 
                    dialog.type == 2 ? noticeConfig[1].video : 
                    dialog.type == 3 ? noticeConfig[2].video : 
                    dialog.type == 4 ? noticeConfig[3].video : 
                    dialog.type == 5 ? noticeConfig[4].video : noticeConfig[5].video "
                    
                    style="width:100%;" controls="controls" autoplay></video>
            </van-dialog>
    </div>
</template>
<script>
import { getImgInfo } from "../utils/viewImgdpi"
import { getBase64URL, base64ImgtoFile } from "../utils/base64URL"
import { VueCropper } from 'vue-cropper'
import { debounceS } from "../utils/debounce.js"
import { getOneMmsPx } from "../utils/transitionPx"
import { upload ,getNotice } from "../api/service"
import changedpi from '../utils/base64Dpi'
import { Toast } from "vant"

export default {
    name: "Cropper",
    data() {
        return {
            dialog: { // 视频弹窗 
                flag: false,
                src: '../../public/4k.mp4',
                type:'',
            },
            show: false,
            groudList: [
                {
                    frontList: [], // 正面
                    reverseList: [], // 反面
                    groundIndex: 0, // 组id 
                    originList: [], // 源照片  0 为正  1 为背
                    number: 1 // 打印几张
                }
            ],
            loacation: [], // 点击哪组图片 
            option: {
                outputType: 'jpeg',
                img: '',
            },
            previewStyle: { // 预览图片的宽高 
                width: '',
                height: '',
                url: ''
                // width:'auto', height:'auto', maxWidth:'100%', maxHeight:'100%'
            },
            queryData: {},
            coefficient: 1 , // 裁剪框系数
            loading:{
                flag:false,// 加载页面显示
                status : 2 // 上传状态 0 成功  1 失败  2 上传中
            },
            noticeHTML:"", // 注意事项
            noticeConfig:[
                {
                    title:'',
                    container:'',
                    video:''
                }
            ], 
            noticeText:"",

        }
    },
    components: {
        VueCropper,
    },
    methods: {
        feedback(type){ //上传后 按键反馈
            switch (type) {
                case 'continueUp':
                    this.$router.push("/Specification")
                    break;
                case 'out':
                this.$router.push("/")
                    break;
                case 'resUp':
                    this.uploadImg()
                    break;
            
                default:
                    break;
            }
        },
        async uploadImg(){ // 上传图片
            console.log("上传图片");
            let fileList = []
            this.groudList.forEach(( item,index )=>{
                if(item.frontList.length  && item.reverseList.length){
                    //重命名
                    var frontFile = new File([item.frontList[0].file], index+1+'z'+'-'+item.number+'.jpg', {type: item.frontList[0].file.type});
                    var reverseFile = new File([item.reverseList[0].file], index+1+'f'+'-'+item.number+'.jpg', {type: item.reverseList[0].file.type});
                    fileList.push(frontFile)
                    fileList.push(reverseFile)
                    // fileList.push(item.frontList[0].file ,item.reverseList[0].file)
                }
            })
            console.log("拿到fileList",fileList);
            if(fileList.length > 1){
                this.loading.flag = true 
                this.loading.status = 2 

            }else{
                Toast("请先上传图片")
            }
            let formdata =  new FormData()
            fileList.forEach(item=>{
                formdata.append('file',item)
            })
            // formdata.append('pathOne','内部单号+姓+手机后四位')
            formdata.append('pathOne',this.$route.query.orderNumber)
            formdata.append('pathTwo',this.$route.query.width+'*'+this.$route.query.height+':'+this.$route.query.craft)
            let res = await upload(formdata)
            // console.log('@res',res)
            if(res.code == 0){
                this.loading.status = 0
            }else{
                this.loading.status = 1
            }
        },
        changeDialog(type) { // 视频弹窗 
            this.dialog.type = type
            switch (type) {
                case '1': // 如何上传双图片 ？ 
                    this.dialog.flag = true
                    // this.dialog.src = ''
                    break;

                case '2':  // 如何编辑预览图 ？ 
                    this.dialog.flag = true
                    break;

                case '3': // 关于裁剪误差
                    this.dialog.flag = true
                    break;

                default:
                    break;
            }
        },
        confirm() {// 截图确定 
            // changedpi.changeDpiDataUrl(this.previewStyle.url,300)
            if (!this.loacation[1]) { // 判断正背面 
                this.groudList[this.loacation[0]].frontList[0]['content'] = changedpi.changeDpiDataUrl(this.previewStyle.url,300)
                this.groudList[this.loacation[0]].frontList[0]['file'] = base64ImgtoFile(changedpi.changeDpiDataUrl(this.previewStyle.url,300))

            } else {
                this.groudList[this.loacation[0]].reverseList[0]['content'] = changedpi.changeDpiDataUrl(this.previewStyle.url,300)
                this.groudList[this.loacation[0]].reverseList[0]['file'] = base64ImgtoFile(changedpi.changeDpiDataUrl(this.previewStyle.url,300))
            }
            this.previewStyle.url = ''
            this.option.img =""
        },
        cancel(){ // 截图取消 
            if (!this.loacation[1]) { // 判断正背面
                this.groudList[this.loacation[0]].frontList = []
            }else{
                this.groudList[this.loacation[0]].reverseLis = []
            }

        },
        realTime(data) {
            // this.previews = data
            console.log("@realtimedata", data)
            debounceS(() => {
                this.$refs.cropper.getCropData((data) => { 
                    // do something
                    console.log(data)
                    // getCropBlob  获取截图的blob数据  ;getCropData  获取截图的base64 数据   
                    this.$refs.cropper.getCropData((data) => {
                        // do something
                        console.log()
                        this.previewStyle.url = data
                    })

                })
            }, 500, this)

        },
        async afterRead(data) { // 文件上传之后的处理 

            let realWH= {
                width:Number(this.queryData.width)*this.coefficient,
                height:Number(this.queryData.height)*this.coefficient
            }
            let wh = await getImgInfo(data.content)
            console.log('@wh读取到单张图片的宽高', wh)
            if(realWH.width > wh.width || realWH.height > wh.height){ // 图片需要大小 > 图片实际大小
                    // console.log("")
                Toast("所选图片分辨率过小,请重新选择")
                if (!this.loacation[1]) { // 判断正背面 
                    this.groudList[this.loacation[0]].frontList = []
                
                }else{
                    this.groudList[this.loacation[0]].reverseList = []
                }
                this.option.img =""
                return
                
            }
            //获取图片的分辨率（+4mm出血）  与传过来的规格做比较 较小删除图片   
            // 规格合适 设置截图框大小 
            
            console.log('@wh读取到图片的宽高', wh)
            // this.$refs.cropper.cropW = wh.width
            // this.$refs.cropper.cropH = wh.height
            this.option.img = data.content
            this.show = true
            if (!this.loacation[1]) { // 判断正背面 
                this.groudList[this.loacation[0]].frontList[0]['imageFit'] = 'contain'
                this.groudList[this.loacation[0]].originList[0] = data.content
            } else {
                this.groudList[this.loacation[0]].reverseList[0]['imageFit'] = 'contain'
                this.groudList[this.loacation[0]].originList[1] = data.content
            }

        },
        addGroup() { // 增加一组 
            this.groudList.push({
                frontList: [], // 正面
                reverseList: [], // 反面
                groundIndex: this.groudList.length, // 组id 
                originList: [], // 源照片  0 为正  1 为背
                number: 1
            })
        },
        clickGroud(groundIndex, face) { // 点击组赋值 
            this.loacation = [];
            this.loacation.push(groundIndex, face)
            if(!face && this.groudList[groundIndex].frontList.length ==1 ){
                this.show  = true 
                this.option.img = this.groudList[groundIndex].originList[0]
            }else if(face && this.groudList[groundIndex].reverseList.length ==1){
                this.show  = true 
                this.option.img = this.groudList[groundIndex].originList[1]
            }
            this.$refs.cropper.getCropData((data) => {   
                    this.$refs.cropper.getCropData((data) => {
                        // do something
                        console.log()
                        this.previewStyle.url = data
                    })
            })
            
        },
        handlerOption(name) { // 操作 
            switch (name) {
                case 'clockwise':
                    this.$refs.cropper.rotateRight()
                    break;
                case 'anticlockwise':
                    this.$refs.cropper.rotateLeft()
                    break;
                case 'add':
                    this.$refs.cropper.changeScale(0.1)
                    break;
                case 'crease':
                    this.$refs.cropper.changeScale(-0.1)
                    break;
                case 'restoration':
                    this.$refs.cropper.reload()
                    this.$refs.cropper.rotateClear()
                    break;

                default:
                    break;
            }
        },
        async getNotice(){
            let res = await getNotice({ order:1 })
            if(res.code  == 0){
                // console.
                this.noticeHTML = res.res 

                 // 规格选择页 
                let container =  this.noticeHTML.match(/em.*em/g) 
                container = container.map(item=>{
                    return item.replace('em>','').replace('</em','')
                })
                console.log("@container",container) 
                this.noticeConfig[0]={
                    title:container[7],
                    container:container[8],
                    video:container[9]
                }
             
                this.$set(this.noticeConfig,1,{
                    title:container[10],
                    container:container[11],
                    video:container[12]
                })
                this.$set(this.noticeConfig,2,{
                    title:container[13],
                    container:container[14],
                    video:container[15]
                })
                this.noticeText = container[25]

                this.$set(this.noticeConfig,3,{
                    title:container[26],
                    container:container[27],
                    video:container[28]
                })
                this.$set(this.noticeConfig,4,{
                    title:container[29],
                    container:container[30],
                    video:container[31]
                })
                this.$set(this.noticeConfig,5,{
                    title:container[32],
                    container:container[33],
                    video:container[34]
                })
            } 
        }
    },
    async created() {
        this.getNotice()
        console.log('@getOneMmsPx',getOneMmsPx())
        let resPX = await getOneMmsPx()
        // console.log('@query',this.$route.query)
        this.queryData = JSON.parse(JSON.stringify(this.$route.query))
        if( this.queryData.width > 270  || this.queryData.height > 270){
            this.coefficient = 2 * resPX 
            this.queryData.width = ((Number(this.queryData.width) + 4) / 2).toFixed(2)
            this.queryData.height = ((Number(this.queryData.height) + 4) /2).toFixed(2)
        }else{
            this.coefficient = 1 * resPX
            this.queryData.width = Number(this.queryData.width) + 4
            this.queryData.height = Number(this.queryData.height) + 4
        }
        
        this.previewStyle.width = this.queryData.width + 'px'
        this.previewStyle.height = this.queryData.height + 'px'
    }
}
</script>
<style scoped>
>>>.van-uploader__input-wrapper {
    /* width: 100%;
    height: 100%; */
}

>>>.van-uploader__preview {
    /* position: fixed; */
    /* z-index: 1001; */
    /* width: 46%;
    height: 150px;
    position: fixed;
    z-index:1001; */
    /* top:50%; */
    /* transform: translateY(-50%); */

}

>>>.van-uploader__preview-image {
    width: 10rem;
    height: 11rem;
    /* width:100% ;
    height: auto; */

}
>>> .van-uploader__wrapper{
    justify-content: center;
}

>>>.van-uploader__preview {
    /* width:41%;
    margin-top: 12%; */
}</style>