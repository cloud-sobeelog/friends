const responseMessage = require("../../constants/responseMessage");
const statusCode = require("../../constants/statusCode");
const util = require("../../lib/util");
const userListGET = require("../../users/userListGET");
const checkValidUser = require("./checkValidUser");
const { friendsDB } = require("../../models");

module.exports = async(req, res) => {
    try{
        const {userid} = req.params;
        if(!userid){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, responseMessage.NULL_VALUE));
        }
        const isValidUser = await checkValidUser(userid);
        if(!isValidUser){
            return res.status(statusCode.UNAUTHORIZED).send(util.fail(statusCode.UNAUTHORIZED, responseMessage.NO_USER));
        }

        //user 서비스에 요청으로 nickname 받아옴.
        const userInfo = await userListGET(userid);
        const nickname = userInfo.nickname;

        const friendsList = await friendsDB.getReceivedFriendRequestsList(userid);

        const data = {
            nickname: nickname, // 닉네임 추가
            friendsList: friendsList // 친구 목록 추가(userid, friendid)
        };
        
        // //INFO: 현재 로그인된 사용자가 받은 친구 요청 리스트 반환
        // const result = await friendsDB.getReceivedFriendRequestsList(userid);
        // const requestList = result.map((requests) => {
        //     return requests;
        //   });

        // const data = {
        //     requestList: requestList,
        // }

        return res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_FRIEND_REQUESTS_SUCCESS, data));
    }
    catch(err){
        console.log(err);
        return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
    }
}