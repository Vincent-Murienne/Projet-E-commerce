package com.example.airneis.adapter;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;

import com.example.airneis.R;
import com.example.airneis.fragment.myAccount.orders.OrderDetailFragment;
import com.example.airneis.model.OrderModel;

import java.util.List;

public class OrderItemsAdapter extends RecyclerView.Adapter<OrderItemsAdapter.OrderItemViewHolder> {

    private List<OrderModel> orders;
    private float tva = 0.17f;
    private FragmentActivity fragmentActivity;

    public OrderItemsAdapter(FragmentActivity fragmentActivity, List<OrderModel> orders) {
        this.fragmentActivity = fragmentActivity;
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
        OrderModel order = orders.get(position);
        holder.orderIdTextView.setText("Commande n°" + order.getOrderId());
        holder.orderDateTextView.setText("Date de commande: " + order.getOrderDate().toString());
        holder.orderStatusTextView.setText("Statut de la commande: " + order.getOrderStatus());
        holder.totalItemsTextView.setText("Nombre total d'articles: " + order.getTotalItems());
        float totalPriceWithTva = order.getTotalPrice() + (order.getTotalPrice() * 0.17f);
        holder.totalPriceTextView.setText("Prix total: " + String.format("%.2f", totalPriceWithTva) + "€");

        holder.itemView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Navigate to OrderDetailFragment
                Fragment orderDetailFragment = new OrderDetailFragment();

                // Passing arguments to the Fragment
                Bundle args = new Bundle();
                args.putInt("orderId", order.getOrderId());
                orderDetailFragment.setArguments(args);
                FragmentTransaction transaction = fragmentActivity.getSupportFragmentManager().beginTransaction();
                transaction.replace(R.id.frameLayout, orderDetailFragment);
                transaction.addToBackStack(null);
                transaction.commit();
            }
        });
    }

    @Override
    public int getItemCount() {
        return orders.size();
    }

    public static class OrderItemViewHolder extends RecyclerView.ViewHolder {

        TextView orderIdTextView, orderDateTextView, orderStatusTextView, totalItemsTextView, totalPriceTextView;

        public OrderItemViewHolder(@NonNull View itemView) {
            super(itemView);
            orderIdTextView = itemView.findViewById(R.id.order_id);
            orderDateTextView = itemView.findViewById(R.id.order_date);
            orderStatusTextView = itemView.findViewById(R.id.order_status);
            totalItemsTextView = itemView.findViewById(R.id.total_items);
            totalPriceTextView = itemView.findViewById(R.id.total_price);
        }
    }
}
