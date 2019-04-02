const state = {
    pageType: localStorage['pageType']?JSON.parse(localStorage['pageType']) : 'resumeList',
    talentListData: null,
    list: localStorage['list']?JSON.parse(localStorage['list']) : [],
    resumeDetailData: null,
    subscribeInfo: null,
    searchValue: '',
}

export default state
