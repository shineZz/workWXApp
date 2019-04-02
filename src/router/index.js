import Vue from 'vue'
import { base64,cookie } from 'vux'
import Router from 'vue-router'
import store from './../store'

const Login = r => require.ensure([], () => r(require('@/pages/user/login')), 'login');
const Forgot = r => require.ensure([], () => r(require('@/pages/user/forgot')), 'forgot');
const ResetPwd = r => require.ensure([], () => r(require('@/pages/user/resetPwd')), 'resetPwd');
const Register = r => require.ensure([], () => r(require('@/pages/user/register')), 'register');
const Experience = r => require.ensure([], () => r(require('@/pages/user/experience')), 'experience');

const Page = r => require.ensure([], () => r(require('@/pages/page')), 'page');
//公共页面跳转
const Attachment = r => require.ensure([], () => r(require('@/components/attachment')), 'attachment')//附件页面
const Iframe = r => require.ensure([], () => r(require('@/components/iframe')), 'iframe')//iframe页面
const Labels = r => require.ensure([], () => r(require('@/components/labels')), 'labels');//标签展示页面
const Customer = r => require.ensure([], () => r(require('@/components/customer')), 'customer');//选择客户
const Checkers = r => require.ensure([], () => r(require('@/components/checkers')), 'checkers');//选择分组来源阶段
// 主页 start
const Home = r => require.ensure([], () => r(require('@/pages/home')), 'home')
const MyPlan = r => require.ensure([], () => r(require('@/pages/home/myPlan')), 'myPlan')
const NewPlan = r => require.ensure([], () => r(require('@/pages/home/newPlan')), 'newPlan')
const ChangePlan = r => require.ensure([], () => r(require('@/pages/home/changePlan')), 'changePlan')
//仪表盘
const ResultsAdd = r => require.ensure([], () => r(require('@/pages/home/results/add')), 'resultsAdd')
const ResultsAll = r => require.ensure([], () => r(require('@/pages/home/results/all')), 'resultsAll')
const ResultsDetails = r => require.ensure([], () => r(require('@/pages/home/results/details')), 'resultsDetails')

// 主页 end

// 客户页 start
const Customs = r => require.ensure([], () => r(require('@/pages/customs')), 'customs')
const SearchPage = r => require.ensure([], () => r(require('@/pages/customs/custom/searchPage')), 'searchPage')
const SearchResult = r => require.ensure([], () => r(require('@/pages/customs/custom/searchResult')), 'searchResult')
const AppendCustom = r => require.ensure([], () => r(require('@/pages/customs/custom/appendCustom')), 'appendCustom')
const NewCustom = r => require.ensure([], () => r(require('@/pages/customs/custom/newCustom')), 'newCustom')
const CustomPage = r => require.ensure([], () => r(require('@/pages/customs/custom/customPage')), 'customPage')
const CustomContract = r => require.ensure([], () => r(require('@/pages/customs/custom/customPage/customContract')), 'customContract')
const CustomNewContract = r => require.ensure([], () => r(require('@/pages/customs/custom/customPage/customNewContract')), 'customNewContract')
const CustomNewPayment = r => require.ensure([], () => r(require('@/pages/customs/custom/customPage/customNewPayment')), 'customNewPayment')
const MyCustom = r => require.ensure([], () => r(require('@/pages/customs/custom/myCustom')), 'MyCustom')
// const ShareCustom = r => require.ensure([], () => r(require('@/pages/customs/custom/shareCustom')), 'shareCustom')
// 客户页 end
//工具 start
const Sign = r => require.ensure([], () => r(require('@/pages/customs/tool/sign')), 'sign')
const SignDetail = r => require.ensure([], () => r(require('@/pages/customs/tool/sign/signDetail')), 'signDetail')
const MyMap = r => require.ensure([], () => r(require('@/components/mymap')), 'MyMap')
const MessageHelp = r => require.ensure([], () => r(require('@/pages/customs/tool/messageHelp')), 'MessageHelp')
const CheckMessage = r => require.ensure([], () => r(require('@/pages/customs/tool/messageHelp/checkMessage')), 'checkMessage')
const MessageDetail = r => require.ensure([], () => r(require('@/pages/customs/tool/messageHelp/messageDetail')), 'MessageDetail')
const SelectedMsg = r => require.ensure([], () => r(require('@/pages/customs/tool/messageHelp/selectedMsg')), 'SelectedMsg')
const Generalize = r => require.ensure([], () => r(require('@/pages/customs/tool/generalize')), 'Generalize')
const TaskDetail = r => require.ensure([], () => r(require('@/pages/customs/tool/generalize/taskDetail')), 'TaskDetail')
const Describe = r => require.ensure([], () => r(require('@/pages/customs/tool/generalize/describe')), 'Describe')
const Accept = r => require.ensure([], () => r(require('@/pages/customs/tool/generalize/accept')), 'Accept')
const IsAccept = r => require.ensure([], () => r(require('@/pages/customs/tool/generalize/isAccept')), 'IsAccept')
const ReleaseTask = r => require.ensure([], () => r(require('@/pages/customs/tool/generalize/releaseTask')), 'releaseTask')
const Industry = r => require.ensure([], () => r(require('@/components/industry')), 'Industry')
const ReleaseLabel = r => require.ensure([], () => r(require('@/pages/customs/tool/generalize/releaseLabel')), 'ReleaseLabel')


