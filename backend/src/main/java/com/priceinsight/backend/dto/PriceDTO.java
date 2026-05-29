package com.priceinsight.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceDTO {

    private Long id;
    private Double valor;
    private LocalDateTime data;
    private Long productId;
    private String productName;
    private Long marketId;
    private String marketName;
}
