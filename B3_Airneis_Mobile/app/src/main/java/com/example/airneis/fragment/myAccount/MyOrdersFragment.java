package com.example.airneis.fragment.myAccount;

import android.content.Context;
import android.content.SharedPreferences;
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
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.airneis.R;
import com.example.airneis.fragment.myAccount.loginRegister.LoginFragment;
import com.example.airneis.manager.APIManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MyOrdersFragment extends Fragment {

    private RecyclerView recyclerView;
    private OrdersAdapter ordersAdapter;
    private TextView errorMessage;
    private APIManager apiManager;
    private float tva = 0.17f;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View root = inflater.inflate(R.layout.fragment_my_orders, container, false);

        errorMessage = root.findViewById(R.id.error_message_order);
        recyclerView = root.findViewById(R.id.recycler_view_orders);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));
        ordersAdapter = new OrdersAdapter(new HashMap<>());
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
                        Log.d("debug", response.toString());
                        try {
                            if (response.getBoolean("success")) {
                                errorMessage.setVisibility(View.GONE);
                                List<Order> orders = parseOrders(response.getJSONArray("data"));
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

    private List<Order> parseOrders(JSONArray ordersArray) throws JSONException {
        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < ordersArray.length(); i++) {
            JSONObject orderObject = ordersArray.getJSONObject(i);
            Order order = new Order(
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

    private void groupOrdersByYear(List<Order> orders) {
        Map<Integer, List<Order>> ordersByYear = new HashMap<>();
        for (Order order : orders) {
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

    // Order data class
    public static class Order {
        private int orderId;
        private LocalDate orderDate;
        private String orderStatus;
        private int totalItems;
        private float totalPrice;

        public Order(int orderId, LocalDate orderDate, String orderStatus, int totalItems, float totalPrice) {
            this.orderId = orderId;
            this.orderDate = orderDate;
            this.orderStatus = orderStatus;
            this.totalItems = totalItems;
            this.totalPrice = totalPrice;
        }

        public int getOrderId() {
            return orderId;
        }

        public LocalDate getOrderDate() {
            return orderDate;
        }

        public String getOrderStatus() {
            return orderStatus;
        }

        public int getTotalItems() {
            return totalItems;
        }

        public float getTotalPrice() {
            return totalPrice;
        }
    }

    // Adapter for orders grouped by year
    public static class OrdersAdapter extends RecyclerView.Adapter<OrdersAdapter.OrderViewHolder> {

        private Map<Integer, List<Order>> groupedOrders;
        private List<Integer> years;

        public OrdersAdapter(Map<Integer, List<Order>> groupedOrders) {
            this.groupedOrders = groupedOrders;
            this.years = new ArrayList<>(groupedOrders.keySet());
            this.years.sort((a, b) -> b - a); // Sort years in descending order
        }

        public void setGroupedOrders(Map<Integer, List<Order>> groupedOrders) {
            this.groupedOrders = groupedOrders;
            this.years = new ArrayList<>(groupedOrders.keySet());
            this.years.sort((a, b) -> b - a); // Sort years in descending order
            notifyDataSetChanged();
        }

        @NonNull
        @Override
        public OrderViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_order_year, parent, false);
            return new OrderViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull OrderViewHolder holder, int position) {
            int year = years.get(position);
            holder.bind(year, groupedOrders.get(year));
        }

        @Override
        public int getItemCount() {
            return years.size();
        }

        static class OrderViewHolder extends RecyclerView.ViewHolder {

            TextView yearTitle;
            RecyclerView ordersRecyclerView;

            OrderViewHolder(@NonNull View itemView) {
                super(itemView);
                yearTitle = itemView.findViewById(R.id.year_title_order);
                ordersRecyclerView = itemView.findViewById(R.id.recycler_view_order_items);
                ordersRecyclerView.setLayoutManager(new LinearLayoutManager(itemView.getContext()));
            }

            void bind(int year, List<Order> orders) {
                yearTitle.setText(String.valueOf(year));
                OrderItemsAdapter adapter = new OrderItemsAdapter(orders);
                ordersRecyclerView.setAdapter(adapter);
            }
        }
    }

    // Adapter for individual order items
    public static class OrderItemsAdapter extends RecyclerView.Adapter<OrderItemsAdapter.OrderItemViewHolder> {

        private List<Order> orders;
        private float tva = 0.17f;

        public OrderItemsAdapter(List<Order> orders) {
            this.orders = orders;
        }

        @NonNull
        @Override
        public OrderItemViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_order_detail, parent, false);
            return new OrderItemViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull OrderItemViewHolder holder, int position) {
            Order order = orders.get(position);
            holder.bind(order);
        }

        @Override
        public int getItemCount() {
            return orders.size();
        }

        static class OrderItemViewHolder extends RecyclerView.ViewHolder {

            TextView orderIdTextView, orderDateTextView, orderStatusTextView, totalItemsTextView, totalPriceTextView;

            OrderItemViewHolder(@NonNull View itemView) {
                super(itemView);
                orderIdTextView = itemView.findViewById(R.id.order_id);
                orderDateTextView = itemView.findViewById(R.id.order_date);
                orderStatusTextView = itemView.findViewById(R.id.order_status);
                totalItemsTextView = itemView.findViewById(R.id.total_items);
                totalPriceTextView = itemView.findViewById(R.id.total_price);
            }

            void bind(Order order) {
                orderIdTextView.setText("Commande n°" + order.getOrderId());
                orderDateTextView.setText("Date de commande: " + order.getOrderDate().toString());
                orderStatusTextView.setText("Statut de la commande: " + order.getOrderStatus());
                totalItemsTextView.setText("Nombre total d'articles: " + order.getTotalItems());
                float totalPriceWithTva = order.getTotalPrice() + (order.getTotalPrice() * 0.17f);
                totalPriceTextView.setText("Prix total: " + String.format("%.2f", totalPriceWithTva) + "€");
            }
        }
    }
}
