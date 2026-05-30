package com.priceinsight.backend.repository;

import com.priceinsight.backend.model.Preco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PriceRepository extends JpaRepository<Preco, Long> {
    List<Preco> findByProdutoId(Long productId);
    List<Preco> findByMercadoId(Long marketId);
}
