package com.example.airneis.adapter;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.airneis.R;
import com.example.airneis.fragment.myAccount.orders.OrderDetailFragment;
import com.example.airneis.model.OrderModel;
import com.example.airneis.model.ProductModel;

import java.util.ArrayList;
import java.util.List;

public class OrderDetailAdapter extends RecyclerView.Adapter<OrderDetailAdapter.OrderItemViewHolder> {

    private ArrayList<ProductModel> products;
    private FragmentActivity fragmentActivity;
    private Context context;

    public OrderDetailAdapter(FragmentActivity fragmentActivity, ArrayList<ProductModel> products) {
        this.fragmentActivity = fragmentActivity;
        this.products = products;
    }

    @NonNull
    @Override
    public OrderItemViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        context = parent.getContext();
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_order_details_product, parent, false);
        return new OrderItemViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull OrderItemViewHolder holder, int position) {
        ProductModel product = products.get(position);
        holder.productNameTv.setText(product.getProductName());
        holder.productDescriptionTv.setText("Description" + product.getProductDescription());
        holder.productQuantityTv.setText("Quantité: " + product.getProductQuantity());
        holder.productTotalPriceTv.setText("Prix total: " + String.format("%.2f", product.getProductPrice()*product.getProductQuantity()) + " €");

        Glide.with(context)
                .load(context.getResources().getIdentifier(product.getImageName().split("\\.")[0], "drawable", context.getPackageName()))
                .into(holder.product_image);
    }

    @Override
    public int getItemCount() {
        return products.size();
    }

    public static class OrderItemViewHolder extends RecyclerView.ViewHolder {

        TextView productNameTv, productDescriptionTv, productQuantityTv, productTotalPriceTv;
        ImageView product_image;

        public OrderItemViewHolder(@NonNull View itemView) {
            super(itemView);
            productNameTv = itemView.findViewById(R.id.product_name);
            productDescriptionTv = itemView.findViewById(R.id.product_description);
            productQuantityTv = itemView.findViewById(R.id.product_quantity);
            productTotalPriceTv = itemView.findViewById(R.id.product_total_price);
            product_image = itemView.findViewById(R.id.product_image);
        }
    }
}
