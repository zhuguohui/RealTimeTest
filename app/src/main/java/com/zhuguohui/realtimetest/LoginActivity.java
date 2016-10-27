package com.zhuguohui.realtimetest;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

public class LoginActivity extends AppCompatActivity {

    EditText et_name;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        et_name = (EditText) findViewById(R.id.et_name);
    }

    public void login(View view) {
        String name = et_name.getText().toString();
        MainActivity.isLogin = true;
        MainActivity.clientID = name;
        Toast.makeText(this, "登录成功", Toast.LENGTH_SHORT).show();
        finish();
    }
}
