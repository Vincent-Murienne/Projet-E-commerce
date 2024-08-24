package com.example.airneis.fragment.myAccount;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.example.airneis.R;
import com.example.airneis.manager.APIManager;
import com.example.airneis.utils.RegexUtils;

import org.json.JSONException;
import org.json.JSONObject;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class EditAccountFragment extends Fragment {
    private TextView tvOldPassword, tvNewPassword;
    private EditText fullNameEt, emailEt, oldPasswordEt, newPasswordEt;
    private CheckBox changePasswordCheckBox;
    private Button backButton, validateButton;
    private APIManager apiManager;
    private int userId;
    private String currentUserPassword;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = (View) inflater.inflate(R.layout.fragment_edit_account, container, false);

        fullNameEt = view.findViewById(R.id.editTextFullName);
        emailEt = view.findViewById(R.id.editTextEmail);
        changePasswordCheckBox = view.findViewById(R.id.cb_change_password);
        oldPasswordEt = view.findViewById(R.id.et_old_password);
        tvOldPassword = view.findViewById(R.id.tvOldPassword);
        newPasswordEt = view.findViewById(R.id.et_new_password);
        tvNewPassword = view.findViewById(R.id.tvNewPassword);
        backButton = view.findViewById(R.id.backButton);
        validateButton = view.findViewById(R.id.validateButton);

        apiManager = new APIManager(getContext());

        // Set userId from the phone preferences
        SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        userId = sharedPref.getInt("userId", -1);

        getAccountData();

        changePasswordCheckBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                if(isChecked) {
                    tvOldPassword.setVisibility(View.VISIBLE);
                    oldPasswordEt.setVisibility(View.VISIBLE);
                    oldPasswordEt.setText("");
                    tvNewPassword.setVisibility(View.VISIBLE);
                    newPasswordEt.setVisibility(View.VISIBLE);
                    newPasswordEt.setText("");
                } else {
                    tvOldPassword.setVisibility(View.GONE);
                    oldPasswordEt.setVisibility(View.GONE);
                    tvNewPassword.setVisibility(View.GONE);
                    newPasswordEt.setVisibility(View.GONE);
                }
            }
        });

        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Navigate to ParametreCompteFragment
                Fragment parametreCompteFragment = new ParametreCompteFragment();
                FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
                transaction.replace(R.id.frameLayout, parametreCompteFragment);
                transaction.addToBackStack(null);
                transaction.commit();
            }
        });

        validateButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                handleSubmit();
            }
        });

        return view;
    }

    private void getAccountData() {
        JSONObject data = new JSONObject();
        try {
            data.put("table", "users");
            data.put("id", userId);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        APIManager.VolleyResponseListener listener = new APIManager.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Log.e("API Error", message);
            }

            @Override
            public void onResponse(JSONObject response) {
                try {
                    Log.d("debug", response.toString());
                    if (response.getBoolean("success")) {
                        fullNameEt.setText(response.getJSONObject("data").getString("full_name"));
                        emailEt.setText(response.getJSONObject("data").getString("email"));
                        currentUserPassword = response.getJSONObject("data").getString("password");
                    } else {
                        Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        try {
            apiManager.apiCall("panelAdmin", "getUserInfo", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }

    private void handleSubmit() {
        if(!RegexUtils.isValidFullName(fullNameEt.getText().toString())) {
            fullNameEt.setError("Veuillez entrer un nom complet correct (Minimum 5 caractères)");
            return;
        }

        if(!RegexUtils.isValidEmail(emailEt.getText().toString())) {
            emailEt.setError("Veuillez entrer un email valide");
            return;
        }

        JSONObject data = new JSONObject();
        JSONObject dataChanged = new JSONObject();

        if(changePasswordCheckBox.isChecked()) {
            Log.d("oldPassword", oldPasswordEt.getText().toString());
            String oldPassword = encryptSHA512(oldPasswordEt.getText().toString());
            Log.d("oldPasswordHashed", oldPassword);
            Log.d("currentPassword", currentUserPassword);
            if(oldPassword.equals(currentUserPassword)) {
                if(!RegexUtils.isValidPassword(newPasswordEt.getText().toString())) {
                    newPasswordEt.setError("Le nouveau mot de passe ne respecte pas notre politique de mot de passe (12 caractères min, 1 Maj, 1 min, 1 chiffre)");
                    return;
                }
                try {
                    data.put("table", "users");
                    data.put("id", userId);
                    dataChanged.put("full_name", fullNameEt.getText().toString());
                    dataChanged.put("email", emailEt.getText().toString());
                    dataChanged.put("password", encryptSHA512(newPasswordEt.getText().toString()));
                    data.put("data", dataChanged);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            } else {
                oldPasswordEt.setError("L'ancien mot de passe est incorrect");
                return;
            }
        } else {
            try {
                data.put("table", "users");
                data.put("id", userId);
                dataChanged.put("full_name", fullNameEt.getText().toString());
                dataChanged.put("email", emailEt.getText().toString());
                data.put("data", dataChanged);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        APIManager.VolleyResponseListener listener = new APIManager.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Log.e("API Error", message);
            }

            @Override
            public void onResponse(JSONObject response) {
                try {
                    Log.d("debug", response.toString());
                    if (response.getBoolean("success")) {
                        Toast.makeText(getContext(), "Les modifications ont bien été prises en compte.", Toast.LENGTH_SHORT).show();

                        // Navigate to ParametreCompteFragment
                        Fragment parametreCompteFragment = new ParametreCompteFragment();
                        FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
                        transaction.replace(R.id.frameLayout, parametreCompteFragment);
                        transaction.addToBackStack(null);
                        transaction.commit();
                    } else {
                        Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        try {
            apiManager.apiCall("panelAdmin", "updateUser", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }

    public static String encryptSHA512(String input)
    {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");

            byte[] messageDigest = md.digest(input.getBytes());

            BigInteger no = new BigInteger(1, messageDigest);

            String hashtext = no.toString(16);

            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }

            return hashtext;
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}