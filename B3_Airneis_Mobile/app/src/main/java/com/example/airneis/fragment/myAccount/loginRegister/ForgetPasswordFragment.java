package com.example.airneis.fragment.myAccount.loginRegister;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.example.airneis.R;
import com.example.airneis.fragment.myAccount.loginRegister.LoginFragment;
import com.example.airneis.manager.APIManager;

import org.json.JSONException;
import org.json.JSONObject;

public class ForgetPasswordFragment extends Fragment {

    private EditText etEmail;
    private Button btnSendResetEmail;
    private APIManager apiManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_forget_password, container, false);

        etEmail = view.findViewById(R.id.etEmail);
        btnSendResetEmail = view.findViewById(R.id.btnSendResetEmail);
        apiManager = new APIManager(getActivity().getApplicationContext());

        btnSendResetEmail.setOnClickListener(v -> handleSubmit(view));

        return view;
    }

    private void handleSubmit(View view) {
        String email = etEmail.getText().toString().trim();

        if (TextUtils.isEmpty(email)) {
            etEmail.setError("Email est requis");
            return;
        }

        try {
            JSONObject data = new JSONObject();
            data.put("email", email);

            apiManager.apiCall("loginRegister", "forgetPassword", data, new APIManager.VolleyResponseListener() {
                @Override
                public void onError(String message) {
                    Toast.makeText(getContext(), "Une erreur est survenue.", Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onResponse(JSONObject response) {
                    try {
                        if (response.getBoolean("success")) {
                            Toast.makeText(getContext(), "Un e-mail de réinitialisation a été envoyé.", Toast.LENGTH_SHORT).show();
                            LoginFragment loginFragment = new LoginFragment();
                            FragmentTransaction transaction =  getActivity().getSupportFragmentManager().beginTransaction();
                            transaction.replace(R.id.frameLayout, loginFragment);
                            transaction.addToBackStack(null);
                            transaction.commit();
                        } else {
                            Toast.makeText(getContext(), "Un e-mail de réinitialisation a été envoyé.", Toast.LENGTH_SHORT).show();
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                        Toast.makeText(getContext(), "Une erreur est survenue.", Toast.LENGTH_SHORT).show();
                    }
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
            Toast.makeText(getContext(), "Une erreur est survenue.", Toast.LENGTH_SHORT).show();
        }
    }
}
