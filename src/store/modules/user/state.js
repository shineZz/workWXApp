const state = {
    storeTrueName:"",
    storeSchool:"",
    storeMajor:"",
    storeEducationHistory:"",
    storeCompany:"",
    storePost:"",
    storeQQ:"",
    storeWx:"",
    storeEmail:"",
    storeWorkplace:"",
    userHasChange:false,
    updateUserInfo: null,
    XsChangePassword: null,    
    userListData:{},
    departUserListData:{},
    resultChoice:[],
    shareCustom:[],
    colleague:[],
    getDict: {},
    ampAddress:{
        isOpenGps:false,
        location:{
            lat:"",
            lng:"",
            O:"",
            P:'',
        },
        province:"",
        city:"",
        area:"",
    }
}

export default state