const KnowMore = r => require.ensure([], () => r(require('@/pages/customs/tool/sign/knowMore')), 'KnowMore')
const SignCustom = r => require.ensure([], () => r(require('@/pages/customs/tool/sign/signCustom')), 'SignCustom')
const SelectedShare = r => require.ensure([], () => r(require('@/pages/customs/tool/sign/selectedShare')), 'SelectedShare')
const MyGroup = r => require.ensure([], () => r(require('@/pages/customs/tool/sign/myGroup')), 'MyGroup')
//AI秘书
const AI = r => require.ensure([], () => r(require('@/pages/customs/tool/AI')), 'AI');
const AiTask = r => require.ensure([], () => r(require('@/pages/customs/tool/AI/aiTask')), 'aiTask');
const AiView = r => require.ensure([], () => r(require('@/pages/customs/tool/AI/aiView')), 'aiView');
const AiOngoing = r => require.ensure([], () => r(require('@/pages/customs/tool/AI/aiOngoing')), 'aiOngoing');
const AiComplete = r => require.ensure([], () => r(require('@/pages/customs/tool/AI/aiComplete')), 'aiComplete');
const AiVoice = r => require.ensure([], () => r(require('@/pages/customs/tool/AI/aiVoice')), 'aiVoice');

//工具 end
// 工作页 start
const Job = r => require.ensure([], () => r(require('@/pages/job')), 'job')
const Inform = r => require.ensure([], () => r(require('@/pages/job/inform')), 'Inform')
const NoticeDetail = r => require.ensure([], () => r(require('@/pages/job/inform/noticeDetail')), 'NoticeDetail')
const Announce = r => require.ensure([], () => r(require('@/pages/job/inform/announce')), 'Announce')
const AddCustom = r => require.ensure([], () => r(require('@/pages/job/company/addCustom')), 'AddCustom')
const Work = r => require.ensure([], () => r(require('@/pages/job/work')), 'work')
const WodkChild = r => require.ensure([], () => r(require('@/pages/job/wodkChild')), 'wodkChild')
//发布动态
const Dynamic = r => require.ensure([], () => r(require('@/pages/job/work/dynamic')), 'dynamic')

//客户通讯录 start
const LinkDetail = r => require.ensure([], () => r(require('@/pages/job/company/linkDetail')), 'LinkDetail')
const BusinessChance = r => require.ensure([], () => r(require('@/pages/job/company/customDetail/businessChance')), 'BusinessChance')
const AddBusinessChance = r => require.ensure([], () => r(require('@/pages/job/company/customDetail/businessChance/addBusinessChance')), 'AddBusinessChance')
const Contract = r => require.ensure([], () => r(require('@/pages/job/company/customDetail/contract')), 'Contract')
const AddContract = r => require.ensure([], () => r(require('@/pages/job/company/customDetail/contract/addContract')), 'addContract')
const VisitingPlan = r => require.ensure([], () => r(require('@/pages/job/company/customDetail/visitingPlan')), 'VisitingPlan')
const AddVisitingPlan = r => require.ensure([], () => r(require('@/pages/job/company/customDetail/visitingPlan/addVisitingPlan')), 'AddVisitingPlan')
const VisitingRecord = r => require.ensure([], () => r(require('@/pages/job/company/customDetail/visitingRecord')), 'VisitingRecord')
const AddVisitingRecord = r => require.ensure([], () => r(require('@/pages/job/company/customDetail/visitingRecord/addVisitingRecord')), 'AddVisitingRecord')
const ReturnedMoney = r => require.ensure([], () => r(require('@/pages/job/company/customDetail/returnedMoney')), 'ReturnedMoney')
const AddReturnedMoney = r => require.ensure([], () => r(require('@/pages/job/company/customDetail/returnedMoney/addReturnedMoney')), 'AddReturnedMoney')
const OutCustomer = r => require.ensure([], () => r(require('@/components/outCustomer')), 'OutCutomer')
//工作报告
//日报月报周报三个总路有
const DayStatement = r => require.ensure([], () => r(require('@/pages/job/wodkChild/dayStatement')), 'DayStatement')
const Statement = r => require.ensure([], () => r(require('@/pages/job/workStatement/statement')), 'Statement')
const StatementDetail = r => require.ensure([], () => r(require('@/pages/job/workStatement/statementDetail')), 'StatementDetail')

