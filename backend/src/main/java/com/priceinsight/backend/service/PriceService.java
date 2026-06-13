package com.priceinsight.backend.service;

import com.priceinsight.backend.dto.PriceDTO;
import com.priceinsight.backend.dto.PriceRequestDTO;
import java.util.List;

public interface PriceService {
    List<PriceDTO> findAll();
    PriceDTO findById(Long id);
    List<PriceDTO> findByProductId(Long productId);
    PriceDTO create(PriceRequestDTO dto);
    PriceDTO update(Long id, PriceRequestDTO dto);
    void delete(Long id);
}
