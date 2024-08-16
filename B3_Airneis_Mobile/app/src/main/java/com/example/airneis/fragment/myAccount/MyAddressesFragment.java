package com.example.airneis.fragment.myAccount;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.example.airneis.R;
import com.example.airneis.fragment.basket.BasketFragment;
import com.example.airneis.fragment.checkout.CheckoutPaymentFragment;
import com.example.airneis.manager.APIManager;
import com.example.airneis.model.AddressModel;
import com.example.airneis.utils.RegexUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class MyAddressesFragment extends Fragment {
    private APIManager apiManager;
    private int userId;
    private EditText addressNameEt, firstNameEt, lastNameEt, addressEt, zipCodeEt, cityEt, regionEt, countryEt, phoneEt;
    private TextView addressNameError, firstNameError, lastNameError, addressError, zipCodeError, cityError, regionError, countryError, phoneError;
    private Spinner addressesSpinner;
    private Button validateButton, backButton, deleteButton;
    private ArrayList<AddressModel> addressModelList;
    private AddressModel emptyAddress, currentAddress;
    private String[] spinnerAddresses;
    private AddressModel[] spinnerAddressesModel;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_adresses, container, false);

        apiManager = new APIManager(getContext());

        addressNameEt = view.findViewById(R.id.editTextAddressName);
        firstNameEt = view.findViewById(R.id.editTextFirstName);
        lastNameEt = view.findViewById(R.id.editTextLastName);
        addressEt = view.findViewById(R.id.editTextAddress);
        cityEt = view.findViewById(R.id.editTextCity);
        zipCodeEt = view.findViewById(R.id.editTextZipCode);
        regionEt = view.findViewById(R.id.editTextRegion);
        countryEt = view.findViewById(R.id.editTextCountry);
        phoneEt = view.findViewById(R.id.editTextPhone);
        addressNameError = view.findViewById(R.id.AddressNameError);
        firstNameError = view.findViewById(R.id.FirstNameError);
        lastNameError = view.findViewById(R.id.LastNameError);
        addressError = view.findViewById(R.id.AddressError);
        cityError = view.findViewById(R.id.CityError);
        zipCodeError = view.findViewById(R.id.ZipCodeError);
        regionError = view.findViewById(R.id.RegionError);
        countryError = view.findViewById(R.id.CountryError);
        phoneError = view.findViewById(R.id.PhoneError);
        addressesSpinner = view.findViewById(R.id.spinner_addresses);
        validateButton = view.findViewById(R.id.validateButton);
        backButton = view.findViewById(R.id.backButton);
        deleteButton = view.findViewById(R.id.deleteButton);
        addressesSpinner = view.findViewById(R.id.spinner_addresses);

        initializeEditText();

        validateButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                validateForm();
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

        deleteButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                AlertDialog.Builder alert = new AlertDialog.Builder(getContext());
                alert.setTitle("Suppression de cette adresse");
                alert.setMessage("Êtes-vous sûr de vouloir supprimer cette adresse ?");
                alert.setPositiveButton("Oui", new DialogInterface.OnClickListener() {

                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        if(currentAddress.getAddressId() != -1) {
                            JSONObject data = new JSONObject();
                            try {
                                data.put("id", currentAddress.getAddressId());
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
                                            Toast.makeText(getContext(), "L'adresse a bien été supprimé !", Toast.LENGTH_SHORT).show();

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
                                apiManager.apiCall("panelAdmin", "deleteAddress", data, listener);
                            } catch (JSONException e) {
                                Log.d("Appel API", e.getMessage());
                                Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(getContext(), "Vous ne pouvez pas supprimer cette adresse.", Toast.LENGTH_SHORT).show();
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
        });

        addressesSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                currentAddress = spinnerAddressesModel[position];
                changeAddress();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        // Set userId from the phone preferences
        SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        userId = sharedPref.getInt("userId", -1);

        emptyAddress = new AddressModel();
        currentAddress = emptyAddress;
        addressModelList = new ArrayList<>();

        getUserAddresses();

        return view;
    }

    private void getUserAddresses() {
        JSONObject data = new JSONObject();
        try {
            data.put("table", "addresses");
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
                        if (!response.getBoolean("AddressDataEmpty")) {
                            JSONArray addresses = response.getJSONArray("data");
                            for (int i = 0; i < addresses.length(); i++) {
                                JSONObject address = addresses.getJSONObject(i);

                                int addressId = address.getInt("id");
                                String addressName = address.getString("address_name");
                                String firstName = address.getString("first_name");
                                String lastName = address.getString("last_name");
                                String addressContent = address.getString("address");
                                String city = address.getString("city");
                                int zipCode = address.getInt("zip_code");
                                String region = address.getString("region");
                                String country = address.getString("city");
                                String phone = address.getString("phone_number");

                                AddressModel tmpAddressModel = new AddressModel(addressId, addressName, firstName, lastName, addressContent, city, zipCode, region, country, phone);
                                addressModelList.add(tmpAddressModel);

                                if(i == 0) {
                                    currentAddress = tmpAddressModel;
                                }

                                createSpinnerList();
                            }
                        }
                    } else {
                        Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        try {
            apiManager.apiCall("panelAdmin", "getUserAddresses", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }

    private void changeAddress() {
        addressNameEt.setText(currentAddress.getAddressName());
        firstNameEt.setText(currentAddress.getFirstName());
        lastNameEt.setText(currentAddress.getLastName());
        addressEt.setText(currentAddress.getAddress());
        cityEt.setText(currentAddress.getCity());
        zipCodeEt.setText(currentAddress.getZipCode() == -1 ? "" : formatZipCode(String.valueOf(currentAddress.getZipCode())));
        regionEt.setText(currentAddress.getRegion());
        countryEt.setText(currentAddress.getCountry());
        phoneEt.setText(currentAddress.getPhone());
    }

    private String formatZipCode(String zipCode) {
        zipCode = "00000" + zipCode;

        return String.valueOf(zipCode.charAt(zipCode.length()-5)) + String.valueOf(zipCode.charAt(zipCode.length()-4)) + String.valueOf(zipCode.charAt(zipCode.length()-3)) + String.valueOf(zipCode.charAt(zipCode.length()-2)) + String.valueOf(zipCode.charAt(zipCode.length()-1));
    }

    private void createSpinnerList() {
        // We initialize the array with the desired size
        spinnerAddresses = new String[addressModelList.size()+1];
        spinnerAddressesModel = new AddressModel[addressModelList.size()+1];

        // We add the default value to the arrays
        spinnerAddresses[0] = "Ajouter une addresse";
        spinnerAddressesModel[0] = emptyAddress;

        // We loop through the addresses to add them to the array
        int index = 1;
        for(AddressModel address : addressModelList) {
            spinnerAddresses[index] = address.getAddressName();
            spinnerAddressesModel[index] = address;
            index++;
        }

        // Create the adapter, set it to the spinner and set the default value of the spinner
        ArrayAdapter<String> adapter = new ArrayAdapter<>(getContext(), android.R.layout.simple_spinner_dropdown_item, spinnerAddresses);
        addressesSpinner.setAdapter(adapter);
        addressesSpinner.setSelection(addressModelList.size());

        changeAddress();
    }

    private void initializeEditText() {
        addressNameEt.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                String text = String.valueOf(addressNameEt.getText());
                if (!RegexUtils.isValidFullName(text)) {
                    addressNameError.setVisibility(View.VISIBLE);
                    addressNameError.setText("Veuillez saisir un nom pour votre adresse valide (5 caractères minimum)");
                } else {
                    addressNameError.setVisibility(View.GONE);
                }
                return false;
            }
        });
        firstNameEt.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                String text = String.valueOf(firstNameEt.getText());
                if (!RegexUtils.isValidFirstName(text)) {
                    firstNameError.setVisibility(View.VISIBLE);
                    firstNameError.setText("Veuillez saisir un prénom valide (3 caractères minimum)");
                } else {
                    firstNameError.setVisibility(View.GONE);
                }
                return false;
            }
        });
        lastNameEt.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                String text = String.valueOf(lastNameEt.getText());
                if (!RegexUtils.isValidFirstName(text)) {
                    lastNameError.setVisibility(View.VISIBLE);
                    lastNameError.setText("Veuillez saisir un nom valide (3 caractères minimum)");
                } else {
                    lastNameError.setVisibility(View.GONE);
                }
                return false;
            }
        });
        addressEt.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                String text = String.valueOf(addressEt.getText());
                if (!RegexUtils.isValidAddress(text)) {
                    addressError.setVisibility(View.VISIBLE);
                    addressError.setText("Veuillez saisir une adresse valide (5 caractères minimum)");
                } else {
                    addressError.setVisibility(View.GONE);
                }
                return false;
            }
        });
        cityEt.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                String text = String.valueOf(cityEt.getText());
                if (!RegexUtils.isValidFirstName(text)) {
                    cityError.setVisibility(View.VISIBLE);
                    cityError.setText("Veuillez saisir une ville valide (3 caractères minimum)");
                } else {
                    cityError.setVisibility(View.GONE);
                }
                return false;
            }
        });
        zipCodeEt.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                String text = String.valueOf(zipCodeEt.getText());
                if (!RegexUtils.isValidZipCode(text)) {
                    zipCodeError.setVisibility(View.VISIBLE);
                    zipCodeError.setText("Veuillez saisir un code postal correct (5 chiffres)");
                } else {
                    zipCodeError.setVisibility(View.GONE);
                }
                return false;
            }
        });
        regionEt.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                String text = String.valueOf(regionEt.getText());
                if (!RegexUtils.isValidFirstName(text)) {
                    regionError.setVisibility(View.VISIBLE);
                    regionError.setText("Veuillez saisir une région valide (3 caractères minimum)");
                } else {
                    regionError.setVisibility(View.GONE);
                }
                return false;
            }
        });
        countryEt.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                String text = String.valueOf(countryEt.getText());
                if (!RegexUtils.isValidFirstName(text)) {
                    countryError.setVisibility(View.VISIBLE);
                    countryError.setText("Veuillez saisir un pays valide (3 caractères minimum)");
                } else {
                    countryError.setVisibility(View.GONE);
                }
                return false;
            }
        });
        phoneEt.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                String text = String.valueOf(phoneEt.getText());
                if (!RegexUtils.isValidPhone(text)) {
                    phoneError.setVisibility(View.VISIBLE);
                    phoneError.setText("Veuillez saisir un numéro de téléphone valide (10 chiffres)");
                } else {
                    phoneError.setVisibility(View.GONE);
                }
                return false;
            }
        });
    }

    private void validateForm() {
        if(currentAddress.getAddressId() == -1) {
            if(RegexUtils.isValidPhone(String.valueOf(phoneEt.getText())) && RegexUtils.isValidFirstName(String.valueOf(countryEt.getText())) && RegexUtils.isValidFirstName(String.valueOf(regionEt.getText())) && RegexUtils.isValidZipCode(String.valueOf(zipCodeEt.getText())) && RegexUtils.isValidFirstName(String.valueOf(cityEt.getText())) && RegexUtils.isValidAddress(String.valueOf(addressEt.getText())) && RegexUtils.isValidFirstName(String.valueOf(lastNameEt.getText())) && RegexUtils.isValidFirstName(String.valueOf(firstNameEt.getText())) && RegexUtils.isValidFullName(String.valueOf(addressNameEt.getText()))) {
                JSONObject data = new JSONObject();
                JSONObject addressData = new JSONObject();
                try {
                    data.put("table", "addresses");
                    addressData.put("user_id", userId);
                    addressData.put("address_name", String.valueOf(addressNameEt.getText()));
                    addressData.put("first_name", String.valueOf(firstNameEt.getText()));
                    addressData.put("last_name", String.valueOf(lastNameEt.getText()));
                    addressData.put("address", String.valueOf(addressEt.getText()));
                    addressData.put("city", String.valueOf(cityEt.getText()));
                    addressData.put("zip_code", String.valueOf(zipCodeEt.getText()));
                    addressData.put("region", String.valueOf(regionEt.getText()));
                    addressData.put("country", String.valueOf(countryEt.getText()));
                    addressData.put("phone_number", String.valueOf(phoneEt.getText()));
                    data.put("data", addressData);
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
                                Toast.makeText(getContext(), "Votre adresse a bien été enregistré !", Toast.LENGTH_SHORT).show();

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
                    apiManager.apiCall("panelAdmin", "insertAddress", data, listener);
                } catch (JSONException e) {
                    Log.d("Appel API", e.getMessage());
                    Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
                }
            } else {
                Toast.makeText(getContext(), "Veuillez remplir tous les champs avant de valider !", Toast.LENGTH_SHORT).show();
            }
        } else {
            if(RegexUtils.isValidPhone(String.valueOf(phoneEt.getText())) && RegexUtils.isValidFirstName(String.valueOf(countryEt.getText())) && RegexUtils.isValidFirstName(String.valueOf(regionEt.getText())) && RegexUtils.isValidZipCode(String.valueOf(zipCodeEt.getText())) && RegexUtils.isValidFirstName(String.valueOf(cityEt.getText())) && RegexUtils.isValidAddress(String.valueOf(addressEt.getText())) && RegexUtils.isValidFirstName(String.valueOf(lastNameEt.getText())) && RegexUtils.isValidFirstName(String.valueOf(firstNameEt.getText())) && RegexUtils.isValidFullName(String.valueOf(addressNameEt.getText()))) {
                JSONObject data = new JSONObject();
                JSONObject addressData = new JSONObject();
                try {
                    data.put("table", "addresses");
                    data.put("id", currentAddress.getAddressId());
                    addressData.put("address_name", String.valueOf(addressNameEt.getText()));
                    addressData.put("first_name", String.valueOf(firstNameEt.getText()));
                    addressData.put("last_name", String.valueOf(lastNameEt.getText()));
                    addressData.put("address", String.valueOf(addressEt.getText()));
                    addressData.put("city", String.valueOf(cityEt.getText()));
                    addressData.put("zip_code", String.valueOf(zipCodeEt.getText()));
                    addressData.put("region", String.valueOf(regionEt.getText()));
                    addressData.put("country", String.valueOf(countryEt.getText()));
                    addressData.put("phone_number", String.valueOf(phoneEt.getText()));
                    data.put("data", addressData);
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
                                Toast.makeText(getContext(), "Votre adresse a bien été modifié !", Toast.LENGTH_SHORT).show();

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
                    apiManager.apiCall("panelAdmin", "updateAddress", data, listener);
                } catch (JSONException e) {
                    Log.d("Appel API", e.getMessage());
                    Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
                }
            } else {
                Toast.makeText(getContext(), "Veuillez remplir tous les champs avant de valider !", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
