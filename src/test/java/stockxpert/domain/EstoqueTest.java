package stockxpert.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import stockxpert.web.rest.TestUtil;

class EstoqueTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Estoque.class);
        Estoque estoque1 = new Estoque();
        estoque1.setId(1L);
        Estoque estoque2 = new Estoque();
        estoque2.setId(estoque1.getId());
        assertThat(estoque1).isEqualTo(estoque2);
        estoque2.setId(2L);
        assertThat(estoque1).isNotEqualTo(estoque2);
        estoque1.setId(null);
        assertThat(estoque1).isNotEqualTo(estoque2);
    }
}
