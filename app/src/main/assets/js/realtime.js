//判断是否是游客模式
if(moblie.isTouristMode()){
    //如果是游客模式的话，获取游客ID并登陆
    initChatroom(moblie.getTouristID());
}else{
  //如果不是游客模式，则判断是否登录
if(moblie.isLogin()){
        //如果已经登录，则获取clientID
       initChatroom(moblie.getClientID());
   }else{
        //否则弹出提示
       moblie.alert("请登录");
        //跳转到登录界面
       moblie.moveToLogin();
   }
 }

//初始化聊天室
function initChatroom(clientID){
angular.module('realTimeModule', [])
    .controller('realTimeCtrl', ['$scope', '$timeout', function($scope, $timeout) {
        initStatus();
        initData();

        function initStatus() {
            $scope.status = {
                Realtime: AV.Realtime,
                appId: "jPbaegow8uVUDUDw1XS7LCv0-gzGzoHsz",
                region: ['cn', 'us'],
                //用户名ID
                clientId:clientID,
                roomId: "57fcac8ea22b9d005b0e9884",
                client: "",
                isLinkSuccess: false,
                isLinkFailed: false,
                isLinking: false,
                messageIterator: "",
                msg: "",
                room: "",
                myMsgs: [],
                members: [],
                historys: []
            };
        }

        function initData() {
            $scope.data = {
                realtime: new $scope.status.Realtime({
                    appId: $scope.status.appId,
                    region: $scope.status.region[0],
                }),
            };
            initChatroom();
            setVideoScale();
            setChatroomHeight();

        }

        /**
         * [initChatroom description] 初始化聊天室
         * @return {[type]} [description]
         */
        function initChatroom() {
            $scope.status.isLinking = true;
            $scope.data.realtime.createIMClient($scope.status.clientId)
                .then(function(client) {
                    $timeout(function() {
                        $scope.status.isLinkSuccess = true;
                        $scope.status.client = client;
                    }, 500);
                    client.on('disconnect', function() {
                        $scope.status.isLinkFailed = true;
                    });
                    return client.getConversation($scope.status.roomId);
                })
                .then(function(conversation) {
                    if (conversation) {
                        return conversation;
                    } else {
                        return $scope.status.client.createConversation({
                            name: "chatRoom",
                            members: [],
                        });
                    }
                })
                .then(function(conversation) {
                    $scope.status.roomId = conversation.id;
                    return conversation;
                })
                .then(function(conversation) {
                    $scope.status.members = conversation.members;
                    return conversation;
                })
                .then(function(conversation) {
                    return conversation.join();
                })
                .then(function(conversation) {
                    // 获取聊天历史
                    $scope.status.room = conversation;
                    conversation.queryMessages({
                        limit: 50,
                    }).then(function(messages) {
                    var newMessages=new Array();
                   for(var i=0, len=messages.length; i<len; i++){
                        var message=messages[i];
                       handleName(message);
                       newMessages.unshift(message);
                    }
                        $scope.status.historys = newMessages;
                    });
                    conversation.on('message', function(message) {
                        $timeout(function() {
                           handleName(message);
                            $scope.status.historys.unshift(message);
                        });
                    });
                    //发送游客登录时未发送的消息
                      if(moblie.isNeedSendMessage()){
                             var msg= moblie.getNeedSendMessage();
                             $scope.status.msg=msg;
                             sendMsg();
                             moblie.messageHaveSend();
                              moblie.alert("评论成功");
                       }
                });
        }


        function handleName(message){
               var from=message.from;
                 var index=from.indexOf("#");
                      if(index!=-1){
                        from=from.substr(index+1);
                     }
                      message.from=from;
                    //  return message;
        }
        /**
         * [sendMsg description] 发送消息
         * @return {[type]} [description]
         */
        function sendMsg() {
        if(!moblie.isLogin()){
              moblie.saveMessage($scope.status.msg);
              moblie.alert("请登录");
              moblie.moveToLogin();
              return;
         }
            $scope.status.room.send(new AV.TextMessage($scope.status.msg)).then(function(message) {
                $timeout(function() {
                    message.from="自己";
                    $scope.status.historys.unshift(message);
                });
                $scope.status.msg = '';
            });
        }

        /**
         * [linkToServer description] 连接到服务器
         * @return {[type]} [description]
         */
        $scope.linkToServer = function() {
            initChatroom();
        };

        /**
         * [sendMessage description] 发送消息
         * @return {[type]} [description]
         */
        $scope.sendMessage = function(e) {
            if ((angular.isDefined(e) && e.keyCode == 13) || angular.isUndefined(e)) {
                sendMsg();
            }
        };

        /**
         * [setVideoScale description] 根据16/9的比例设置视频高度
         */
        function setVideoScale() {
            var cw = document.documentElement.clientWidth;
            var scale = 16 / 9;
            var vh = cw / scale;
            var video = document.getElementById("player");
            video.style.height = vh + "px";
        }

        /**
         * [setChatroomHeight description] 设置聊天室的高度(为了移动端一屏展示)
         */
        function setChatroomHeight() {
            var video = document.getElementById("player");
            var chatroomHeader = document.getElementById("chatroomHeader");
            var chatroom = document.getElementById("chatroom");
            var sendBox = document.getElementById("sendBox");
            var ch = document.documentElement.clientHeight;
            var vh = getStyle(video).height;
            var crheader = getStyle(chatroomHeader).height;
            var sbh = getStyle(sendBox).height;
            var crh = parseInt(ch) - parseInt(vh) - parseInt(crheader) - parseInt(sbh);
            if (crh < 1) {
                crh = crh + 500;
            }
            console.log(crh);
            chatroom.style.height = crh + "px";
            chatroom.style.marginBottom = sbh;

        }

        function getStyle(ele) {
            var style = null;
            if (window.getComputedStyle) {
                style = window.getComputedStyle(ele, null);
            } else {
                style = ele.currentStyle;
            }
            return style;
        }

        window.onresize = function() {
            setVideoScale();
            setChatroomHeight();
        };


    }]);
  }
