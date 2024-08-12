package com.example.airneis.fragment.basket;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
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
import androidx.recyclerview.widget.DividerItemDecoration;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.airneis.R;
import com.example.airneis.adapter.BasketAdapter;
import com.example.airneis.fragment.checkout.CheckoutAddressFragment;
import com.example.airneis.fragment.myAccount.orders.OrderDetailFragment;
import com.example.airneis.manager.APIManager;
import com.example.airneis.model.BasketData;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class BasketFragment extends Fragment {
    private RecyclerView recyclerView;
    private BasketAdapter basketAdapter;
    private ArrayList<BasketData> basketList;
    private TextView totalPriceView, tvaPriceView;
    private Button checkoutButton;
    private double totalPrice;
    private final double tva = 0.17;
    private int userId;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_basket, container, false);

        recyclerView = view.findViewById(R.id.recyclerView);
        totalPriceView = view.findViewById(R.id.totalPrice);
        tvaPriceView = view.findViewById(R.id.tvaPrice);
        checkoutButton = view.findViewById(R.id.checkoutButton);
        basketList = new ArrayList<>();

        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        basketAdapter = new BasketAdapter(basketList, new BasketAdapter.OnItemClickListener() {
            @Override
            public void onDeleteClick(int position) {
                // Handle delete click
                BasketData product = basketList.get(position);
                deleteProductFromBasket(product.getId(), position);
            }

            @Override
            public void onQuantityChange(int position, int quantity) {
                // Handle quantity change
                BasketData product = basketList.get(position);
                product.setQuantity(quantity);
                updateProductQuantity(product.getId(), quantity);
                updateTotalPriceAndTva(); // Update total price and TVA
            }
        });


        recyclerView.setAdapter(basketAdapter);

        // Add item decoration for dividers
        DividerItemDecoration dividerItemDecoration = new DividerItemDecoration(recyclerView.getContext(), DividerItemDecoration.VERTICAL);
        recyclerView.addItemDecoration(dividerItemDecoration);

        // Set userId from the phone preferences
        SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        userId = sharedPref.getInt("userId", -1);

        fetchBasketProducts();

        checkoutButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                boolean canContinue = true;
                for (BasketData product : basketList) {
                    if(!(product.getQuantity() <= product.getStock() && product.getStock() != 0)) {
                        canContinue = false;
                    }
                }

                if(canContinue) {
                    // Navigate to CheckoutAddressFragment
                    Fragment checkoutAddressFragment = new CheckoutAddressFragment();
                    FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
                    transaction.replace(R.id.frameLayout, checkoutAddressFragment);
                    transaction.addToBackStack(null);
                    transaction.commit();
                } else {
                    Toast.makeText(getContext(), "Un des produits présent dans votre panier n'est plus en stock suffisant pour être commandé.", Toast.LENGTH_SHORT).show();
                }
            }
        });

        return view;
    }

    private void fetchBasketProducts() {
        APIManager apiManager = new APIManager(getContext());

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
                        JSONArray products = response.getJSONArray("data");
                        basketList.clear();
                        for (int i = 0; i < products.length(); i++) {
                            JSONObject product = products.getJSONObject(i);
                            int id = product.getInt("id");
                            String name = product.getString("name");
                            String description = product.getString("description");
                            String imageName = product.getString("image_name");
                            int quantity = product.getInt("quantity");
                            double price = product.getDouble("price");
                            int stock = product.getInt("stock");
                            if(stock < quantity) {
                                quantity = stock;
                                updateProductQuantity(id, quantity);
                            }
                            basketList.add(new BasketData(id, name, description, imageName, quantity, price, stock));
                        }
                        basketAdapter.notifyDataSetChanged();
                        updateTotalPriceAndTva();
                    } else {
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

    private void deleteProductFromBasket(int productId, int position) {
        APIManager apiManager = new APIManager(getContext());

        JSONObject data = new JSONObject();
        try {
            data.put("user_id", userId);
            data.put("product_id", productId);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        APIManager.VolleyResponseListener listener = new APIManager.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Log.e("API Error", message);
                Toast.makeText(getContext(), "Error deleting product", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onResponse(JSONObject response) {
                try {
                    if (response.getBoolean("success")) {
                        basketList.remove(position);
                        basketAdapter.notifyItemRemoved(position);
                        updateTotalPriceAndTva();
                    } else {
                        Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    Log.e("JSON Error", "Error parsing JSON", e);
                }
            }
        };

        try {
            apiManager.apiCall("basket", "deleteProduct", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }

    private void updateProductQuantity(int productId, int quantity) {
        APIManager apiManager = new APIManager(getContext());

        JSONObject data = new JSONObject();
        try {
            data.put("user_id", userId);
            data.put("product_id", productId);
            data.put("quantity", quantity);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        APIManager.VolleyResponseListener listener = new APIManager.VolleyResponseListener() {
            @Override
            public void onError(String message) {
                Log.e("API Error", message);
                Toast.makeText(getContext(), "Error updating quantity", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onResponse(JSONObject response) {
                try {
                    if (response.getBoolean("success")) {
                        updateTotalPriceAndTva();
                    } else {
                        Toast.makeText(getContext(), response.getString("error"), Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    Log.e("JSON Error", "Error parsing JSON", e);
                }
            }
        };

        try {
            apiManager.apiCall("basket", "updateProductQuantity", data, listener);
        } catch (JSONException e) {
            Log.d("Appel API", e.getMessage());
            Toast.makeText(getContext(), "Erreur lors de l'appel API.", Toast.LENGTH_SHORT).show();
        }
    }

    public void updateTotalPriceAndTva() {
        totalPrice = 0;
        for (BasketData product : basketList) {
            totalPrice += product.getPrice() * product.getQuantity();
        }
        totalPriceView.setText(String.format("Prix total: %.2f €", totalPrice));
        tvaPriceView.setText(String.format("TVA: %.2f €", (totalPrice * tva)));
    }
}
