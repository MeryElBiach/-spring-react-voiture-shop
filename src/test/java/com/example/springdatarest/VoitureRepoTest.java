package com.example.springdatarest;

import static org.assertj.core.api.Assertions.assertThat;
import com.example.springdatarest.modele.Voiture;
import com.example.springdatarest.repository.VoitureRepo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.jpa.properties.hibernate.dialect="
})
public class VoitureRepoTest {

    @MockitoBean
    private CommandLineRunner runner;

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    VoitureRepo voitureRepo;

    @Test
    public void ajouterVoiture() {
        Voiture voiture = new Voiture("MiolaCar", "Uber", "Blanche", "M-2020", 2021, 180000);
        entityManager.persistAndFlush(voiture);
        assertThat(voiture.getId()).isNotNull();
    }

    @Test
    public void supprimerVoiture() {
        entityManager.persistAndFlush(
                new Voiture("MiolaCar", "Uber", "Blanche", "M-2020", 2021, 180000)
        );
        entityManager.persistAndFlush(
                new Voiture("MiniCooper", "Uber", "Rouge", "C-2020", 2021, 180000)
        );
        voitureRepo.deleteAll();
        assertThat(voitureRepo.findAll()).isEmpty();
    }
}