package com.example.airneis.fragment.myAccount.orders;

import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.airneis.R;
import com.example.airneis.adapter.OrderDetailAdapter;
import com.example.airneis.adapter.OrdersAdapter;
import com.example.airneis.manager.APIManager;
import com.example.airneis.model.ProductModel;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class OrderDetailFragment extends Fragment {
    private TextView orderDateTv, orderStateTv, orderPriceTv, orderAddressTv, errorMessageTv;
    private RecyclerView recyclerView;
    private OrderDetailAdapter orderDetailAdapter;
    private APIManager apiManager;
    private int orderId;
    private ArrayList<ProductModel> productModelList;
    private double totalPrice = 0;
    private float tva = 0.17f;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_details_order, container, false);

        productModelList = new ArrayList<>();

        orderDateTv = view.findViewById(R.id.order_date);
        orderStateTv = view.findViewById(R.id.order_state);
        orderPriceTv = view.findViewById(R.id.total_price);
        orderAddressTv = view.findViewById(R.id.order_address);
        errorMessageTv = view.findViewById(R.id.error_message_order);
        recyclerView = view.findViewById(R.id.recyclerView);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        orderDetailAdapter = new OrderDetailAdapter(getActivity(), productModelList);
        recyclerView.setAdapter(orderDetailAdapter);

        apiManager = new APIManager(getContext());
        loadOrderData();

        return view;
    }

    private void loadOrderData() {
        if (getArguments() != null) {
            orderId = getArguments().getInt("orderId");
        }

        JSONObject data = new JSONObject();
        try {
            data.put("order_id", orderId);

            apiManager.apiCall("orders", "getOrderDetails", data, new APIManager.VolleyResponseListener() {
                @Override
                public void onError(String message) {
                    Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onResponse(JSONObject response) {
                    try {
                        if (response.getBoolean("success")) {
                            JSONArray products = response.getJSONArray("data");
                            if(products.length() == 0) {
                                errorMessageTv.setVisibility(View.VISIBLE);
                            } else {
                                errorMessageTv.setVisibility(View.GONE);

                                orderDateTv.setText("Date de la commande: " + products.getJSONObject(0).getString("date"));
                                orderStateTv.setText("Statut de la commande: " + products.getJSONObject(0).getString("order_state"));
                                orderAddressTv.setText("Adresse utilisé: " + products.getJSONObject(0).getString("address_name"));

                                totalPrice = 0;

                                for(int i = 0; i < products.length(); i++) {
                                    JSONObject product = products.getJSONObject(i);
                                    int productId = product.getInt("product_id");
                                    int productQuantity = product.getInt("quantity");
                                    String productName = product.getString("product_name");
                                    double productPrice = product.getDouble("product_price");
                                    String productImage = product.getString("image_name");
                                    String productDescription = product.getString("product_description");
                                    productModelList.add(new ProductModel(productId, productName, productDescription, productImage, productPrice, productQuantity));

                                    totalPrice += productPrice*productQuantity;
                                }
                                orderDetailAdapter.notifyDataSetChanged();

                                totalPrice = totalPrice + totalPrice*tva;
                                orderPriceTv.setText("Prix total de la commande: " + String.format("%.2f", totalPrice) + " €");
                            }
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
