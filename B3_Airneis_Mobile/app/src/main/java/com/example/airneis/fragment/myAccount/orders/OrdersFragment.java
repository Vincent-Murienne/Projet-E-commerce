package com.example.airneis.fragment.myAccount.orders;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.airneis.R;
import com.example.airneis.adapter.OrdersAdapter;
import com.example.airneis.fragment.myAccount.loginRegister.LoginFragment;
import com.example.airneis.manager.APIManager;
import com.example.airneis.model.OrderModel;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OrdersFragment extends Fragment {

    private RecyclerView recyclerView;
    private OrdersAdapter ordersAdapter;
    private TextView errorMessage;
    private APIManager apiManager;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_orders, container, false);

        errorMessage = root.findViewById(R.id.error_message_order);
        recyclerView = root.findViewById(R.id.recycler_view_orders);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        ordersAdapter = new OrdersAdapter(getActivity(), new HashMap<>());
        recyclerView.setAdapter(ordersAdapter);

        apiManager = new APIManager(getContext());
        loadUserData();

        return root;
    }

    private void loadUserData() {
        SharedPreferences sharedPref = getActivity().getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        int userId = sharedPref.getInt("userId", -1);

        if (userId != -1) {
            JSONObject data = new JSONObject();
            try {
                data.put("user_id", userId);

                apiManager.apiCall("orders", "getAllOrdersByUser", data, new APIManager.VolleyResponseListener() {
                    @Override
                    public void onError(String message) {
                        Toast.makeText(getContext(), message, Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            if (response.getBoolean("success")) {
                                errorMessage.setVisibility(View.GONE);
                                List<OrderModel> orders = parseOrders(response.getJSONArray("data"));
                                groupOrdersByYear(orders);
                            } else {
                                errorMessage.setVisibility(View.VISIBLE);
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
        } else {
            Toast.makeText(getContext(), "Veuillez vous connecter afin de pouvoir accéder à cette page !", Toast.LENGTH_SHORT).show();

            // Navigate to HomeFragment
            Fragment loginFragment = new LoginFragment();
            FragmentTransaction transaction = getActivity().getSupportFragmentManager().beginTransaction();
            transaction.replace(R.id.frameLayout, loginFragment);
            transaction.addToBackStack(null);
            transaction.commit();
        }
    }

    private List<OrderModel> parseOrders(JSONArray ordersArray) throws JSONException {
        List<OrderModel> orders = new ArrayList<>();
        for (int i = 0; i < ordersArray.length(); i++) {
            JSONObject orderObject = ordersArray.getJSONObject(i);
            OrderModel order = new OrderModel(
                    orderObject.getInt("order_id"),
                    LocalDate.parse(orderObject.getString("order_date").split(" ")[0]),
                    orderObject.getString("order_status"),
                    orderObject.getInt("total_items"),
                    (float) orderObject.getDouble("total_price")
            );
            orders.add(order);
        }
        return orders;
    }

    private void groupOrdersByYear(List<OrderModel> orders) {
        Map<Integer, List<OrderModel>> ordersByYear = new HashMap<>();
        for (OrderModel order : orders) {
            int year = order.getOrderDate().getYear();
            if (!ordersByYear.containsKey(year)) {
                ordersByYear.put(year, new ArrayList<>());
            }
            ordersByYear.get(year).add(order);
        }
        ordersAdapter.setGroupedOrders(ordersByYear);
        if (ordersByYear.isEmpty()) {
            errorMessage.setVisibility(View.VISIBLE);
        } else {
            errorMessage.setVisibility(View.GONE);
        }
    }
}
