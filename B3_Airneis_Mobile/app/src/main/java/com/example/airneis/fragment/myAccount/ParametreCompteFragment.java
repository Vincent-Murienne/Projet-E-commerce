package com.example.airneis.fragment.myAccount;

import android.Manifest;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import android.os.Environment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.airneis.R;
import com.example.airneis.fragment.homePage.HomeFragment;
import com.example.airneis.manager.APIManager;
import com.opencsv.CSVWriter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class ParametreCompteFragment extends Fragment {
    private Button seeMyAddressesButton, downloadPersonnalDataButton, ModifyPersonnalDataButton, deleteAccountButton;
    private EditText editTextUserName, editTextUserEmail;
    private APIManager apiManager;
    private int userId;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = (View) inflater.inflate(R.layout.fragment_parametre_compte, container, false);

        editTextUserName = view.findViewById(R.id.editTextUserName);
        editTextUserEmail = view.findViewById(R.id.editTextUserEmail);
        seeMyAddressesButton = view.findViewById(R.id.seeMyAddressesButton);
        downloadPersonnalDataButton = view.findViewById(R.id.downloadPersonnalDataButton);
        ModifyPersonnalDataButton = view.findViewById(R.id.ModifyPersonnalDataButton);
        deleteAccountButton = view.findViewById(R.id.deleteAccountButton);

        seeMyAddressesButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Navigate to MyAddressesFragment
                Fragment myAddressesFragment = new MyAddressesFragment();
                FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
                transaction.replace(R.id.frameLayout, myAddressesFragment);
                transaction.addToBackStack(null);
                transaction.commit();
            }
        });

        downloadPersonnalDataButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                downloadPersonnalData();
            }
        });

        ModifyPersonnalDataButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Navigate to EditAccountFragment
                Fragment editAccountFragment = new EditAccountFragment();
                FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
                transaction.replace(R.id.frameLayout, editAccountFragment);
                transaction.addToBackStack(null);
                transaction.commit();
            }
        });

        deleteAccountButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                deleteAccount();
            }
        });

        apiManager = new APIManager(getContext());

        // Set userId from the phone preferences
        SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        userId = sharedPref.getInt("userId", -1);

        getAccountData();

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
                    if (response.getBoolean("success")) {
                        editTextUserName.setText(response.getJSONObject("data").getString("full_name"));
                        editTextUserEmail.setText(response.getJSONObject("data").getString("email"));
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

    private void deleteAccount() {
        AlertDialog.Builder alert = new AlertDialog.Builder(getContext());
        alert.setTitle("Supprimer votre compte");
        alert.setMessage("Êtes-vous sûr de vouloir supprimer votre compte ?");
        alert.setPositiveButton("Oui", new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int which) {
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
                            if (response.getBoolean("success")) {
                                Toast.makeText(getContext(), "Votre compte a bien été supprimé", Toast.LENGTH_SHORT).show();

                                // Disconnect user from app
                                SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
                                SharedPreferences.Editor editor = sharedPref.edit();
                                editor.putBoolean("isConnected", false);
                                editor.apply();

                                // Redirect him
                                Fragment homeFragment = new HomeFragment();
                                FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
                                transaction.replace(R.id.frameLayout, homeFragment);
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
                    apiManager.apiCall("panelAdmin", "deleteUser", data, listener);
                } catch (JSONException e) {
                    Log.d("Appel API", e.getMessage());
                    Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
                }

                dialog.dismiss();
            }
        });

        alert.setNegativeButton("Non", new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int which) {
                dialog.dismiss();
            }
        });

        alert.show();
    }

    private void downloadPersonnalData() {
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
                    if (response.getBoolean("success")) {
                        Log.d("debug", response.getJSONArray("data").toString());
                        saveCsv(response.getJSONArray("data"));
                    } else {
                        Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException | IOException e) {
                    e.printStackTrace();
                }
            }
        };

        try {
            apiManager.apiCall("monCompte", "downloadPersonalData", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }

    private void saveCsv(JSONArray data) throws IOException, JSONException {
        // Accéder au dossier "Documents" du stockage externe
        File externalDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);

        if (externalDir != null && !externalDir.exists()) {
            externalDir.mkdirs();
        }

        File file = new File(externalDir, "personnalDataAirneis.csv");
        if (!file.exists()) {
            file.createNewFile();
        }

        CSVWriter writer = new CSVWriter(new FileWriter(file), ',', '"');
        for (int i = 0; i < data.length(); i++) {
            JSONObject line = data.getJSONObject(i);

            String[] outputLine = new String[line.length()];
            outputLine[0] = '"' + line.getString("full_name") + "\",";
            outputLine[1] = '"' + line.getString("email") + "\",";
            outputLine[2] = '"' + line.getString("address_name") + "\",";
            outputLine[3] = '"' + line.getString("first_name") + "\",";
            outputLine[4] = '"' + line.getString("last_name") + "\",";
            outputLine[5] = '"' + line.getString("address") + "\",";
            outputLine[6] = '"' + line.getString("city") + "\",";
            outputLine[7] = '"' + line.getString("zip_code") + "\",";
            outputLine[8] = '"' + line.getString("region") + "\",";
            outputLine[9] = '"' + line.getString("country") + "\",";
            outputLine[10] = '"' + line.getString("phone_number") + "\",";

            writer.writeNext(outputLine);
        }
        writer.close();

        Toast.makeText(getContext(), "Vos données personnelles ont bien été enregistrées dans votre dossier 'Downloads'.", Toast.LENGTH_SHORT).show();
    }
}