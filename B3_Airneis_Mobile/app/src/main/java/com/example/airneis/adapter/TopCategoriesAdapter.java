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
import com.example.airneis.model.TopCategoriesData;

import java.util.ArrayList;

public class TopCategoriesAdapter extends RecyclerView.Adapter<TopCategoriesAdapter.ViewHolder> {
    private ArrayList<TopCategoriesData> items;
    private Context context;

    public TopCategoriesAdapter(ArrayList<TopCategoriesData> items) {
        this.items = items;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        context = parent.getContext();
        View view = LayoutInflater.from(context).inflate(R.layout.top_card_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        TopCategoriesData category = items.get(position);
        holder.categoryName.setText(category.getCategoryName());
        Glide.with(context)
                .load(context.getResources().getIdentifier(category.getImageName().split("\\.")[0], "drawable", context.getPackageName()))
                .into(holder.categoryImage);
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView categoryName;
        ImageView categoryImage;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            categoryName = itemView.findViewById(R.id.cardName);
            categoryImage = itemView.findViewById(R.id.cardImage);
        }
    }
}
