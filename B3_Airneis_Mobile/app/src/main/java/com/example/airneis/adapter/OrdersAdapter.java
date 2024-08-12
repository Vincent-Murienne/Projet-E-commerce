package com.example.airneis.adapter;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.FragmentActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.airneis.R;
import com.example.airneis.model.OrderModel;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class OrdersAdapter extends RecyclerView.Adapter<OrdersAdapter.OrderViewHolder> {

    private Map<Integer, List<OrderModel>> groupedOrders;
    private List<Integer> years;
    private FragmentActivity fragmentActivity;

    public OrdersAdapter(FragmentActivity fragmentActivity, Map<Integer, List<OrderModel>> groupedOrders) {
        this.fragmentActivity = fragmentActivity;
        this.groupedOrders = groupedOrders;
        this.years = new ArrayList<>(groupedOrders.keySet());
        this.years.sort((a, b) -> b - a); // Sort years in descending order
    }

    public void setGroupedOrders(Map<Integer, List<OrderModel>> groupedOrders) {
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
        holder.yearTitle.setText(String.valueOf(year));
        OrderItemsAdapter adapter = new OrderItemsAdapter(fragmentActivity, groupedOrders.get(year));
        holder.ordersRecyclerView.setAdapter(adapter);
    }

    @Override
    public int getItemCount() {
        return years.size();
    }

    public static class OrderViewHolder extends RecyclerView.ViewHolder {

        TextView yearTitle;
        RecyclerView ordersRecyclerView;

        public OrderViewHolder(@NonNull View itemView) {
            super(itemView);
            yearTitle = itemView.findViewById(R.id.year_title_order);
            ordersRecyclerView = itemView.findViewById(R.id.recycler_view_order_items);
            ordersRecyclerView.setLayoutManager(new LinearLayoutManager(itemView.getContext()));
        }
    }
}
