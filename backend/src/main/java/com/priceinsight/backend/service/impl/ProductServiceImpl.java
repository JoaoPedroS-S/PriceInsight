package com.priceinsight.backend.service.impl;

import com.priceinsight.backend.dto.ProductDTO;
import com.priceinsight.backend.exception.BusinessException;
import com.priceinsight.backend.exception.ResourceNotFoundException;
import com.priceinsight.backend.model.Product;
import com.priceinsight.backend.repository.ProductRepository;
import com.priceinsight.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> findAll() {
        return productRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado"));
        return toDTO(product);
    }

    @Override
    @Transactional
    public ProductDTO create(ProductDTO dto) {
        if (productRepository.existsByNomeIgnoreCase(dto.getNome())) {
            throw new BusinessException("Já existe um produto cadastrado com o nome: " + dto.getNome());
        }
        Product product = toEntity(dto);
        Product savedProduct = productRepository.save(product);
        return toDTO(savedProduct);
    }

    @Override
    @Transactional
    public ProductDTO update(Long id, ProductDTO dto) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado"));

        if (!existingProduct.getNome().equalsIgnoreCase(dto.getNome()) && 
            productRepository.existsByNomeIgnoreCase(dto.getNome())) {
            throw new BusinessException("Já existe outro produto cadastrado com o nome: " + dto.getNome());
        }

        existingProduct.setNome(dto.getNome());
        existingProduct.setMarca(dto.getMarca());
        existingProduct.setCategoria(dto.getCategoria());
        existingProduct.setUnidadeMedida(dto.getUnidadeMedida());

        Product updatedProduct = productRepository.save(existingProduct);
        return toDTO(updatedProduct);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produto com ID " + id + " não encontrado");
        }
        productRepository.deleteById(id);
    }

    // Manual Object Mappings
    private ProductDTO toDTO(Product entity) {
        Long createdAtMillis = null;
        if (entity.getCreatedAt() != null) {
            createdAtMillis = entity.getCreatedAt()
                    .atZone(java.time.ZoneId.systemDefault())
                    .toInstant()
                    .toEpochMilli();
        }
        return ProductDTO.builder()
                .id(entity.getId())
                .nome(entity.getNome())
                .marca(entity.getMarca())
                .categoria(entity.getCategoria())
                .unidadeMedida(entity.getUnidadeMedida())
                .createdAt(createdAtMillis)
                .build();
    }

    private Product toEntity(ProductDTO dto) {
        return Product.builder()
                .nome(dto.getNome())
                .marca(dto.getMarca())
                .categoria(dto.getCategoria())
                .unidadeMedida(dto.getUnidadeMedida())
                .build();
    }
}
