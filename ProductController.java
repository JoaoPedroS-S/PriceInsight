package com.priceinsight.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketDTO {

    private Long id;

    @NotBlank(message = "O nome do mercado é obrigatório")
    private String nome;

    @NotBlank(message = "A região é obrigatória")
    private String regiao;

    @NotBlank(message = "A localização/endereço é obrigatória")
    private String localizacao;

    @NotNull(message = "A disponibilidade de entrega é obrigatória")
    private Boolean deliveryAvailable;
}
