<template>
    <div class="customRecord">
        <scroller lock-x scrollbarY ref="scroller" @on-scroll-bottom="loadMore" :height="height"
        v-model="status" use-pulldown @on-pulldown-loading="refresh">
            <div class="container">
                <div v-for="(v, i) in recordList" :key="i" v-if="recordList.length>0">
                    <p class="date">{{v[0]}}</p>
                    <timeline class="content">
                        <timeline-item v-for="item in v.slice(1)" :key="item.id">
                            <p class="time">{{item.time}}</p>
                            <p class="type">{{item.type_name}}</p>
                            <div class="task">
                                <h4>{{item.sub_type_name}}：</h4>
                                <p v-if="item.type===8" class="view" @click="viewHand(item, 0)">点击查看记录详情</p>
                                <p v-for="(it, idx) in item.params" :key="idx">
                                    <span v-if="it.key">{{it.key}}：</span>
                                    <span v-if="!it.type" class="break-word">{{it.value}}</span>
                                    <span v-if="it.type===2" class="view" @click="viewHand(item, it)">点击查看详情</span>
                                    <span v-if="it.type===1">{{typeof(it.value)==='string'?it.value:it.value.join()}}</span>
                                </p>
                                <i @click="telRecordHand(item)" class="call-record" v-if="item.type===2&&item.callphone_url"></i>
                            </div>
                        </timeline-item>
                    </timeline>
                </div>
                <!-- 底部区域 -->
                <load-more tip="加载中" v-if="has_more"></load-more>
                <div class="no-more" v-if="!has_more&&page!==1">已到底部</div>
            </div>
            <!-- 下拉组件 -->
            <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down" style="position: absolute; width: 100%; height: 60px; line-height: 60px; top: -60px; text-align: center;">
                <span v-show="status.pulldownStatus === 'default'"></span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' " >下拉加载更多</span>
                <span class="pulldown-arrow" v-show="status.pulldownStatus === 'up'" :class="{'rotate': status.pulldownStatus === 'up'}">释放后加载</span>
                <load-more tip="加载中" v-show="status.pulldownStatus === 'loading'" ></load-more>
            </div>
        </scroller>
        <!-- popup -->
        <div v-transfer-dom>
            <!-- 记录备注 -->
            <popup v-model="remark" width="80%" height="100%" position="left" is-transparent v-if="remark">
                <div class="popup">
                    <FormA :moduleObj="moduleObj"/>
                </div>
            </popup>
            <!-- 通话录音 -->
            <popup v-model="record" height="50" position="bottom" is-transparent v-if="record">
                <div class="popup">
                    <audio id="audio" style="width: 100%" :src="telRecord.url" controls="controls"></audio>
                </div>
            </popup>
        </div>
    </div>
</template>

<script>
import { Timeline, TimelineItem, Scroller, LoadMore, TransferDom, Popup, XButton } from 'vux'
import { mapState,mapActions,mapMutations } from 'vuex'
import FormA from '@/components/formA'

