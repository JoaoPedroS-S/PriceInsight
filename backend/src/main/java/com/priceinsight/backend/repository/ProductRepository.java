package com.priceinsight.backend.repository;

import com.priceinsight.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    boolean existsByNomeIgnoreCase(String nome);
}
