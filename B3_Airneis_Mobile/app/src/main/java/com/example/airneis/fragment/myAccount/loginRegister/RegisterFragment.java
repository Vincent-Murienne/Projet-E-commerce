package com.example.airneis.fragment.myAccount.loginRegister;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.example.airneis.R;
import com.example.airneis.fragment.homePage.HomeFragment;
import com.example.airneis.fragment.homePage.SliderFragment;
import com.example.airneis.fragment.myAccount.loginRegister.LoginFragment;
import com.example.airneis.manager.APIManager;
import com.example.airneis.utils.RegexUtils;

import org.json.JSONException;
import org.json.JSONObject;

public class RegisterFragment extends Fragment {

    private APIManager apiManager;
    private EditText fullNameEditText, emailEditText, passwordEditText;
    private CheckBox mentionsLegalCheckBox;
    private Button registerButton;
    private boolean isPasswordVisible = false;

    private static final String TAG = "RegisterFragment";

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_register, container, false);

        apiManager = new APIManager(getActivity().getApplicationContext());

        fullNameEditText = view.findViewById(R.id.fullNameEditText);
        emailEditText = view.findViewById(R.id.emailEditText);
        passwordEditText = view.findViewById(R.id.passwordEditText);
        mentionsLegalCheckBox = view.findViewById(R.id.mentionsLegalCheckBox);
        registerButton = view.findViewById(R.id.registerButton);

        registerButton.setOnClickListener(v -> handleRegister(view));

        passwordEditText.setOnTouchListener((v, event) -> {
            if (event.getAction() == MotionEvent.ACTION_UP) {
                if (event.getRawX() >= (passwordEditText.getRight() - passwordEditText.getCompoundDrawables()[2].getBounds().width())) {
                    togglePasswordVisibility();
                    return true;
                }
            }
            return false;
        });

        TextView loginLink = view.findViewById(R.id.login);
        loginLink.setOnClickListener(v -> {
            // Navigate to register page
            LoginFragment loginFragment = new LoginFragment();
            FragmentTransaction transaction =  getActivity().getSupportFragmentManager().beginTransaction();
            transaction.replace(R.id.frameLayout, loginFragment);
            transaction.addToBackStack(null);
            transaction.commit();
        });

        fullNameEditText.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
            }

            @Override
            public void afterTextChanged(Editable s) {
                String upperCaseText = s.toString().toUpperCase();
                if (!upperCaseText.equals(s.toString())) {
                    fullNameEditText.removeTextChangedListener(this);
                    fullNameEditText.setText(upperCaseText);
                    fullNameEditText.setSelection(upperCaseText.length());
                    fullNameEditText.addTextChangedListener(this);
                }
            }
        });

        return view;
    }


    private void togglePasswordVisibility() {
        if (isPasswordVisible) {
            // Hide password
            passwordEditText.setTransformationMethod(PasswordTransformationMethod.getInstance());
            passwordEditText.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_lock, 0, R.drawable.ic_eye, 0);
        } else {
            // Show password
            passwordEditText.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
            passwordEditText.setCompoundDrawablesWithIntrinsicBounds(R.drawable.ic_lock, 0, R.drawable.ic_eye_slash, 0);
        }
        isPasswordVisible = !isPasswordVisible;
        passwordEditText.setSelection(passwordEditText.getText().length());
    }

    private void handleRegister(View view) {
        String fullName = fullNameEditText.getText().toString().trim().toUpperCase();
        String email = emailEditText.getText().toString().trim();
        String password = passwordEditText.getText().toString().trim();
        boolean isChecked = mentionsLegalCheckBox.isChecked();

        Log.d(TAG, "Full Name: " + fullName);
        Log.d(TAG, "Email: " + email);
        Log.d(TAG, "Password: " + password);
        Log.d(TAG, "Legal Mentions Checked: " + isChecked);

        if (TextUtils.isEmpty(fullName)) {
            fullNameEditText.setError("Nom complet est requis");
            return;
        } else if (!RegexUtils.isValidFullName(fullName)) {
            fullNameEditText.setError("Veuillez saisir un nom complet (5 caractères minimum)");
            return;
        }

        if (TextUtils.isEmpty(email)) {
            emailEditText.setError("Email est requis");
            return;
        } else if (!RegexUtils.isValidEmail(email)) {
            emailEditText.setError("Veuillez saisir une adresse e-mail valide");
            return;
        }

        if (TextUtils.isEmpty(password)) {
            passwordEditText.setError("Mot de passe est requis");
            return;
        } else if (!RegexUtils.isValidPassword(password)) {
            passwordEditText.setError("Le mot de passe doit comporter au moins 12 caractères alphanumériques");
            return;
        }

        if (!isChecked) {
            Toast.makeText(getContext(), "Veuillez lire et accepter les mentions légales.", Toast.LENGTH_SHORT).show();
            return;
        }

        JSONObject data = new JSONObject();
        try {
            data.put("full_name", fullName);
            data.put("email", email);
            data.put("password", password);

            apiManager.apiCall("loginRegister", "register", data, new APIManager.VolleyResponseListener() {
                @Override
                public void onError(String message) {
                    Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onResponse(JSONObject response) {
                    try {
                        if (response.getBoolean("success")) {
                            JSONObject user = response.getJSONObject("user");

                            // Save login state
                            SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
                            SharedPreferences.Editor editor = sharedPref.edit();
                            editor.putBoolean("isConnected", true);
                            editor.putInt("userId", user.getInt("id"));
                            editor.apply();

                            // Navigate to HomeFragment
                            Fragment homeFragment = new HomeFragment();
                            FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
                            transaction.replace(R.id.frameLayout, homeFragment);
                            transaction.addToBackStack(null);
                            transaction.commit();

                            Toast.makeText(getContext(), "Inscription réussie !", Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                        Toast.makeText(getContext(), "Une erreur s'est produite", Toast.LENGTH_SHORT).show();
                    }
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
            Toast.makeText(getContext(), "Une erreur s'est produite", Toast.LENGTH_SHORT).show();
        }
    }
}
