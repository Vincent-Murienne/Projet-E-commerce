package com.example.airneis.adapter;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.fragment.app.FragmentTransaction;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.airneis.R;
import com.example.airneis.fragment.categories.CategoryDetailFragment;
import com.example.airneis.fragment.product.ProductDetailFragment;
import com.example.airneis.model.ProductModel;

import java.util.ArrayList;

public class ProductsListAdapter extends RecyclerView.Adapter<ProductsListAdapter.ViewHolder> {
    private ArrayList<ProductModel> items;
    private Context context;
    private FragmentActivity fragmentActivity;

    public ProductsListAdapter(FragmentActivity fragmentActivity, ArrayList<ProductModel> items) {
        this.fragmentActivity = fragmentActivity;
        this.items = items;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        context = parent.getContext();
        View view = LayoutInflater.from(context).inflate(R.layout.item_product, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ProductModel product = items.get(position);
        holder.productName.setText(product.getProductName());
        holder.productPrice.setText(String.format("%.2f €", product.getProductPrice()));

        Glide.with(context)
                .load(context.getResources().getIdentifier(product.getImageName().split("\\.")[0], "drawable", context.getPackageName()))
                .into(holder.productImage);

        holder.voirPlusButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Navigate to CategoryDetailFragment
                Fragment productDetailFragment = new ProductDetailFragment();

                // Passing arguments to the Fragment
                Bundle args = new Bundle();
                args.putInt("productId", product.getProductId());
                productDetailFragment.setArguments(args);
                FragmentTransaction transaction = fragmentActivity.getSupportFragmentManager().beginTransaction();
                transaction.replace(R.id.frameLayout, productDetailFragment);
                transaction.addToBackStack(null);
                transaction.commit();
            }
        });
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView productName;
        TextView productPrice;
        ImageView productImage;
        Button voirPlusButton;


        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            productName = itemView.findViewById(R.id.productName);
            productPrice = itemView.findViewById(R.id.productPrice);
            productImage = itemView.findViewById(R.id.productImage);
            voirPlusButton = itemView.findViewById(R.id.SeeMoreButton);
        }
    }
}
