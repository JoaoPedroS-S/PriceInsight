package com.priceinsight.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_prices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Preco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double valor;

    @Column(nullable = false)
    private LocalDateTime data;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product produto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "market_id", nullable = false)
    private Market mercado;

    @PrePersist
    protected void onCreate() {
        if (this.data == null) {
            this.data = LocalDateTime.now();
        }
    }
}
