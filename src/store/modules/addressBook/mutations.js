import * as types from './mutation-types'
import {cookie } from 'vux';
function removeDuplicatedItem3(ar) {
    var ret = [];

    ar.forEach(function(e, i, ar) {
        if (ar.indexOf(e) === i) {
            ret.push(e);
        }
    });

    return ret;
}


// 通讯录
const mutations = {
   /**
     * 选中的人
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/20
     * @author hezd
     */
    [types.SELECTED_MEMBER](state, data) {
        state.selectedMember = data
    },
    /**
     * 选中的组织架构
     * @param Object [k=>v参数对象] obj
     * @since 2018/5/28
     * @author hezd
     */
    [types.SELECTED_POST](state, data) {
        state.selectedPost = data
    },
    /**
     * 选中的状态：商机来源，商机状态，行业，汇款方式等
     * @param String [k=>v参数字符串] obj
     * @since 2018/5/28
     * @author hezd
     */
    [types.SELECTED_STATE](state, obj) {
        state.selectedState.filter(function(item){
            if(item.id==obj.id){
                item.value = obj.value
                item.boardId = obj.boardId
            }
        })
    },
    /**
     * 获取所有员工列表
     * @param Object [k=>v参数字符串] obj
     * @since 2018/4/10
     * @author hezd
     */
    [types.GETXSUSERLIST](state, obj) {
            
        if(obj.data.msg_alert){

        }else{  
            let dataList = []
                if(/statement/.test(window.location.href)){
                    dataList = obj.data.items
                }else{
                    dataList = obj.data.items.list
                }
                let re = new RegExp("^[A-Z]+$");
                let newArr = ['#']
                let newObj = {}
                for(let j=0;j<dataList.length;j++){
                    let name = dataList[j].userName
                    let title = makePy(name.toUpperCase())
                    
                    dataList[j].name=title[0]
                    dataList[j].flag=false
                    for(let i=0;i<state.selectedMember.length;i++){
                        if(dataList[j].userId == state.selectedMember[i].userId){
                            dataList[j].flag=true
                        }
                        if(/approval/.test(window.location.href)){
                            dataList[j].flag=false
                        }
                        let userDataFromlocal = JSON.parse(cookie.get('userDetail')).user.userId
                        if(/newPlan|changePlan/.test(window.location.href)){
                            if(userDataFromlocal==dataList[j].userId){
                                dataList[j].flag=true
                            }
                        }
                        
                    }
                    if(/statement/.test(window.location.href)){
                        dataList[j].flag=false
                    }
                }
                for(let i=0;i<dataList.length;i++){
                    if(re.test(dataList[i].name)){
                        newArr.push(dataList[i].name)
                    }
                }
                newArr = removeDuplicatedItem3(newArr)
                newArr = newArr.sort()
                let new_a = []
                for(let i=0;i<newArr.length;i++){
                    let obj={}
                    obj.name = newArr[i]
                    obj.childrenList=[]
                    new_a.push(obj)
                }
                for(let j=0;j<dataList.length;j++){
                    if(re.test(dataList[j].name)){
                        for(let i=0;i<new_a.length;i++){
                    
                            if(dataList[j].name==new_a[i].name){
                                new_a[i].childrenList.push(dataList[j])
                            }
                        }
                    }else{
                        new_a[0].childrenList.push(dataList[j])
                    }
                    
                }
                if(new_a[0].childrenList.length==0){
                    new_a.splice(0,1)
                }
                state.storeUserList = new_a  
        }
        state.userInitData = obj
    },
    /**
     * 获取组织架构列表
     * @param Object [k=>v参数字符串] obj
     * @since 2018/5/28
     * @author hezd
     */
    [types.GETDEPARTMENTLIST](state,  { data }) {
        if(data.alert_msg){

        }else{
            data.items.filter(function(item){
                item.flag=false
            })
            state.storeDepartMentList =data.items
        }
        
    },
    /**
     * 获取获取人员详情
     * @param Object [k=>v参数字符串] obj
     * @since 2018/5/31
     * @author hezd
     */
    [types.GETUSERDETAIL](state,  { data }) {
        state.userDetail =data
    },
    /**
     * 更新人员是否选中列表
     * @param Object [k=>v参数字符串] obj
     * @since 2018/6/1
     * @author hezd
     */
    [types.INITCOMPANYOBJ](state,  data) {
         state.storeUserList = data
    },
    /**
     * 选择的位全部人员还是企业架构
     * @param String [k=>v参数字符串] obj
     * @since 2018/6/1
     * @author hezd
     */
    [types.CHANGECOMPANY](state,  data) {
        state.companyState = data
    },
   /**
     * 获取部门下的人员列表
     * @param Object [k=>v参数字符串] obj
     * @since 2018/6/2
     * @author hezd
     */
    [types.GETUSERLISTBYDEPARTID](state, obj) {
        if(obj.data.alert_msg){
            state.departUserListData = obj
        }else{
            let re = new RegExp("^[A-Z]+$"); 
            let dataList = obj.data.items
            let newArr = ['#']
            let newObj = {}
            dataList.filter(function(items){
                let name = items.trueName
                let title = makePy(name.toUpperCase())
                
                items.name = title[0]
                items.flag = false
                for(let i=0;i<state.selectedMember.length;i++){
                    if(items.userId == state.selectedMember[i].userId){
                        items.flag=true
                    }
                    if(/approval/.test(window.location.href)){
                        items.flag=false
                    }
                    let userDataFromlocal = JSON.parse(cookie.get('userDetail')).user.userId
                    if(/newPlan|changePlan/.test(window.location.href)){
                        if(userDataFromlocal==items.userId){
                            items.flag=true
                        }
                    }
                }
                if(/statement/.test(window.location.href)){
                    items.flag=false
                }
                items.userName = items.trueName
                items.headPortrait = items.headLogo
            })
            for(let i=0;i<dataList.length;i++){
                if(re.test(dataList[i].name)){
                    newArr.push(dataList[i].name)
                }
            }
            newArr = removeDuplicatedItem3(newArr)
            newArr = newArr.sort()
            let new_a = []
            for(let i=0;i<newArr.length;i++){
                let obj={}
                obj.name = newArr[i],
                obj.childrenList=[]
                new_a.push(obj)
            }
            // for(let i=0;i<new_a.length;i++){
            //     for(let j=0;j<dataList.length;j++){
            //         if(dataList[j].name==new_a[i].name){
            //             new_a[i].childrenList.push(dataList[j])
            //         }
            //     }
            // }

            
            
            for(let j=0;j<dataList.length;j++){
                if(re.test(dataList[j].name)){
                    for(let i=0;i<new_a.length;i++){
                        if(dataList[j].name==new_a[i].name){
                            new_a[i].childrenList.push(dataList[j])
                        }
                    }
                }else{
                    new_a[0].childrenList.push(dataList[j])
                }
            }
            if(new_a[0].childrenList.length==0){
                new_a.splice(0,1)
            }
            state.departUserList = new_a   
        }
    },
    /**
     * 选择的位全部人员还是企业架构
     * @param String [k=>v参数字符串] obj
     * @since 2018/6/1
     * @author hezd
     */
    [types.FLAGFORINIT](state,  data) {
        state.flagForInit = !state.flagForInit
    },
    /**
     * 我的收到的人的工作报告
     * @param String [k=>v参数字符串] obj
     * @since 2018/6/8
     * @author hezd
     */
    [types.FLAGFORINIT](state,  data) {
        state.flagForInit = !state.flagForInit
    }
}

export default mutations
