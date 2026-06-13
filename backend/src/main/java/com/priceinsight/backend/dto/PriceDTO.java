package com.priceinsight.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceDTO {

    private Long id;

    @JsonProperty("price")
    private Double valor;

    @JsonProperty("date")
    private Long data;

    @JsonProperty("productId")
    private Long productId;

    @JsonProperty("productName")
    private String productName;

    @JsonProperty("marketId")
    private Long marketId;

    @JsonProperty("marketName")
    private String marketName;

    @JsonProperty("isPromotion")
    private Boolean isPromotion;

    @JsonProperty("promotionDetails")
    private String promotionDetails;
}
