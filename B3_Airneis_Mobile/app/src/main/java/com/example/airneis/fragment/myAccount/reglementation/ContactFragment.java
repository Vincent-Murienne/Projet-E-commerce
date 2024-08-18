package com.example.airneis.fragment.myAccount.reglementation;

import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;


import com.example.airneis.R;
import com.example.airneis.manager.APIManager;
import com.example.airneis.utils.RegexUtils;

import org.json.JSONException;
import org.json.JSONObject;

public class ContactFragment extends Fragment {

    private EditText etEmail, etSubject, etMessage;
    private Button submitBtn;
    private APIManager apiManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_contact, container, false);

        etEmail = view.findViewById(R.id.email);
        submitBtn = view.findViewById(R.id.submitBtn);
        etSubject = view.findViewById(R.id.subject);
        etMessage = view.findViewById(R.id.message);
        apiManager = new APIManager(getContext());

        if (submitBtn != null) {
            Log.d("debug", "Button found");
        } else {
            Log.d("debug", "Button not found");
        }

        submitBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.d("debug","test");
                handleSubmit();
            }
        });

        return view;
    }

    private void handleSubmit() {
        String email = etEmail.getText().toString().trim();
        String subject = etSubject.getText().toString().trim();
        String message = etMessage.getText().toString().trim();


        if (!RegexUtils.isValidEmail(email)) {
            etEmail.setError("Email est requis");
            return;
        }
        if (TextUtils.isEmpty(subject)) {
            etSubject.setError("Sujet est requis");
            return;
        }
        if (TextUtils.isEmpty(message)) {
            etMessage.setError("Message est requis");
            return;
        }

        try {
            JSONObject data = new JSONObject();
            data.put("email", email);
            data.put("subject", subject);
            data.put("message", message);

            apiManager.apiCall("reglementation", "sendContact", data, new APIManager.VolleyResponseListener() {
                @Override
                public void onError(String message) {
                    Toast.makeText(getContext(), "Un e-mail a bien été envoyé.", Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onResponse(JSONObject response) {
                    Toast.makeText(getContext(), "Un e-mail a bien été envoyé.", Toast.LENGTH_SHORT).show();
                }
            });
        } catch (JSONException e) {
            e.printStackTrace();
            Toast.makeText(getContext(), "Une erreur est survenue.", Toast.LENGTH_SHORT).show();
        }
    }
}
