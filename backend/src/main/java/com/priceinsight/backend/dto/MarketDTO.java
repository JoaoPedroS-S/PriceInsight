package com.priceinsight.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketDTO {

    private Long id;

    @JsonProperty("name")
    @NotBlank(message = "O nome do mercado é obrigatório")
    private String nome;

    @JsonProperty("region")
    @NotBlank(message = "A região é obrigatória")
    private String regiao;

    @JsonProperty("location")
    @NotBlank(message = "A localização/endereço é obrigatória")
    private String localizacao;

    @JsonProperty("deliveryAvailable")
    @NotNull(message = "A disponibilidade de entrega é obrigatória")
    private Boolean deliveryAvailable;
}
