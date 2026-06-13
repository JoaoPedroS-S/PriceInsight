package com.priceinsight.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {

    private Long id;

    @JsonProperty("name")
    @NotBlank(message = "O nome do produto é obrigatório")
    private String nome;

    @JsonProperty("brand")
    private String marca;

    @JsonProperty("category")
    @NotBlank(message = "A categoria do produto é obrigatória")
    private String categoria;

    @JsonProperty("unit")
    private String unidadeMedida;

    @JsonProperty("createdAt")
    private Long createdAt;
}
