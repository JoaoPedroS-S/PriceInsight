package com.priceinsight.backend.controller;

import com.priceinsight.backend.dto.PriceDTO;
import com.priceinsight.backend.dto.PriceRequestDTO;
import com.priceinsight.backend.service.PriceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/prices", "/api/prices"})
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PriceController {

    private final PriceService priceService;

    @GetMapping
    public ResponseEntity<List<PriceDTO>> getAll() {
        return ResponseEntity.ok(priceService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PriceDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(priceService.findById(id));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<PriceDTO>> getByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(priceService.findByProductId(productId));
    }

    @PostMapping
    public ResponseEntity<PriceDTO> create(@Valid @RequestBody PriceRequestDTO dto) {
        PriceDTO created = priceService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PriceDTO> update(@PathVariable Long id, @Valid @RequestBody PriceRequestDTO dto) {
        return ResponseEntity.ok(priceService.update(id, dto));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PriceDTO> patch(@PathVariable Long id, @Valid @RequestBody PriceRequestDTO dto) {
        // Supporting PATCH as well to map standard frontend update calls
        return ResponseEntity.ok(priceService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        priceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
