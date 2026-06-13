package com.priceinsight.backend.service;

import com.priceinsight.backend.dto.MarketDTO;
import java.util.List;

public interface MarketService {
    List<MarketDTO> findAll();
    MarketDTO findById(Long id);
    MarketDTO create(MarketDTO dto);
    MarketDTO update(Long id, MarketDTO dto);
    void delete(Long id);
}
