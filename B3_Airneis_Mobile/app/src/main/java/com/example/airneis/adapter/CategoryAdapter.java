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
import com.example.airneis.model.CategoryModel;

import java.util.ArrayList;

public class CategoryAdapter extends RecyclerView.Adapter<CategoryAdapter.ViewHolder> {
    private ArrayList<CategoryModel> items;
    private Context context;
    private FragmentActivity fragmentActivity;

    public CategoryAdapter(FragmentActivity fragmentActivity, ArrayList<CategoryModel> items) {
        this.fragmentActivity = fragmentActivity;
        this.items = items;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        context = parent.getContext();
        View view = LayoutInflater.from(context).inflate(R.layout.item_top_card_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        CategoryModel category = items.get(position);
        holder.categoryName.setText(category.getCategoryName());
        Glide.with(context)
                .load(context.getResources().getIdentifier(category.getImageName().split("\\.")[0], "drawable", context.getPackageName()))
                .into(holder.categoryImage);

        holder.voirPlusButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Navigate to CategoryDetailFragment
                Fragment categoryDetailFragment = new CategoryDetailFragment();

                // Passing arguments to the Fragment
                Bundle args = new Bundle();
                args.putInt("categoryId", category.getCategoryId());
                categoryDetailFragment.setArguments(args);
                FragmentTransaction transaction = fragmentActivity.getSupportFragmentManager().beginTransaction();
                transaction.replace(R.id.frameLayout, categoryDetailFragment);
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
        TextView categoryName;
        ImageView categoryImage;
        Button voirPlusButton;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            categoryName = itemView.findViewById(R.id.cardName);
            categoryImage = itemView.findViewById(R.id.cardImage);
            voirPlusButton = itemView.findViewById(R.id.SeeMoreButton);
        }
    }
}
