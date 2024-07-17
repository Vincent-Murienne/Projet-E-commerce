package com.example.airneis.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.airneis.R;
import com.example.airneis.data.TopProduitsData;

import java.util.ArrayList;

public class TopProduitsAdapter extends RecyclerView.Adapter<TopProduitsAdapter.ViewHolder> {
    private ArrayList<TopProduitsData> items;
    private Context context;

    public TopProduitsAdapter(ArrayList<TopProduitsData> items) {
        this.items = items;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        context = parent.getContext();
        View view = LayoutInflater.from(context).inflate(R.layout.top_produits_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        TopProduitsData product = items.get(position);
        holder.productName.setText(product.getProductName());
        Glide.with(context)
                .load(context.getResources().getIdentifier(product.getImageName().split("\\.")[0], "drawable", context.getPackageName()))
                .into(holder.productImage);
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView productName;
        ImageView productImage;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            productName = itemView.findViewById(R.id.productName);
            productImage = itemView.findViewById(R.id.productImage);
        }
    }
}
