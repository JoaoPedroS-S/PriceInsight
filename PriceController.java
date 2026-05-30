package com.priceinsight.backend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceRequestDTO {

    @NotNull(message = "O preço/valor é obrigatório")
    @Positive(message = "O valor do preço deve ser maior que zero")
    private Double valor;

    @NotNull(message = "O ID do produto associado é obrigatório")
    private Long productId;

    @NotNull(message = "O ID do mercado associado é obrigatório")
    private Long marketId;
}
