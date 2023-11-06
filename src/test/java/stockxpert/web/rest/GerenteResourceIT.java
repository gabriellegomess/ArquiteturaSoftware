package stockxpert.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static stockxpert.web.rest.TestUtil.sameNumber;

import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import stockxpert.IntegrationTest;
import stockxpert.domain.Gerente;
import stockxpert.repository.GerenteRepository;

/**
 * Integration tests for the {@link GerenteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class GerenteResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_CPF = "AAAAAAAAAA";
    private static final String UPDATED_CPF = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_SALARIO = new BigDecimal(1);
    private static final BigDecimal UPDATED_SALARIO = new BigDecimal(2);

    private static final LocalDate DEFAULT_DATA_NASC = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_NASC = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/gerentes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GerenteRepository gerenteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGerenteMockMvc;

    private Gerente gerente;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gerente createEntity(EntityManager em) {
        Gerente gerente = new Gerente().nome(DEFAULT_NOME).cpf(DEFAULT_CPF).salario(DEFAULT_SALARIO).dataNasc(DEFAULT_DATA_NASC);
        return gerente;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Gerente createUpdatedEntity(EntityManager em) {
        Gerente gerente = new Gerente().nome(UPDATED_NOME).cpf(UPDATED_CPF).salario(UPDATED_SALARIO).dataNasc(UPDATED_DATA_NASC);
        return gerente;
    }

    @BeforeEach
    public void initTest() {
        gerente = createEntity(em);
    }

    @Test
    @Transactional
    void createGerente() throws Exception {
        int databaseSizeBeforeCreate = gerenteRepository.findAll().size();
        // Create the Gerente
        restGerenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gerente)))
            .andExpect(status().isCreated());

        // Validate the Gerente in the database
        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeCreate + 1);
        Gerente testGerente = gerenteList.get(gerenteList.size() - 1);
        assertThat(testGerente.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testGerente.getCpf()).isEqualTo(DEFAULT_CPF);
        assertThat(testGerente.getSalario()).isEqualByComparingTo(DEFAULT_SALARIO);
        assertThat(testGerente.getDataNasc()).isEqualTo(DEFAULT_DATA_NASC);
    }

    @Test
    @Transactional
    void createGerenteWithExistingId() throws Exception {
        // Create the Gerente with an existing ID
        gerente.setId(1L);

        int databaseSizeBeforeCreate = gerenteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGerenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gerente)))
            .andExpect(status().isBadRequest());

        // Validate the Gerente in the database
        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = gerenteRepository.findAll().size();
        // set the field null
        gerente.setNome(null);

        // Create the Gerente, which fails.

        restGerenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gerente)))
            .andExpect(status().isBadRequest());

        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCpfIsRequired() throws Exception {
        int databaseSizeBeforeTest = gerenteRepository.findAll().size();
        // set the field null
        gerente.setCpf(null);

        // Create the Gerente, which fails.

        restGerenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gerente)))
            .andExpect(status().isBadRequest());

        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSalarioIsRequired() throws Exception {
        int databaseSizeBeforeTest = gerenteRepository.findAll().size();
        // set the field null
        gerente.setSalario(null);

        // Create the Gerente, which fails.

        restGerenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gerente)))
            .andExpect(status().isBadRequest());

        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDataNascIsRequired() throws Exception {
        int databaseSizeBeforeTest = gerenteRepository.findAll().size();
        // set the field null
        gerente.setDataNasc(null);

        // Create the Gerente, which fails.

        restGerenteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gerente)))
            .andExpect(status().isBadRequest());

        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllGerentes() throws Exception {
        // Initialize the database
        gerenteRepository.saveAndFlush(gerente);

        // Get all the gerenteList
        restGerenteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gerente.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].cpf").value(hasItem(DEFAULT_CPF)))
            .andExpect(jsonPath("$.[*].salario").value(hasItem(sameNumber(DEFAULT_SALARIO))))
            .andExpect(jsonPath("$.[*].dataNasc").value(hasItem(DEFAULT_DATA_NASC.toString())));
    }

    @Test
    @Transactional
    void getGerente() throws Exception {
        // Initialize the database
        gerenteRepository.saveAndFlush(gerente);

        // Get the gerente
        restGerenteMockMvc
            .perform(get(ENTITY_API_URL_ID, gerente.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(gerente.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.cpf").value(DEFAULT_CPF))
            .andExpect(jsonPath("$.salario").value(sameNumber(DEFAULT_SALARIO)))
            .andExpect(jsonPath("$.dataNasc").value(DEFAULT_DATA_NASC.toString()));
    }

    @Test
    @Transactional
    void getNonExistingGerente() throws Exception {
        // Get the gerente
        restGerenteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGerente() throws Exception {
        // Initialize the database
        gerenteRepository.saveAndFlush(gerente);

        int databaseSizeBeforeUpdate = gerenteRepository.findAll().size();

        // Update the gerente
        Gerente updatedGerente = gerenteRepository.findById(gerente.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedGerente are not directly saved in db
        em.detach(updatedGerente);
        updatedGerente.nome(UPDATED_NOME).cpf(UPDATED_CPF).salario(UPDATED_SALARIO).dataNasc(UPDATED_DATA_NASC);

        restGerenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGerente.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGerente))
            )
            .andExpect(status().isOk());

        // Validate the Gerente in the database
        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeUpdate);
        Gerente testGerente = gerenteList.get(gerenteList.size() - 1);
        assertThat(testGerente.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testGerente.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testGerente.getSalario()).isEqualByComparingTo(UPDATED_SALARIO);
        assertThat(testGerente.getDataNasc()).isEqualTo(UPDATED_DATA_NASC);
    }

    @Test
    @Transactional
    void putNonExistingGerente() throws Exception {
        int databaseSizeBeforeUpdate = gerenteRepository.findAll().size();
        gerente.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGerenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gerente.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gerente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gerente in the database
        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGerente() throws Exception {
        int databaseSizeBeforeUpdate = gerenteRepository.findAll().size();
        gerente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGerenteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gerente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gerente in the database
        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGerente() throws Exception {
        int databaseSizeBeforeUpdate = gerenteRepository.findAll().size();
        gerente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGerenteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gerente)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Gerente in the database
        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGerenteWithPatch() throws Exception {
        // Initialize the database
        gerenteRepository.saveAndFlush(gerente);

        int databaseSizeBeforeUpdate = gerenteRepository.findAll().size();

        // Update the gerente using partial update
        Gerente partialUpdatedGerente = new Gerente();
        partialUpdatedGerente.setId(gerente.getId());

        partialUpdatedGerente.cpf(UPDATED_CPF).salario(UPDATED_SALARIO);

        restGerenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGerente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGerente))
            )
            .andExpect(status().isOk());

        // Validate the Gerente in the database
        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeUpdate);
        Gerente testGerente = gerenteList.get(gerenteList.size() - 1);
        assertThat(testGerente.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testGerente.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testGerente.getSalario()).isEqualByComparingTo(UPDATED_SALARIO);
        assertThat(testGerente.getDataNasc()).isEqualTo(DEFAULT_DATA_NASC);
    }

    @Test
    @Transactional
    void fullUpdateGerenteWithPatch() throws Exception {
        // Initialize the database
        gerenteRepository.saveAndFlush(gerente);

        int databaseSizeBeforeUpdate = gerenteRepository.findAll().size();

        // Update the gerente using partial update
        Gerente partialUpdatedGerente = new Gerente();
        partialUpdatedGerente.setId(gerente.getId());

        partialUpdatedGerente.nome(UPDATED_NOME).cpf(UPDATED_CPF).salario(UPDATED_SALARIO).dataNasc(UPDATED_DATA_NASC);

        restGerenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGerente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGerente))
            )
            .andExpect(status().isOk());

        // Validate the Gerente in the database
        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeUpdate);
        Gerente testGerente = gerenteList.get(gerenteList.size() - 1);
        assertThat(testGerente.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testGerente.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testGerente.getSalario()).isEqualByComparingTo(UPDATED_SALARIO);
        assertThat(testGerente.getDataNasc()).isEqualTo(UPDATED_DATA_NASC);
    }

    @Test
    @Transactional
    void patchNonExistingGerente() throws Exception {
        int databaseSizeBeforeUpdate = gerenteRepository.findAll().size();
        gerente.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGerenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, gerente.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gerente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gerente in the database
        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGerente() throws Exception {
        int databaseSizeBeforeUpdate = gerenteRepository.findAll().size();
        gerente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGerenteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gerente))
            )
            .andExpect(status().isBadRequest());

        // Validate the Gerente in the database
        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGerente() throws Exception {
        int databaseSizeBeforeUpdate = gerenteRepository.findAll().size();
        gerente.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGerenteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(gerente)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Gerente in the database
        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGerente() throws Exception {
        // Initialize the database
        gerenteRepository.saveAndFlush(gerente);

        int databaseSizeBeforeDelete = gerenteRepository.findAll().size();

        // Delete the gerente
        restGerenteMockMvc
            .perform(delete(ENTITY_API_URL_ID, gerente.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Gerente> gerenteList = gerenteRepository.findAll();
        assertThat(gerenteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
