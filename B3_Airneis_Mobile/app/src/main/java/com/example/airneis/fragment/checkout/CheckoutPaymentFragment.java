package com.example.airneis.fragment.checkout;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.example.airneis.R;
import com.example.airneis.fragment.basket.BasketFragment;
import com.example.airneis.fragment.categories.CategoryDetailFragment;
import com.example.airneis.manager.APIManager;
import com.example.airneis.model.AddressModel;
import com.stripe.android.ApiResultCallback;
import com.stripe.android.Stripe;
import com.stripe.android.model.Token;
import com.stripe.android.view.CardInputWidget;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.DecimalFormat;
import java.util.Objects;

import okhttp3.OkHttpClient;

public class CheckoutPaymentFragment extends Fragment {
    private static final String STRIPE_PUBLISHABLE_KEY = "pk_test_51PdxlIRplliLoCbZNYEP6fXAs0KTSMsDbs4Md6orYEXaQDt1zknmrSmgtKL5o4fYedONgu73Kpkw1lLdZ82OSxlH00Eu9QlqRI";
    private CardInputWidget cardInputWidget;
    private Button backButton, PayButton;
    private OkHttpClient httpClient = new OkHttpClient();
    private String paymentIntentClientSecret;
    private Stripe stripe;
    private APIManager apiManager;
    private int addressId, userId;
    private double totalPrice;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view = (View) inflater.inflate(R.layout.fragment_checkout_paiement, container, false);

        cardInputWidget = view.findViewById(R.id.cardInputWidget);
        backButton = view.findViewById(R.id.backButton);
        PayButton = view.findViewById(R.id.PayButton);

        cardInputWidget.setPostalCodeEnabled(false);

        apiManager = new APIManager(getContext());

        if (getArguments() != null) {
            addressId = getArguments().getInt("addressId");
        }

        // Set userId from the phone preferences
        SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        userId = sharedPref.getInt("userId", -1);

        loadData();

        stripe = new Stripe(getContext(), STRIPE_PUBLISHABLE_KEY);

        ApiResultCallback callback = new ApiResultCallback<Token>() {

            @Override
            public void onSuccess(Token token) {
                JSONObject data = new JSONObject();
                try {
                    data.put("amount", totalPrice);
                    data.put("id", token.getId());
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
                                insertOrder();
                            } else {
                                Log.d("Appel API", response.getString("error"));
                                Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                };

                try {
                    apiManager.apiCall("stripe", "charge", data, listener);
                } catch (JSONException e) {
                    Log.d("Appel API", e.getMessage());
                    Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onError(@NonNull Exception e) {
                Log.d("Appel API", e.getMessage());
            }
        };

        PayButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(cardInputWidget.getCard() != null) {
                    stripe.createToken(cardInputWidget.getCard(), callback);
                } else {
                    Toast.makeText(getContext(), "Veuillez remplir toutes les informations avant de procéder au paiement.", Toast.LENGTH_SHORT).show();
                }
            }
        });

        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Navigate to CheckoutAddressFragment
                Fragment checkoutAddressFragment = new CheckoutAddressFragment();
                FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
                transaction.replace(R.id.frameLayout, checkoutAddressFragment);
                transaction.addToBackStack(null);
                transaction.commit();
            }
        });

        return view;
    }

    private void loadData() {
        JSONObject data = new JSONObject();
        try {
            data.put("user_id", userId);
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
                        calculateTotalPrice(response.getJSONArray("data"));
                    } else {
                        Log.d("Appel API", response.getString("error"));
                        Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        try {
            apiManager.apiCall("basket", "getProduct", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }

    private void calculateTotalPrice(JSONArray data) throws JSONException {
        DecimalFormat decfor = new DecimalFormat("0.00");
        totalPrice = 0;

        for(int i = 0; i < data.length(); i++) {
            JSONObject product = data.getJSONObject(i);
            int quantity = Integer.parseInt(product.getString("quantity"));
            double price = product.getDouble("price");
            totalPrice += quantity * price;
        }

        totalPrice = Double.parseDouble(decfor.format(totalPrice + totalPrice * 0.17));
    }

    private void insertOrder() {
        JSONObject data = new JSONObject();
        JSONObject dataOrder = new JSONObject();
        try {
            data.put("table", "orders");
            dataOrder.put("user_id", userId);
            dataOrder.put("address_id", addressId);
            dataOrder.put("order_state", "EN COURS");
            data.put("data", dataOrder);
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
                        // Navigate to CheckoutBilanFragment
                        Fragment checkoutBilanFragment = new CheckoutBilanFragment();

                        // Passing arguments to the Fragment
                        Bundle args = new Bundle();
                        args.putInt("orderId", response.getInt("order_id"));
                        checkoutBilanFragment.setArguments(args);
                        FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
                        transaction.replace(R.id.frameLayout, checkoutBilanFragment);
                        transaction.addToBackStack(null);
                        transaction.commit();
                    } else {
                        Log.d("Appel API", response.getString("error"));
                        Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        };

        try {
            apiManager.apiCall("orders", "insertOrder", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }
}