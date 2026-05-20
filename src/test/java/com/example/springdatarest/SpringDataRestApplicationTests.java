package com.example.springdatarest;

import static org.assertj.core.api.Assertions.assertThat;
import com.example.springdatarest.web.VoitureController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SpringDataRestApplicationTests {

    @Autowired
    VoitureController voitureController;

    @Test
    void contextLoads() {
        assertThat(voitureController).isNotNull();
    }
}