//工作审批
//所有的工作审批：费用，请假等
const EmitApproving = r => require.ensure([], () => r(require('@/pages/job/workApproving/emitApproving')), 'EmitApproving')
const ApprovingDetail = r => require.ensure([], () => r(require('@/pages/job/workApproving/approvingDetail')), 'ApprovingDetail')

const Approval = r => require.ensure([], () => r(require('@/pages/job/wodkChild/approval')), 'approval')

// 工作页 end
//公共路由商机来源，商机状态，行业，回款类型等
const Company = r => require.ensure([], () => r(require('@/pages/job/company')), 'Company')
const CompanyDetail = r => require.ensure([], () => r(require('@/pages/job/company/companyDetail')), 'CompanyDetail')
const CustomDetail = r => require.ensure([], () => r(require('@/pages/job/company/customDetail')), 'CustomDetail')
//考勤签到
const Duty = r => require.ensure([], () => r(require('@/pages/job/signIn/duty')), 'Duty')
const Visit = r => require.ensure([], () => r(require('@/pages/job/signIn/visit')), 'SignIn')
const VisitDetail = r => require.ensure([], () => r(require('@/pages/job/signIn/visit/visitDetail')), 'VisitDetail')
//工作审批，工作报告，考勤签到页面路由

const DutyRecord = r => require.ensure([], () => r(require('@/pages/job/signIn/dutyRecord')), 'dutyRecord')

// 招商页
const Business = r => require.ensure([], () => r(require('@/pages/business')), 'business')
const Promote = r => require.ensure([], () => r(require('@/pages/business/promote')), 'promote')
const Merchants = r => require.ensure([], () => r(require('@/pages/business/merchants')), 'merchants')
const Analysis = r => require.ensure([], () => r(require('@/pages/business/analysis')), 'analysis')
const Progress = r => require.ensure([], () => r(require('@/pages/business/progress')), 'progress')
const ProgressDetails = r => require.ensure([], () => r(require('@/pages/business/progressDetails')), 'progressDetails')

// 找人才页
const TalentList = r => require.ensure([], () => r(require('@/pages/talentList')), 'talentList')
const TalentDetail = r => require.ensure([], () => r(require('@/pages/talentList/talentDetail')), 'talentDetail')
// 个人中心
const Personal = r => require.ensure([], () => r(require('@/pages/personal')), 'personal')
const UserInfo = r => require.ensure([], () => r(require('@/pages/personal/userInfo')), 'userInfo')
const NickName = r => require.ensure([], () => r(require('@/pages/personal/nickName')), 'nickName')
const PersonalDetail = r => require.ensure([], () => r(require('@/pages/personal/personalDetail')), 'personalDetail')
const MsgEdit = r => require.ensure([], () => r(require('@/pages/personal/msgEdit')), 'msgEdit')
const EducationWork = r => require.ensure([], () => r(require('@/pages/personal/educationWork')), 'educationWork')


