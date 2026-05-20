package com.example.springdatarest;

import com.example.springdatarest.modele.Proprietaire;
import com.example.springdatarest.modele.Voiture;
import com.example.springdatarest.repository.ProprietaireRepo;
import com.example.springdatarest.repository.VoitureRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class SpringDataRestApplication {

    @Autowired
    private VoitureRepo repository;

    @Autowired
    private ProprietaireRepo proprietaireRepo;

    public static void main(String[] args) {
        SpringApplication.run(SpringDataRestApplication.class, args);
    }

    @Bean
    CommandLineRunner runner() {
        return args -> {
            Proprietaire proprietaire1 = new Proprietaire("Ali", "Hassan");
            Proprietaire proprietaire2 = new Proprietaire("Najat", "Bani");

            proprietaireRepo.save(proprietaire1);
            proprietaireRepo.save(proprietaire2);

            // ✅ Constructeur sans proprietaire, puis setter
            Voiture v1 = new Voiture("Toyota", "Corolla", "Grise", "A-1-9090", 2018, 95000);
            v1.setProprietaire(proprietaire1);
            repository.save(v1);

            Voiture v2 = new Voiture("Ford", "Fiesta", "Rouge", "A-2-8090", 2015, 90000);
            v2.setProprietaire(proprietaire1);
            repository.save(v2);

            Voiture v3 = new Voiture("Honda", "CRV", "Bleu", "A-3-7090", 2016, 140000);
            v3.setProprietaire(proprietaire2);
            repository.save(v3);

            System.out.println("=== Données de test ajoutées ===");
        };
    }
}