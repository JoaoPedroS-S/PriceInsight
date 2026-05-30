package com.priceinsight.backend.repository;

import com.priceinsight.backend.model.Market;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarketRepository extends JpaRepository<Market, Long> {
    boolean existsByNomeIgnoreCase(String nome);
}
