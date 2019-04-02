<template>
    <div class="addCustom">
        <div v-if='!isCommon' class="addCustom-content">
            <scroller lock-x :scrollbarY=false height="-35">
                <div class="box1" style="overflow:hidden">
                    <group>
                        <x-input placeholder-align="right" text-align="right"  title="客户名称" placeholder="(必填)" v-model="value"></x-input>
                        <x-textarea class="it-direction" :height="100" title="地址" v-model="address"  placeholder="必填"></x-textarea>
                    </group>
                    <group>
                        <x-input placeholder-align="right" type="tel" text-align="right" title="电话" v-model="phoneNumber" placeholder="(必填)"></x-input>
                        <x-input placeholder-align="right" text-align="right" title="传真" v-model="fax" placeholder="(必填)"></x-input>
                        <x-input placeholder-align="right" text-align="right" title="网址" v-model="webAddress" placeholder="(必填)"></x-input>
                    </group>
                    <group>
                        <cell title="行业" :value="industry" is-link @click.native="gainCommon(7)" >
                        </cell>
                        <cell title="区域" :value="address" is-link @click.native="gainCommon(4)">
                        </cell>
                        <cell title="规模" :value="scale" is-link @click.native="gainCommon(5)">
                        </cell>
                        <cell title="性质" :value="nature" is-link @click.native="gainCommon(6)">
                        </cell>
                        <cell title="来源" :value="source" is-link @click.native="gainCommon(0)">
                        </cell>
                    </group>
                    <group>
                        <x-textarea :max='500' :height="200" title="备注"  placeholder="输入文字不超过500字"></x-textarea>
                    </group>    
                </div>
            </scroller>
            
        </div>
        <div v-if='!isCommon' class="addCustom-btn-box">
            <x-button class="addCustom-btn" type="primary" @click.native="addCustom">
                保存
            </x-button>
        </div>
        <Common @toggleCommon="toggleCommon" :status="status" v-if='isCommon'/>
    </div>
</template>

<script>
import {  Tabbar, TabbarItem,  CellBox,XButton,Scroller, Cell ,Group,Search,XTextarea,XInput   } from 'vux'
import { mapState, mapActions ,mapMutations} from 'vuex'
import Common from '../../comment'

export default {
    name: 'addCustom',
    data() {
        return {
            value:'',
            isCommon:false,
            phoneNumber:"",
            status:"",
            industry:"(必选)",
            address:"请选择",
            scale:"请选择",
            nature:"请选择",
            source:"请选择",
            phoneNumber:"",//电话
            fax:"",//传真
            webAddress:"",//网址
            address:"",//地址
        }
    },
    created() {
        
    },
    mounted() {
        
    },
    methods: {
        toggleCommon(){
            this.isCommon=!this.isCommon
            let that = this
            console.log('--------========')
            console.log(this.$store.state.addressBook.selectedState)
            this.$store.state.addressBook.selectedState.filter(function(item){
                if(item.id==0){
                    if(item.value){
                        that.source=item.value
                    }
                }else if(item.id==1){
                    if(item.value){
                        that.status=item.value
                    }
                }else if(item.id==4){
                    if(item.value){
                        that.address=item.value
                    }
                }else if(item.id==5){
                    if(item.value){
                        that.scale=item.value
                    }
                }else if(item.id==6){
                    if(item.value){
                         that.nature=item.value
                    }
                }else if(item.id==7){
                    if(item.value){
                        that.industry=item.value
                    }
                    
                }else if(item.id==8){
                    if(item.value){
                        that.column=item.value
                    }
                    
                }
            })
        },
        gainCommon(state){
            console.log(state)
            this.toggleCommon()
            let that = this
            this.status=state
        },
        addCustom(){
            
        }
    },
    computed: {

    },
    watch: {
    },
    components: {
        CellBox,
        Group,
        Cell,
        Search,
        XTextarea,
        XInput,
        XButton,
        Scroller,
        Common,
    },
}
</script>

<style lang="less" scoped>
 @import './index.less';
</style>
