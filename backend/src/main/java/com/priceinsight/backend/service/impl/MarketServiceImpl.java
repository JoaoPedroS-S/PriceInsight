package com.priceinsight.backend.service.impl;

import com.priceinsight.backend.dto.MarketDTO;
import com.priceinsight.backend.exception.BusinessException;
import com.priceinsight.backend.exception.ResourceNotFoundException;
import com.priceinsight.backend.model.Market;
import com.priceinsight.backend.repository.MarketRepository;
import com.priceinsight.backend.service.MarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketServiceImpl implements MarketService {

    private final MarketRepository marketRepository;

    @Override
    @Transactional(readOnly = true)
    public List<MarketDTO> findAll() {
        return marketRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MarketDTO findById(Long id) {
        Market market = marketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mercado com ID " + id + " não encontrado"));
        return toDTO(market);
    }

    @Override
    @Transactional
    public MarketDTO create(MarketDTO dto) {
        // Validation check for duplicates: "Não permitir mercados duplicados"
        if (marketRepository.existsByNomeIgnoreCase(dto.getNome())) {
            throw new BusinessException("Já existe um mercado cadastrado com o nome: " + dto.getNome());
        }
        
        Market market = toEntity(dto);
        Market savedMarket = marketRepository.save(market);
        return toDTO(savedMarket);
    }

    @Override
    @Transactional
    public MarketDTO update(Long id, MarketDTO dto) {
        Market existingMarket = marketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mercado com ID " + id + " não encontrado"));

        // Duplicate check on rename
        if (!existingMarket.getNome().equalsIgnoreCase(dto.getNome()) && 
            marketRepository.existsByNomeIgnoreCase(dto.getNome())) {
            throw new BusinessException("Já existe outro mercado cadastrado com o nome: " + dto.getNome());
        }

        existingMarket.setNome(dto.getNome());
        existingMarket.setRegiao(dto.getRegiao());
        existingMarket.setLocalizacao(dto.getLocalizacao());
        existingMarket.setDeliveryAvailable(dto.getDeliveryAvailable());

        Market updatedMarket = marketRepository.save(existingMarket);
        return toDTO(updatedMarket);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!marketRepository.existsById(id)) {
            throw new ResourceNotFoundException("Mercado com ID " + id + " não encontrado");
        }
        marketRepository.deleteById(id);
    }

    // Mapping Entities -> DTOs
    private MarketDTO toDTO(Market entity) {
        return MarketDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .regiao(entity.getRegiao())
                .localizacao(entity.getLocalizacao())
                .deliveryAvailable(entity.getDeliveryAvailable())
                .build();
    }

    private Market toEntity(MarketDTO dto) {
        return Market.builder()
                .nome(dto.getNome())
                .regiao(dto.getRegiao())
                .localizacao(dto.getLocalizacao())
                .deliveryAvailable(dto.getDeliveryAvailable())
                .build();
    }
}
