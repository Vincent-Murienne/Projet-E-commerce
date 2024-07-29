package com.example.airneis.fragment;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.example.airneis.R;
import com.example.airneis.manager.APIManager;

import org.json.JSONException;
import org.json.JSONObject;

public class LoginFragment extends Fragment {

    private APIManager apiManager;
    private EditText emailField;
    private EditText passwordField;
    private TextView errorMessage;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_login, container, false);

        apiManager = new APIManager(getActivity().getApplicationContext());

        emailField = view.findViewById(R.id.email);
        passwordField = view.findViewById(R.id.password);
        errorMessage = view.findViewById(R.id.error_message);
        Button submitButton = view.findViewById(R.id.submit);

        submitButton.setOnClickListener(v -> handleLogin());

        TextView forgotPasswordLink = view.findViewById(R.id.forgot_password);
        forgotPasswordLink.setOnClickListener(v -> {
            // Navigate to forgot password page
            ForgetPasswordFragment forgetPasswordFragment = new ForgetPasswordFragment();
            FragmentTransaction transaction =  getActivity().getSupportFragmentManager().beginTransaction();
            transaction.replace(R.id.frameLayout, forgetPasswordFragment);
            transaction.addToBackStack(null);
            transaction.commit();
        });

        TextView registerLink = view.findViewById(R.id.register);
        registerLink.setOnClickListener(v -> {
            // Navigate to register page
            RegisterFragment registerFragment = new RegisterFragment();
            FragmentTransaction transaction =  getActivity().getSupportFragmentManager().beginTransaction();
            transaction.replace(R.id.frameLayout, registerFragment);
            transaction.addToBackStack(null);
            transaction.commit();
        });

        return view;
    }

    private void handleLogin() {
        String email = emailField.getText().toString().trim();
        String password = passwordField.getText().toString().trim();

        if (TextUtils.isEmpty(email)) {
            emailField.setError("Email is required");
            return;
        }

        if (TextUtils.isEmpty(password)) {
            passwordField.setError("Password is required");
            return;
        }

        errorMessage.setVisibility(View.GONE);

        JSONObject data = new JSONObject();
        try {
            data.put("email", email);
            data.put("password", password);

            apiManager.apiCall("loginRegister", "login", data, new APIManager.VolleyResponseListener() {
                @Override
                public void onError(String message) {
                    errorMessage.setText(message);
                    errorMessage.setVisibility(View.VISIBLE);
                }
                @Override
                public void onResponse(JSONObject response) {
                    try {
                        if (response.getBoolean("success")) {
                            // Save login state
                            SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
                            SharedPreferences.Editor editor = sharedPref.edit();
                            editor.putBoolean("isLoggedIn", true);
                            editor.apply();

                            // Navigate to HomeFragment
                            Fragment homeFragment = new SliderFragment();
                            FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
                            transaction.replace(R.id.frameLayout, homeFragment);
                            transaction.addToBackStack(null);
                            transaction.commit();

                            // Show success message
                            Toast.makeText(getActivity(), "Connexion réussi", Toast.LENGTH_SHORT).show();
                        } else {
                            errorMessage.setText(response.getString("error"));
                            errorMessage.setVisibility(View.VISIBLE);
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                        errorMessage.setText("An error occurred");
                        errorMessage.setVisibility(View.VISIBLE);
                    }
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
