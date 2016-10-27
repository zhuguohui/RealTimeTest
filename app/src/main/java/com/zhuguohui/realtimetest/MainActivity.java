package com.zhuguohui.realtimetest;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.Toast;

import java.util.Random;

public class MainActivity extends AppCompatActivity {
    WebView webView;
    public static boolean isLogin = false;
    public static String clientID = "";
    public boolean needLogin = false;
    private static boolean isTouristMode = true;
    public static String TouristID;
    public boolean isNeedSendMessage=false;
    public String needSendMessage="";
    //初始化游客ID
    static {
        Random random = new Random();
        long l1 = random.nextLong();
        long l2 = random.nextLong();
        TouristID = "youke" + l1 + ":" + l2;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        webView = (WebView) findViewById(R.id.webview);
        webView.getSettings().setJavaScriptEnabled(true);

        webView.addJavascriptInterface(new Mobile(), "moblie");
        webView.loadUrl("file:///android_asset/realtime.html");

    }

    @Override
    protected void onResume() {
        super.onResume();
        if (needLogin) {
            webView.reload();
            needLogin = false;
        }
    }

    class Mobile {

        //保存聊天信息
        @JavascriptInterface
        public void saveMessage(String msg){
            Log.i("zzz","saveMessage() msg="+msg);
            isNeedSendMessage=true;
            needSendMessage=msg;
        }

        //是否需要发送缓存的聊天信息
        @JavascriptInterface
        public boolean isNeedSendMessage(){
         //   Log.i("zzz","isNeedSendMessage() isNeedSendMessage="+isNeedSendMessage);
            return isNeedSendMessage;
        }

        //获取缓存的聊天信息
        @JavascriptInterface
        public String getNeedSendMessage(){
         //   Log.i("zzz","getNeedSendMessage()");
            return needSendMessage;
        }

        //消失已经发送，重置状态
        @JavascriptInterface
        public void  messageHaveSend(){
        //    Log.i("zzz","messageHaveSend()");
            isNeedSendMessage=false;
            needSendMessage="";
        }

        //是否是游客模式
        @JavascriptInterface
        public boolean isTouristMode() {
            return !isLogin();
        }

        //获取游客ID
        @JavascriptInterface
        public String getTouristID() {
            return TouristID;
        }

        //是否已经登录
        @JavascriptInterface
        public boolean isLogin() {
            return isLogin;
        }

        //获取客户端ID
        @JavascriptInterface
        public String getClientID() {
            return clientID;
        }

        //弹出警告
        @JavascriptInterface
        public void alert(String msg) {
            Toast.makeText(MainActivity.this, msg, Toast.LENGTH_SHORT).show();
        }

        //跳转到登录
        @JavascriptInterface
        public void moveToLogin() {
            //表示需要登录
            needLogin = true;
            startActivity(new Intent(MainActivity.this, LoginActivity.class));
        }
    }
}
