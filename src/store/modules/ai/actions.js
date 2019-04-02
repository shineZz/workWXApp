import * as types from './mutation-types'
import { talkAboutSvr,phoneListSvr,queryNameListSvr,addAiTaskSvr,seatsSvr,queryListSvr,allTaskStatusSvr,
         allTaskStartSvr,allTaskEndSvr,industryScreeningSvr,statisticalSvr ,taskPhoneListSvr,taskPhoneDetailSvr,
         delTaskSvr,startTaskSvr,pauseTaskSvr,addCustomerSvr,readTaskSvr,intentionGradeSvr,outboundWaySvr,aiIsSvr,
         customerResultSvr,
        } from '@/services/ai'

/**
 * 获取话术列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/15
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  talkAboutHand ({commit}, obj) { 
  let data = await talkAboutSvr(obj)
  commit(
    {
      type: types.TALKABOUT,
      data: data
    }
  )
}
/**
 *  获取主叫号码列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/15
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  phoneListHand ({commit}, obj) { 
  commit('UPDATE_LOADING', true, { root: true })
  let data = await phoneListSvr(obj)
  commit(
    {
      type: types.PHONELIST,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 *  查询全量的任务名称
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/15
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  queryNameListHand ({commit}, obj) { 
  let data = await queryNameListSvr(obj)
  commit(
    {
      type: types.QUERYNAMELIST,
      data: data
    }
  )
}
/**
 *  添加通话记录到新的任务
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  addCustomerHand ({commit}, obj) { 
  commit('UPDATE_LOADING', true, { root: true })
  let data = await addCustomerSvr(obj)
  commit(
    {
      type: types.ADDCUSTOMER,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 *  创建ai任务
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/16
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  addAiTaskHand ({commit}, obj) { 
  commit('UPDATE_LOADING', true, { root: true })
  let data = await addAiTaskSvr(obj)
  commit(
    {
      type: types.ADDAITASK,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 *  获取当前线路的席位
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/16
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  seatsHand ({commit}, obj) { 
  commit('UPDATE_LOADING', true, { root: true })
  let data = await seatsSvr(obj)
  commit(
    {
      type: types.SEATS,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 *  获取任务列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/17
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  queryListHand ({commit}, obj) { 
  let data = await queryListSvr(obj)
  commit(
    {
      type: types.QUERYLIST,
      data: data
    }
  )
}

/**
 *  获取全部启动/全部暂停 按钮状态
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/17
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  allTaskStatusHand ({commit}, obj) { 
 
  let data = await allTaskStatusSvr(obj)
  commit(
    {
      type: types.ALLTASKSTATUS,
      data: data
    }
  )
}
/**
 *  启动全部任务
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/17
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  allTaskStartHand ({commit}, obj) {
  let data = await allTaskStartSvr(obj)
  commit(
    {
      type: types.ALLTASKSTART,
      data: data
    }
  )
}
/**
 *  暂停全部任务
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/17
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  allTaskEndHand ({commit}, obj) { 
  let data = await allTaskEndSvr(obj)
  commit(
    {
      type: types.ALLTASKEND,
      data: data
    }
  )
}
/**
 *  获取话术的行业名称
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/17
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  industryScreeningHand ({commit}, obj) { 
  let data = await industryScreeningSvr(obj)
  commit(
    {
      type: types.INDUSTRYSCREENING,
      data: data
    }
  )
}
/**
 *  获取任务统计分析结果
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/17
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  statisticalHand ({commit}, obj) { 
  commit('UPDATE_LOADING', true, { root: true })
  let data = await statisticalSvr(obj)
  commit(
    {
      type: types.STATISTIC,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 *  获取任务下的通话列表
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  taskPhoneListHand ({commit}, obj) { 
  let data = await taskPhoneListSvr(obj)
  commit(
    {
      type: types.TASKPHONELIST,
      data: data
    }
  )
}
/**
 *  获取通话详情
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  taskPhoneDetailHand ({commit}, obj) { 
  commit('UPDATE_LOADING', true, { root: true })
  let data = await taskPhoneDetailSvr(obj)
  commit(
    {
      type: types.TASKPHONEDETAIL,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}

/**
 *  删除任务
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  delTaskHand ({commit}, obj) { 
  commit('UPDATE_LOADING', true, { root: true })
  let data = await delTaskSvr(obj)
  commit(
    {
      type: types.DELTASK,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 *  启动任务
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  startTaskHand ({commit}, obj) { 
  let data = await startTaskSvr(obj)
  commit(
    {
      type: types.STARTTASK,
      data: data
    }
  )
}
/**
 *  暂停任务
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  pauseTaskHand ({commit}, obj) { 
  let data = await pauseTaskSvr(obj)
  commit(
    {
      type: types.PAUSETASK,
      data: data
    }
  )
}
/**
 *  提交已读状态
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  readTaskHand ({commit}, obj) { 
  let data = await readTaskSvr(obj)
  commit(
    {
      type: types.READTASK,
      data: data
    }
  )
}
/**
 *  提交人工意向等级
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/20
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  intentionGradelHand ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true }) 
  let data = await intentionGradeSvr(obj)
  commit(
    {
      type: types.INTENTIONGRADE,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true })
}
/**
 *  外呼方式
 * @param Object [k=>v参数对象] obj
 * @since 2018/08/21
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  outboundWayHand ({commit}, obj) {
   
  let data = await outboundWaySvr(obj)
  commit(
    {
      type: types.OUTBOUNDWAY,
      data: data
    }
  )
}

/**
 *  当前AI企业有没有开通
 * @param Object [k=>v参数对象] obj
 * @since 2018/09/06
 * @author dbj
 * @returns {Promise.<*>}
 */
export async function  aiIsHand ({commit}, obj) {
  commit('UPDATE_LOADING', true, { root: true }) 
  let data = await aiIsSvr(obj)
  commit(
    {
      type: types.AIIS,
      data: data
    }
  )
  commit('UPDATE_LOADING', false, { root: true }) 
}
/**
 *  意向选择数据
 * @param Object [k=>v参数对象] obj
 * @since 2018/09/11
 * @author hezd
 * @returns {Promise.<*>}
 */
export async function  customerResult ({commit}, obj) {
  let data = await customerResultSvr(obj)
  commit(
    {
      type: types.CUSTOMERRESULT,
      data: data
    }
  )
}
