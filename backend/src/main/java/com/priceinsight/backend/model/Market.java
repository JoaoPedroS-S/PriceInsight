package com.priceinsight.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tb_markets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Market {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String nome;

    @Column(nullable = false, length = 100)
    private String regiao;

    @Column(nullable = false, length = 255)
    private String localizacao;

    @Column(name = "delivery_available", nullable = false)
    private Boolean deliveryAvailable;

    @OneToMany(mappedBy = "mercado", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Preco> precos = new ArrayList<>();
}