export default {
    name: 'customRecord',
    data() {
        return {
            customerId: 0,
            has_more: false,
            remark: false,
            record: false,
            recordList: [],
            moduleObj: {
                textareaHeight:220,
                uploadData: [],
                record: true,
                disabledFlag: true,
                recordObj: {
                    id: '',
                    url: '',
                    data: '',
                    duration: '',
                }
            },
            telRecord: {
                url: '',
                duration: ''
            },
            // scroller相关
            height: '-250',
            status: {               //下拉状态
                pulldownStatus: 'default'
            },
            // 后台参数
            userId: this.$store.state.userInfo.user.userId,
            companyId: this.$store.state.userInfo.company.companyId,
            page: 1,
            count: 10,
        }
    },
    created() {
        this.customerId = this.$route.query.id
        this.height = this.$route.query.highSeas?this.$route.query.reviewProgress?'-197':'-233':'-250'
        this.handleRequest()
    },
    methods: {
        ...mapActions({
            customeractionrecord_customerRecordLists: 'customeractionrecord/customerRecordLists',
        }),
        handleRequest() {
            if (this.isLoading) {
                return
            }
            let obj = {
                customer_id: this.customerId,
                page: this.page,
                count: this.count,
            }
            this.customeractionrecord_customerRecordLists(obj)
        },
        refresh() {
            this.page = 1
            this.handleRequest()
            this.$nextTick(() => {
                this.$refs.scroller.donePulldown()
            })
        },
        loadMore() {
            if (!this.has_more || this.isLoading) {
                return
            } else {
                this.page += 1
                this.handleRequest()
            }
        },
        viewHand(item, it) {
            if (item.type!==8&&it.type!==2) {
                return
            }
            if (item.type===8) {
                this.moduleObj.inputVal = item.note
                this.moduleObj.uploadData = item.customer_attach_img.map(v => {
                    return{
                        name: v.sort_num,
                        src: v.url
                    }
                })
                this.moduleObj.recordObj.url = item.customer_attach_audio.length>0?item.customer_attach_audio[0].url:''
                this.moduleObj.recordObj.duration = item.customer_attach_audio.length>0?item.customer_attach_audio[0].duration:''
            } else {
                this.moduleObj.inputVal = it.value
                this.moduleObj.uploadData = it.imgs_url.map(v => {
                    return{
                        name: v.sort_num,
                        src: v.url
                    }
                })
                this.moduleObj.recordObj.url = it.audio_url.length>0?it.audio_url[0].url:''
                this.moduleObj.recordObj.duration = it.audio_url.length>0?it.audio_url[0].duration:''
            }
            this.remark = true
        },
        telRecordHand(item) {
            this.telRecord = {
                url: item.callphone_url,
                duration: item.callphone_duration,
            }
            this.record = true
        },
    },
    computed: {
        ...mapState({
            isLoading: state => state.isLoading,
            getRecord: state => state.customeractionrecord.getRecord,
        })
    },
    watch: {
        getRecord(data) {
            if (Object.keys(data).length>0) {
                if (data.alert_msg) {
                    this.$vux.toast.show({
                        text: data.alert_msg,
                        type: 'text',
                        position: 'top',
                        width:"18em"
                    })
                    return
                } else {
                    this.has_more = data.has_more
                    let arr = data.items.map(v => v.date)
                    arr = [...new Set(arr)]
                    arr = arr.map(v => [v])
                    let i = -1
                    let date = ''
                    data.items.forEach(v => {
                        if (v.date !== date) {
                            i++
                            date = v.date
                            arr[i].push(v)
                        } else {
                            arr[i].push(v)
                        }
                    })
                    if (this.page == 1) {
                        this.recordList = arr
                    } else {
                        let last = this.recordList.length-1
                        if (this.recordList[last][0]===arr[0][0]) {
                            this.recordList[last] = this.recordList[last].concat(arr[0].slice(1))
                            this.recordList = this.recordList.concat(arr.slice(1))
                        } else {
                            this.recordList = this.recordList.concat(arr)
                        }
                    }
                }
            }
        },
    },
    directives: {
        TransferDom
    },
    components: {
        Timeline,
        TimelineItem,
        Scroller,
        LoadMore,
        Popup,
        FormA,
        XButton
    },
}
</script>

<style lang="less">
// 时间线
.customRecord .vux-timeline {
	padding-left: 60px;
}
.customRecord .vux-timeline .vux-timeline-item .vux-timeline-item-color {
    border: 1px solid @blue;
    background: @blue;
}
.customRecord .vux-timeline .vux-timeline-item .vux-timeline-item-head {
    left: -9px;
    top: 1px;
    width: 25px;
    height: 25px;
}
.customRecord .vux-timeline .vux-timeline-item .vux-timeline-item-tail {
    // display: inline-block !important;
    width: 1px;
    top: 18px;
    left: 4px;
    // height: 91px;
    background: #e0e0e0;
}
.customRecord .vux-timeline .vux-timeline-item .vux-timeline-item-head-first {
    left: -9px;
    top: 1px;
    width: 25px;
    height: 25px;
    border: 1px solid @blue;

    i {
        display: none;
    }
}
.customRecord .vux-timeline .vux-timeline-item:not(:last-child) .vux-timeline-item-tail {
    display: block !important;
}
.customRecord .vux-timeline .vux-timeline-item:last-child .vux-timeline-item-tail {
    display: none !important;
}
.customRecord .vux-timeline .vux-timeline-item.list {
    margin-top: 15px;

    .vux-timeline-item-tail {
        height: 137%;
        top: -7px;
    }
}
.customRecord .vux-timeline .vux-timeline-item.list:first-child .vux-timeline-item-tail {
    top: 15px;
}
</style>


<style lang="less" scoped>
 @import './index.less';
</style>
