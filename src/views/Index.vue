<template lang="">
    <div>
        <h3 class="mt30">订单号验证</h3>
        <!-- <input v-model="orderNumber" placeholder="请复制订单号进行验证" /><br/> -->
        <van-field v-model="orderNumber" class="border1 mb15 br5"  placeholder="请复制订单号进行验证" />
        <van-button type="danger" block class="br5" @click="verify()">验证</van-button>
        <div class="cred taleft fs12 mt15" v-show="tipflag" >订单号无效，请输入正确的淘宝订单号</div>

        <div @click="()=>{ dialogFlag = true}" style="color:rgb(21,155,213) ; height:3rem" class="mt30 fs12 taleft">
            <div v-html="noticeConfig[0].title"></div>
        </div>
        <!-- 弹窗视频 -->
        <van-dialog v-model="dialogFlag" width="90%">
            <div style="font-size:12px" class="padding10 taleft mb15 mt30">
                <div v-html="noticeConfig[0].container"></div>
            </div>
            <video v-if="dialogFlag" :src="noticeConfig[0].video" style="width:100%;" controls="controls" autoplay></video>
        </van-dialog>

        

    </div>
</template>
<script>
import VideoPlay  from "../components/videoPlay.vue" 
import { getNotice } from "../api/service"
import { getInitToken ,getsign ,getOrder ,orders} from "../api/service"
import md5 from 'js-md5';
import { Toast } from 'vant';
export default {
    data() {
        return {
            orderNumber:'',
            dialogFlag:false, 
            tipflag:false,
            noticeHTML:'',
            noticeConfig:[
                {
                    title:'',
                    container:'',
                    video:''
                }
            ]
        }
    },
    methods:{
        verify(){
            // let date = (new Date().getTime()/1000).toFixed(0)
            if(this.orderNumber == ''){
                this.tipflag = true ; 
                return ;    
            }
            // getsign({
            //     app_key:'6fa64de97fa34fef90964bc089f89aff',
            //     access_token:'169460a41d154b8188d6593525c29c9d',
            //     timestamp:date,
            //     charset:'utf-8',
            //     version:'2',
            //     biz:JSON.stringify({page_index:'1',page_size:"10","so_ids":[this.orderNumber]})
            //     // biz:JSON.stringify({page_index:'1',page_size:"10","o_ids":[this.orderNumber]})
            // }).then(res=>{
              
            //    if(res.code == 0){
            //         orders(res.data).then(resData=>{
            //             console.log('resDATA',resData)
            //             if(resData.code == 0){

            //                 if(resData.data.data_count === 0){ // 订单有效性 1 
            //                     Toast("无此订单，请确认复制完全")
            //                     return 
            //                 }


            //             }else{
            //                 Toast("网络繁忙，请稍后重试") // 聚水潭接口限制 一秒只能请求五次
            //                 return
            //             }
            //         })
            //    }
            // })

            // 5040020704834833681
            // 3231630073492465557
            this.$router.push({path:"/Specification",query:{orderNumber:this.orderNumber}})
        },
        async getNotice(){
            let res = await getNotice({ order:1 })
            if(res.code  == 0){
                // console.
                this.noticeHTML = res.res 
            }
            // 订单验证页  
            let container =  this.noticeHTML.match(/em.*em/g) 
            container = container.map(item=>{
                return item.replace('em>','').replace('</em','')
            })
            console.log("@container",container) 
            this.$set(this.noticeConfig,0,{
                title:container[0],
                container:container[1],
                video:container[2]
            })

        }
    },
    created(){
        this.getNotice()
        // let date = (new Date().getTime()/1000).toFixed(0)
        //获取access——token 30天一次过期
        // getsign({   // 获取加密签名 自写 
        //     app_key:'6fa64de97fa34fef90964bc089f89aff',
        //     timestamp:date,
        //     grant_type:'authorization_code',
        //     charset:'utf-8',
        //     code:'12345D',//随机码（随机创建六位字符串）自定义值}).then(res=>{
        // }).then(res=>{
        //     console.log("res",res);
        //     getInitToken(res).then(resData=>{ // 获取access——token 官方
        //         console.log('resDATA',resData)
        //     })
        // })

        // access_token
        // : 
        // "169460a41d154b8188d6593525c29c9d"
        // expires_in
        // : 
        // 2481448
        // refresh_token
        // : 
        // "c569961b60674db28b9e71d31539d08f"
        // scope
        // : 
        // "all"
        // getsign({
        //     app_key:'6fa64de97fa34fef90964bc089f89aff',
        //     access_token:'169460a41d154b8188d6593525c29c9d',
        //     timestamp:date,
        //     charset:'utf-8',
        //     version:'2',
        
        //     biz:JSON.stringify({page_index:'1',page_size:"10","so_ids":['5040020704834833681']})
        // }).then(res=>{
        //     // let fromdata = new FormData()
        //     // for(let key in res){
        //     //     fromdata.append(key,res[key])
        //     // }
        //     getOrder(res).then(resData=>{
        //         console.log('resDATA',resData)
        //     })
        // })
    },
    components:{
        VideoPlay 
    }
}
</script>
<style scoped>
input{
    width: 100%;
}
input::-webkit-input-placeholder{ /*WebKit browsers*/

font-size: 12px;
/* padding: 3rem; */
text-align: center;

}

input::-moz-input-placeholder{ /*Mozilla Firefox*/

font-size: 12px;
text-align: center;
}

input::-ms-input-placeholder{ /*Internet Explorer*/ 
    text-align: center;
    font-size: 12px;
}
</style>