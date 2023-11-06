package stockxpert.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import stockxpert.web.rest.TestUtil;

class GerenteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Gerente.class);
        Gerente gerente1 = new Gerente();
        gerente1.setId(1L);
        Gerente gerente2 = new Gerente();
        gerente2.setId(gerente1.getId());
        assertThat(gerente1).isEqualTo(gerente2);
        gerente2.setId(2L);
        assertThat(gerente1).isNotEqualTo(gerente2);
        gerente1.setId(null);
        assertThat(gerente1).isNotEqualTo(gerente2);
    }
}
