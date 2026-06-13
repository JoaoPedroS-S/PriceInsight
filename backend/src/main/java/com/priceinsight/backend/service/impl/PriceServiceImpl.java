package com.priceinsight.backend.service.impl;

import com.priceinsight.backend.dto.PriceDTO;
import com.priceinsight.backend.dto.PriceRequestDTO;
import com.priceinsight.backend.exception.ResourceNotFoundException;
import com.priceinsight.backend.model.Market;
import com.priceinsight.backend.model.Preco;
import com.priceinsight.backend.model.Product;
import com.priceinsight.backend.repository.MarketRepository;
import com.priceinsight.backend.repository.PriceRepository;
import com.priceinsight.backend.repository.ProductRepository;
import com.priceinsight.backend.service.PriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PriceServiceImpl implements PriceService {

    private final PriceRepository priceRepository;
    private final ProductRepository productRepository;
    private final MarketRepository marketRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PriceDTO> findAll() {
        return priceRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PriceDTO findById(Long id) {
        Preco preco = priceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro de Preço com ID " + id + " não encontrado"));
        return toDTO(preco);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PriceDTO> findByProductId(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Produto com ID " + productId + " não encontrado");
        }
        return priceRepository.findByProdutoId(productId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PriceDTO create(PriceRequestDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + dto.getProductId() + " não encontrado"));

        Market market = marketRepository.findById(dto.getMarketId())
                .orElseThrow(() -> new ResourceNotFoundException("Mercado com ID " + dto.getMarketId() + " não encontrado"));

        Preco preco = Preco.builder()
                .valor(dto.getValor())
                .produto(product)
                .mercado(market)
                .data(LocalDateTime.now())
                .isPromotion(dto.getIsPromotion() != null ? dto.getIsPromotion() : false)
                .promotionDetails(dto.getPromotionDetails())
                .build();

        Preco savedPreco = priceRepository.save(preco);
        return toDTO(savedPreco);
    }

    @Override
    @Transactional
    public PriceDTO update(Long id, PriceRequestDTO dto) {
        Preco existingPreco = priceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Registro de Preço com ID " + id + " não encontrado"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + dto.getProductId() + " não encontrado"));

        Market market = marketRepository.findById(dto.getMarketId())
                .orElseThrow(() -> new ResourceNotFoundException("Mercado com ID " + dto.getMarketId() + " não encontrado"));

        existingPreco.setValor(dto.getValor());
        existingPreco.setProduto(product);
        existingPreco.setMercado(market);
        existingPreco.setData(LocalDateTime.now()); // Update time of registration
        existingPreco.setIsPromotion(dto.getIsPromotion() != null ? dto.getIsPromotion() : false);
        existingPreco.setPromotionDetails(dto.getPromotionDetails());

        Preco updatedPreco = priceRepository.save(existingPreco);
        return toDTO(updatedPreco);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!priceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Registro de Preço com ID " + id + " não encontrado");
        }
        priceRepository.deleteById(id);
    }

    // Mapping Entity to DTO
    private PriceDTO toDTO(Preco entity) {
        Long dateMillis = null;
        if (entity.getData() != null) {
            dateMillis = entity.getData()
                    .atZone(java.time.ZoneId.systemDefault())
                    .toInstant()
                    .toEpochMilli();
        }
        return PriceDTO.builder()
                .id(entity.getId())
                .valor(entity.getValor())
                .data(dateMillis)
                .productId(entity.getProduto() != null ? entity.getProduto().getId() : null)
                .productName(entity.getProduto() != null ? entity.getProduto().getNome() : null)
                .marketId(entity.getMercado() != null ? entity.getMercado().getId() : null)
                .marketName(entity.getMercado() != null ? entity.getMercado().getNome() : null)
                .isPromotion(entity.getIsPromotion() != null ? entity.getIsPromotion() : false)
                .promotionDetails(entity.getPromotionDetails())
                .build();
    }
}
