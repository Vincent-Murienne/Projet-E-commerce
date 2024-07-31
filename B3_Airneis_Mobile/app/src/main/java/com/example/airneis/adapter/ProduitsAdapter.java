package com.example.airneis.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.airneis.R;
import com.example.airneis.model.ProduitsData;

import java.util.ArrayList;

public class ProduitsAdapter extends RecyclerView.Adapter<ProduitsAdapter.ViewHolder> {
    private ArrayList<ProduitsData> items;
    private Context context;

    public ProduitsAdapter(ArrayList<ProduitsData> items) {

        this.items = items;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        context = parent.getContext();
        View view = LayoutInflater.from(context).inflate(R.layout.fragment_product_details, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ProduitsData product = items.get(position);
        holder.productName.setText(product.getProductName());
        holder.productPrice.setText(String.format("%.2f €", product.getProductPrice()));

        Glide.with(context)
                .load(context.getResources().getIdentifier(product.getImageName().split("\\.")[0], "drawable", context.getPackageName()))
                .into(holder.productImage);

        holder.voirPlusButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
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
            productImage = itemView.findViewById(R.id.categoryImage);
        }
    }
    public interface OnItemClickListener {
        void onItemClick(ProduitsData product);
    }
}