//移动端地图
const Bmap = r => require.ensure([], () => r(require('@/components/bmap')), 'bmap')
Vue.use(Router)
const routes = [{
        path: '/',
        redirect: '/page'
    },

    {
        path: '/page',
        component: Page,
        children: [
            {
                path: '',
                redirect: '/page/home',
                meta: {
                    title: '首页',
                    requireAuth: true,
                    keepAlive:false,
                },
            },
            //首页 路由start
            {
                path: 'home',
                name: 'home',
                meta: {
                    title: '首页',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: Home,
            },
            
            {
                path: 'myPlan',
                name: 'myPlan',
                meta: {
                    title: '我的日程',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: MyPlan,
            },
            {
                path: 'newPlan/:sid',
                name: 'newPlan',
                meta: {
                    title: '新建日程',
                    keepAlive:false,
                    requireAuth: true
                },
                component: NewPlan,
            },
            {
                path: 'changePlan/:sid',
                name: 'changePlan',
                meta: {
                    title: '日程变更',
                    keepAlive:false,
                    requireAuth: true
                },
                component: ChangePlan,
            },
            {
                path: 'dynamic',
                name: 'dynamic',
                meta: {
                    title: '发布动态',
                    keepAlive:false,
                    requireAuth: true
                },
                component: Dynamic,
            },            
            //业绩看板
            {
                path: 'resultsAdd',
                name: 'resultsAdd',
                meta: {
                    title: '添加仪表盘',
                    keepAlive:false,
                    requireAuth: true
                },
                component: ResultsAdd,
            },
            {
                path: 'resultsAll',
                name: 'resultsAll',
                meta: {
                    title: '全部仪表盘',
                    keepAlive:false,
                    requireAuth: true
                },
                component: ResultsAll,
            },
            {
                path: 'resultsDetails',
                name: 'resultsDetails',
                meta: {
                    title: '仪表盘详情',
                    keepAlive:false,
                    requireAuth: true
                },
                component: ResultsDetails,
            },
            //首页 路由end

            //客户 路由start
            {
                path: 'customs',
                name: 'customs',
                meta: {
                    title: '客户',
                    keepAlive: false,
                    requireAuth: true
                },
                component: Customs,
            },
            {
                path: 'searchPage',
                name: 'searchPage',
                meta: {
                    title: '搜索',
                    keepAlive: true,
                    requireAuth: true
                },
                component: SearchPage,
            },
            {
                path: 'searchResult',
                name: 'searchResult',
                meta: {
                    title: '搜索',
                    keepAlive: false,
                    requireAuth: true
                },
                component: SearchResult,
            },
            {
                path: 'appendCustom',
                name: 'appendCustom',
                meta: {
                    title: '新增客户',
                    keepAlive: true,
                    requireAuth: true
                },
                component: AppendCustom,
            },
            {
                path: 'newCustom',
                name: 'newCustom',
                meta: {
                    title: '新增客户',
                    keepAlive: false,
                    requireAuth: true
                },
                component: NewCustom,
            },
            {
                path: 'customPage',
                name: 'customPage',
                meta: {
                    title: '客户详情',
                    keepAlive: false,
                    requireAuth: true
                },
                component: CustomPage,
            },
            {
                path: 'customContract',
                name: 'customContract',
                meta: {
                    title: '合同',
                    keepAlive: false,
                    requireAuth: true
                },
                component: CustomContract,
            },
            {
                path: 'customNewContract',
                name: 'customNewContract',
                meta: {
                    title: '添加合同',
                    keepAlive: false,
                    requireAuth: true
                },
                component: CustomNewContract,
            },
            {
                path: 'customNewPayment',
                name: 'customNewPayment',
                meta: {
                    title: '添加回款计划',
                    keepAlive: true,
                    requireAuth: true
                },
                component: CustomNewPayment,
            },
            {

                path: 'myCustom',
                name: 'myCustom',
                meta: {
                    title: '我的客户',
                    keepAlive: true,
                    requireAuth: true
                },
                component: MyCustom,
            },

            {

                path: 'accept',
                name: 'accept',
                meta: {
                    title: '推荐采纳',
                },
                component: Accept,
            },
            {

                path: 'isAccept',
                name: 'isAccept',
                meta: {
                    title: '采纳',
                    keepAlive: false,
                    requireAuth: true
                },
                component: IsAccept,
            },
            //工具 start
            {
                path: 'sign',
                name: 'sign',
                component: Sign,
                meta: {
                    title: '拜访签到',
                    
                }
            },
            {
                path: 'signDetail',
                name: 'signDetail',
                component: SignDetail,
                meta: {
                    title: '添加拜访',
                    keepAlive: false,
                    requireAuth: true
                }
            },
            {
                path: 'knowMore',
                name: 'knowMore',
                component: KnowMore,
                meta: {
                    title: '查看下属签到',
                    keepAlive: true,
                    requireAuth: true
                    
                }
            },
            {
                path: 'signCustom',
                name: 'signCustom',
                component: SignCustom,
                meta: {
                    title: '选择客户',
                    keepAlive: false,
                    requireAuth: true
                    
                }
            },
            {
                path: 'selectedShare',
                name: 'selectedShare',
                component: SelectedShare,
                meta: {
                    title: '共享客户',
                    keepAlive: false,
                    requireAuth: true
                }
            },
            {
                path: 'myGroup',
                name: 'myGroup',
                component: MyGroup,
                meta: {
                    title: '分组客户',
                    keepAlive: false,
                    requireAuth: true
                    
                }
            },
            {
                path: 'mymap',
                name: 'mymap',
                component: MyMap,
                meta: {
                    title: '',
                    keepAlive: false,
                    requireAuth: true
                }
            },
            {
                path: 'messageHelp',
                name: 'messageHelp',
                component: MessageHelp,
                meta: {
                    title: '短信助手',
                    keepAlive: false,
                    requireAuth: true
                }
            },
            {
                path: 'checkMessage',
                name: 'checkMessage',
                component: CheckMessage,
                meta: {
                    title: '查看短信',
                    keepAlive: false,
                    requireAuth: true
                    
                }
            },
            {
                path: 'messageDetail',
                name: 'messageDetail',
                component: MessageDetail,
                meta: {
                    title: '写短信',
                    keepAlive: true,
                    requireAuth: true
                }
            },
            {
                path: 'selectedMsg',
                name: 'selectedMsg',
                component: SelectedMsg,
                meta: {
                    title: '选择收件人',
                    keepAlive: false,
                    requireAuth: true
                    
                }
            },
            {
                path: 'generalize',//推广和猎客内容
                name: 'generalize',
                component: Generalize,
                meta: {
                    title: '.',
                    keepAlive: false,//缓存
                    requireAuth: true
                    
                }
            },
            {
                path: 'releaseTask',
                name: 'releaseTask',
                component: ReleaseTask,
                meta: {
                    title: '发布任务',
                    keepAlive:false,
                    requireAuth: true
                    
                }
            },
            {
                path: 'taskDetail',
                name: 'taskDetail',
                component: TaskDetail,
                meta: {
                    title: '任务详情',
                    keepAlive: false,
                    requireAuth: true
                    
                }
            },
            {
                path: 'describe',
                name: 'describe',
                component: Describe,
                meta: {
                    title: '任务描述',
                    keepAlive: false,
                    requireAuth: true
                    
                }
            },
            {
                path: 'industry',
                name: 'industry',
                component: Industry,
                meta: {
                    title: '所属行业',
                    keepAlive: false,
                    requireAuth: true
                    
                }
            },
            {
                path: 'releaseLabel',
                name: 'releaseLabel',
                component: ReleaseLabel,
                meta: {
                    title: '推荐内容',
                    keepAlive: false,
                    requireAuth: true
                    
                }
            },
            //ai秘书
            {
                path: 'AI',
                name: 'AI',
                component: AI,
                meta: {
                    title: 'AI秘书',
                    keepAlive:false,
                    requireAuth: true
                    
                }
            },
            {
                path: 'aiTask',
                name: 'aiTask',
                component: AiTask,
                meta: {
                    title: '添加任务',
                    keepAlive:false,
                    requireAuth: true
                    
                }
            },
            {
                path: 'aiView',
                name: 'aiView',
                component: AiView,
                meta: {
                    title: '查看下属AI外呼',
                    keepAlive:false,
                    requireAuth: true
                    
                }
            },
            {
                path: 'aiComplete',
                name: 'aiComplete',
                component: AiComplete,
                meta: {
                    title: '外呼详情',
                    keepAlive:false,
                    requireAuth: true
                    
                }
            },
            {
                path: 'aiOngoing',
                name: 'aiOngoing',
                component: AiOngoing,
                meta: {
                    title: '外呼详情',
                    keepAlive:false,
                    requireAuth: true
                    
                }
            },
            {
                path: 'aiVoice',
                name: 'aiVoice',
                component: AiVoice,
                meta: {
                    title: '客户语音转换',
                    keepAlive:false,
                    requireAuth: true
                    
                }
            },

            
            //工具 end
            //客户 路由end

            

            //工作 路由start
            {
                path: 'job',
                name: 'job',
                meta: {
                    title: '工作',
                    keepAlive:true,
                    requireAuth: true
                },
                component: Job,
            },
            {
                path: 'work',
                name: 'work',
                meta: {
                    title: '工作圈',
                    keepAlive:false,
                    requireAuth: true
                },
                component: Work,
            },
            //通知 start
            {
                path: 'inform',
                name: 'inform',
                meta: {
                    title: '通知',
                    keepAlive:false,
                    requireAuth: true
                },
                component: Inform,                
            }, 
            {
                path: 'announce',
                name: 'announce',
                meta: {
                    title: '发布公告',
                    keepAlive:false,
                    requireAuth: false
                },
                component: Announce,
            },
            {
                path: 'noticeDetail',
                name: 'NoticeDetail',
                meta: {
                    title: '公告详情',
                    keepAlive:false,
                    requireAuth: true
                },
                component: NoticeDetail,
            },
            //公告end 
            //企业通讯里 start 待定
            {
                path: 'job/company',
                name: 'company',
                meta: {
                    title: '企业通讯录',
                    keepAlive:false,
                    requireAuth: true
                },
                component: Company,
            },
            //客户通讯录start
            {
                path: 'job/companyDetail',
                name: 'companyDetail',
                meta: {
                    title: '详情页',
                    keepAlive:false,
                    requireAuth: true
                },
                component: CompanyDetail,
            },
            {
                path: 'job/customDetail/:id',
                name: 'CustomDetail',
                meta: {
                    title: '客户详情',
                    keepAlive:false,
                    requireAuth: true
                },
                component: CustomDetail,
            },
            {
                path: 'linkDetail',
                name: 'LinkDetail',
                meta: {
                    title: '联系人',
                    keepAlive:false,
                    requireAuth: true
                },
                component: LinkDetail,
            },
            {
                path: 'businessChance',
                name: 'BusinessChance',
                meta: {
                    title: '商机',
                    keepAlive:false,
                    requireAuth: true
                },
                component: BusinessChance,
            },
            {
                path: 'job/addBusinessChance',
                name: 'AddBusinessChance',
                meta: {
                    title: '新增商机',
                    keepAlive:false,
                    requireAuth: true
                },
                component: AddBusinessChance,
            },
            {
                path: 'visitingPlan',
                name: 'visitingPlan',
                meta: {
                    title: '拜访计划',
                    keepAlive:false,
                    requireAuth: true
                },
                component: VisitingPlan,
            },
            {
                path: 'job/addVisitingPlan',
                name: 'AddVisitingPlan',
                meta: {
                    title: '新增拜访计划',
                    keepAlive:false,
                    requireAuth: true
                },
                component: AddVisitingPlan,
            },
            {
                path: 'visitingRecord',
                name: 'visitingRecord',
                meta: {
                    title: '拜访记录',
                    keepAlive:false,
                    requireAuth: true
                },
                component: VisitingRecord,
            },
            {
                path: 'job/addVisitingRecord',
                name: 'AddVisitingRecord',
                meta: {
                    title: '新增拜访记录',
                    requireAuth: true
                },
                component: AddVisitingRecord,
            },
            {
                path: 'contract',
                name: 'contract',
                meta: {
                    title: '合同',
                    requireAuth: true
                },
                component: Contract,
            },
            {
                path: 'job/addContract',
                name: 'AddContract',
                meta: {
                    title: '新增合同',
                    requireAuth: true
                },
                component: AddContract,
            },
            {
                path: 'returnedMoney',
                name: 'returnedMoney',
                meta: {
                    title: '回款',
                    requireAuth: true
                },
                component: ReturnedMoney,
            },
            {
                path: 'job/addReturnedMoney',
                name: 'AddReturnedMoney',
                meta: {
                    title: '新增回款',
                    requireAuth: true
                },
                component: AddReturnedMoney,
            },
            {
                path: 'job/addCustom',
                name: 'AddCustom',
                meta: {
                    title: '新增客户',
                    keepAlive:false,
                    requireAuth: true
                },
                component: AddCustom,
            },
            //客户通讯录end
            {
                path: 'outCustomer',
                name: 'outCustomer',
                meta: {
                    title: '导入外部联系人',
                    keepAlive:false,
                    requireAuth: true
                },
                component: OutCustomer,
            },
            {
                path: 'duty',
                name: 'Duty',
                meta: {
                    title: '上下班签到',
                    keepAlive:false,
                    requireAuth: true
                },
                component: Duty,
            },
            {
                path: 'visit',
                name: 'Visit',
                meta: {
                    title: '拜访列表',
                    keepAlive:false,
                    requireAuth: true
                },
                component: Visit,
            },
            {
                path: 'visitDetail',
                name: 'VisitDetail',
                meta: {
                    title: '拜访签到',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: VisitDetail,
            },
            //工作报告start
            {
                path: 'dayStatement',//1日报2周报3月报
                name: 'DayStatement',
                meta: {
                    title: '发起日报',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: DayStatement,
            },
            {
                path: 'statement',
                name: 'Statement',
                meta: {
                    title: '我发起的',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: Statement,
            },
            {
                path: 'statementDetail',
                name: 'StatementDetail',
                meta: {
                    title: '报告',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: StatementDetail,
            },
            //工作报告end
            //工作审批start

            {
                path: 'approval',
                name: 'approval',
                meta: {
                    title: '工作审批',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: Approval,
            },
            {
                path: 'emitApproving',
                name: 'EmitApproving',
                meta: {
                    title: '我发起的',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: EmitApproving,
            },
            {
                path: 'approvingDetail',
                name: 'ApprovingDetail',
                meta: {
                    title: '我发起的',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: ApprovingDetail,
            },
            {
                path: 'dutyRecord',
                name: 'DutyRecord',
                meta: {
                    title: '签到记录',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: DutyRecord,
            },
            //工作 end
            //招商 start
            {
                path: 'business',
                name: 'business',
                meta: {
                    title: '招商',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: Business,
            },
            {
                path: 'promote',
                name: 'promote',
                meta: {
                    title: '推广',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: Promote
            },
            {
                path: 'analysis',
                name: 'analysis',
                meta: {
                    title: '推广详情',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: Analysis
            },
            {
                path: 'merchants',
                name: 'merchants',
                meta: {
                    title: '招商',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: Merchants
            },
            {
                path: 'progress',
                name: 'progress',
                meta: {
                    title: '招商进度',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: Progress
            },
            {
                path: 'progressDetails',
                name: 'progressDetails',
                meta: {
                    title: '招商进度详情',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: ProgressDetails
            },
            //招商 路由end
            //找人才 路由start
            {
                path: 'talentList',
                name: 'talentList',
                meta: {
                    title: '人才中心',
                    requireAuth: true,
                    keepAlive:true,
                },
                component: TalentList,

            },
            {
                path: 'talentDetail/:lid',
                name: 'talentDetail',
                meta: {
                    title: '简历详情',
                    requireAuth: true,
                    keepAlive: false,
                },
                component: TalentDetail
            },
            //找人才 路由end
            {
                path: 'personal',
                name: 'personal',
                meta: {
                    title: '我的',
                    requireAuth: true,
                    keepAlive: false,
                },
                component: Personal
            },
            {
                path: 'userInfo',
                name: 'userInfo',
                meta: {
                    title: '设置账户信息',
                    requireAuth: true,
                    keepAlive: false,
                },
                component: UserInfo
            },
            {
                path: 'nickName',
                name: 'nickName',
                meta: {
                    title: '修改我的昵称',
                    requireAuth: true,
                    keepAlive: false,
                },
                component: NickName
            },
            //公共 路由start
            {
                path: 'attachment',
                name:'attachment',
                meta: {
                    title: '附件',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: Attachment,
            },
            {
                path: 'iframe',
                name:'iframe',
                meta: {
                    title: '附件',
                },
                component: Iframe,
            },
            {
                path: 'labels',
                name:'labels',
                meta: {
                    title: '标签',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: Labels,
            },
            {
                path: 'customer',
                name:'customer',
                meta: {
                    title: '选择客户',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: Customer,
            },
            {
                path: 'checkers',
                name:'checkers',
                meta: {
                    title: '请选择',
                    requireAuth: true,
                    keepAlive: true,
                },
                component: Checkers,
            },
            
            //工作子页面
            {
                path: 'wodkChild',
                name: 'wodkChild',
                meta: {
                    title: '工作',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: WodkChild,
            },
             //公共 路由end
             //个人中心start
             {
                path: 'personalDetail',
                name: 'PersonalDetail',
                meta: {
                    title: '设置个人信息',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: PersonalDetail,
            },
            {
                path: 'msgEdit',
                name: 'MsgEdit',
                meta: {
                    title: '设置个人信息',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: MsgEdit,
            },
            {
                path: 'educationWork',
                name: 'EducationWork',
                meta: {
                    title: '',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: EducationWork,
            },
            //地图
            {
                path: 'bmap',
                name: 'Bmap',
                meta: {
                    title: '地图',
                    requireAuth: true,
                    keepAlive:false,
                },
                component: Bmap,
            },
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            title: '登录',
        }
    },
    // 注册、忘记密码
    {
        path: '/forgot',
        name: 'forgot',
        component: Forgot,
        meta: {
            title: '忘记密码',
        }
    },
    {
        path: '/resetPwd',
        name: 'resetPwd',
        component: ResetPwd,
        meta: {
            title: '重置密码',
            
        }
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {
            title: '注册',
            
        }
    },
    {
        path: '/experience',
        name: 'experience',
        component: Experience,
        meta: {
            title: '欢迎体验小宝销售',
            
        }
    },
    { 
        path: '*', 
        redirect: '/page/home',
    }
]

const router = new Router({
    mode: 'history',
    routes
})
    //页面滑动效果开始
const history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
let isPush = false
let endTime = Date.now()
let methods = ['push', 'go', 'replace', 'forward', 'back']
document.addEventListener('touchend', () => {
    endTime = Date.now()
})
methods.forEach(key => {
    let method = router[key].bind(router)
    router[key] = function(...args) {
        isPush = true
        method.apply(null, args)
    }
})
let weiXinNum=0;
//页面滑动效果结束
router.beforeEach((to, from, next) => {    
    // 设置标题
    document.title = to.meta.title
    store.commit('UPDATE_TITLE', to.meta.title)
    // 如果没有用户登录信息，跳转login页
    let userInfo = cookie.get('userDetail'); 
    if (to.matched.some(r => r.meta.requireAuth)) {
        if (!userInfo ) {
            if(to.path!='/page/bmap'){//不是在高德地图外接页面的时候
                next({
                    path: '/login',
                    query: { redirect: to.fullPath }  //将跳转的路由path作为参数，登录成功后跳转到该路由
                })
            }
        } else {
            if(to.path=='/login'){
                next({
                    path: '/login',
                    query: { redirect: to.fullPath }  //将跳转的路由path作为参数，登录成功后跳转到该路由
                })
            }else{
                if(to.path!='/page/bmap'){//不是在高德地图外接页面的时候
                    //当是企业微信的时候导入
                    if(localStorage.getItem('phonePort') == 'qywx' && weiXinNum==0){ 
                        weiXinNum++;
                        $.getScript('http://res.wx.qq.com/open/js/jweixin-1.2.0.js', function() {
                            store.state.wx=wx;
                        }, this);
                    }
                    next()
                }
                
            }
           
        }
    }
    const toIndex = history.getItem(to.path)
    const fromIndex = history.getItem(from.path)  
    if (toIndex) {
        if (!fromIndex || (toIndex === '0' && fromIndex === '0')||parseInt(toIndex, 10) > parseInt(fromIndex, 10)) { 
             // 判断是否是ios左滑返回
            if((Date.now() - endTime) < 377){
                store.commit('UPDATE_DIRECTION', { direction: 'forward' })
            }else{
                store.commit('UPDATE_DIRECTION', { direction: '' })
            }  
        
        }else {
            // 判断是否是ios左滑返回
            if (!isPush && (Date.now() - endTime) < 377) {
                store.commit('UPDATE_DIRECTION', { direction: 'forward' })
            } else {
                if((Date.now() - endTime) < 377){
                    store.commit('UPDATE_DIRECTION', { direction: '' })
                }else{
                    store.commit('UPDATE_DIRECTION', { direction: 'go' })
                }
                
            }
        }
    } else {
        ++historyCount
        history.setItem('count', historyCount)
        to.path !== '/' && history.setItem(to.path, historyCount)
        store.commit('UPDATE_DIRECTION', { direction: 'forward' })
    }
    next();
})

router.afterEach(function(to) {
    store.commit('UPDATE_LOADING', false)
})

export default router