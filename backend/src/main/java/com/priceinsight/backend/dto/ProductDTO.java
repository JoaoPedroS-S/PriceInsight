package com.priceinsight.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Long id;

    @NotBlank(message = "O nome do produto é obrigatório")
    private String nome;

    private String marca;

    @NotBlank(message = "A categoria do produto é obrigatória")
    private String categoria;

    private String unidadeMedida;

    private LocalDateTime createdAt;
}
