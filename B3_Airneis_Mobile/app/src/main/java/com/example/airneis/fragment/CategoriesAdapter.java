package com.example.airneis.fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.airneis.R;
import com.example.airneis.model.Category;
import com.squareup.picasso.Picasso;

import java.util.List;

public class CategoriesAdapter extends RecyclerView.Adapter<CategoriesAdapter.ViewHolder> {

    private List<Category> categories;

    public CategoriesAdapter(List<Category> categories) {
        this.categories = categories;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_category, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        Category category = categories.get(position);
        holder.categoryName.setText(category.getName());
        Picasso.get().load("http://10.0.2.2:8000/img/" + category.getImageName()).into(holder.categoryImage);
        holder.voirPlus.setOnClickListener(v -> {
            // Gérer le clic sur le bouton "Voir plus"
        });
    }

    @Override
    public int getItemCount() {
        return categories.size();
    }

    public static class ViewHolder extends RecyclerView.ViewHolder {
        ImageView categoryImage;
        TextView categoryName;
        Button voirPlus;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            categoryImage = itemView.findViewById(R.id.categoryImage);
            categoryName = itemView.findViewById(R.id.categoryName);
            voirPlus = itemView.findViewById(R.id.voirPlus);
        }
    }
}
