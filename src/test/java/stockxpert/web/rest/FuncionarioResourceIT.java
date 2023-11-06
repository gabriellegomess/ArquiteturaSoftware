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
import stockxpert.domain.Funcionario;
import stockxpert.repository.FuncionarioRepository;

/**
 * Integration tests for the {@link FuncionarioResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FuncionarioResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_CPF = "AAAAAAAAAA";
    private static final String UPDATED_CPF = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_SALARIO = new BigDecimal(1);
    private static final BigDecimal UPDATED_SALARIO = new BigDecimal(2);

    private static final LocalDate DEFAULT_DATA_NASC = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA_NASC = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/funcionarios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFuncionarioMockMvc;

    private Funcionario funcionario;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Funcionario createEntity(EntityManager em) {
        Funcionario funcionario = new Funcionario()
            .nome(DEFAULT_NOME)
            .cpf(DEFAULT_CPF)
            .salario(DEFAULT_SALARIO)
            .dataNasc(DEFAULT_DATA_NASC);
        return funcionario;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Funcionario createUpdatedEntity(EntityManager em) {
        Funcionario funcionario = new Funcionario()
            .nome(UPDATED_NOME)
            .cpf(UPDATED_CPF)
            .salario(UPDATED_SALARIO)
            .dataNasc(UPDATED_DATA_NASC);
        return funcionario;
    }

    @BeforeEach
    public void initTest() {
        funcionario = createEntity(em);
    }

    @Test
    @Transactional
    void createFuncionario() throws Exception {
        int databaseSizeBeforeCreate = funcionarioRepository.findAll().size();
        // Create the Funcionario
        restFuncionarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(funcionario)))
            .andExpect(status().isCreated());

        // Validate the Funcionario in the database
        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeCreate + 1);
        Funcionario testFuncionario = funcionarioList.get(funcionarioList.size() - 1);
        assertThat(testFuncionario.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testFuncionario.getCpf()).isEqualTo(DEFAULT_CPF);
        assertThat(testFuncionario.getSalario()).isEqualByComparingTo(DEFAULT_SALARIO);
        assertThat(testFuncionario.getDataNasc()).isEqualTo(DEFAULT_DATA_NASC);
    }

    @Test
    @Transactional
    void createFuncionarioWithExistingId() throws Exception {
        // Create the Funcionario with an existing ID
        funcionario.setId(1L);

        int databaseSizeBeforeCreate = funcionarioRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFuncionarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(funcionario)))
            .andExpect(status().isBadRequest());

        // Validate the Funcionario in the database
        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = funcionarioRepository.findAll().size();
        // set the field null
        funcionario.setNome(null);

        // Create the Funcionario, which fails.

        restFuncionarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(funcionario)))
            .andExpect(status().isBadRequest());

        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkCpfIsRequired() throws Exception {
        int databaseSizeBeforeTest = funcionarioRepository.findAll().size();
        // set the field null
        funcionario.setCpf(null);

        // Create the Funcionario, which fails.

        restFuncionarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(funcionario)))
            .andExpect(status().isBadRequest());

        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkSalarioIsRequired() throws Exception {
        int databaseSizeBeforeTest = funcionarioRepository.findAll().size();
        // set the field null
        funcionario.setSalario(null);

        // Create the Funcionario, which fails.

        restFuncionarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(funcionario)))
            .andExpect(status().isBadRequest());

        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDataNascIsRequired() throws Exception {
        int databaseSizeBeforeTest = funcionarioRepository.findAll().size();
        // set the field null
        funcionario.setDataNasc(null);

        // Create the Funcionario, which fails.

        restFuncionarioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(funcionario)))
            .andExpect(status().isBadRequest());

        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFuncionarios() throws Exception {
        // Initialize the database
        funcionarioRepository.saveAndFlush(funcionario);

        // Get all the funcionarioList
        restFuncionarioMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(funcionario.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].cpf").value(hasItem(DEFAULT_CPF)))
            .andExpect(jsonPath("$.[*].salario").value(hasItem(sameNumber(DEFAULT_SALARIO))))
            .andExpect(jsonPath("$.[*].dataNasc").value(hasItem(DEFAULT_DATA_NASC.toString())));
    }

    @Test
    @Transactional
    void getFuncionario() throws Exception {
        // Initialize the database
        funcionarioRepository.saveAndFlush(funcionario);

        // Get the funcionario
        restFuncionarioMockMvc
            .perform(get(ENTITY_API_URL_ID, funcionario.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(funcionario.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.cpf").value(DEFAULT_CPF))
            .andExpect(jsonPath("$.salario").value(sameNumber(DEFAULT_SALARIO)))
            .andExpect(jsonPath("$.dataNasc").value(DEFAULT_DATA_NASC.toString()));
    }

    @Test
    @Transactional
    void getNonExistingFuncionario() throws Exception {
        // Get the funcionario
        restFuncionarioMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFuncionario() throws Exception {
        // Initialize the database
        funcionarioRepository.saveAndFlush(funcionario);

        int databaseSizeBeforeUpdate = funcionarioRepository.findAll().size();

        // Update the funcionario
        Funcionario updatedFuncionario = funcionarioRepository.findById(funcionario.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedFuncionario are not directly saved in db
        em.detach(updatedFuncionario);
        updatedFuncionario.nome(UPDATED_NOME).cpf(UPDATED_CPF).salario(UPDATED_SALARIO).dataNasc(UPDATED_DATA_NASC);

        restFuncionarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFuncionario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFuncionario))
            )
            .andExpect(status().isOk());

        // Validate the Funcionario in the database
        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeUpdate);
        Funcionario testFuncionario = funcionarioList.get(funcionarioList.size() - 1);
        assertThat(testFuncionario.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testFuncionario.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testFuncionario.getSalario()).isEqualByComparingTo(UPDATED_SALARIO);
        assertThat(testFuncionario.getDataNasc()).isEqualTo(UPDATED_DATA_NASC);
    }

    @Test
    @Transactional
    void putNonExistingFuncionario() throws Exception {
        int databaseSizeBeforeUpdate = funcionarioRepository.findAll().size();
        funcionario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFuncionarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, funcionario.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(funcionario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Funcionario in the database
        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFuncionario() throws Exception {
        int databaseSizeBeforeUpdate = funcionarioRepository.findAll().size();
        funcionario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFuncionarioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(funcionario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Funcionario in the database
        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFuncionario() throws Exception {
        int databaseSizeBeforeUpdate = funcionarioRepository.findAll().size();
        funcionario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFuncionarioMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(funcionario)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Funcionario in the database
        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFuncionarioWithPatch() throws Exception {
        // Initialize the database
        funcionarioRepository.saveAndFlush(funcionario);

        int databaseSizeBeforeUpdate = funcionarioRepository.findAll().size();

        // Update the funcionario using partial update
        Funcionario partialUpdatedFuncionario = new Funcionario();
        partialUpdatedFuncionario.setId(funcionario.getId());

        partialUpdatedFuncionario.nome(UPDATED_NOME).cpf(UPDATED_CPF).salario(UPDATED_SALARIO);

        restFuncionarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFuncionario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFuncionario))
            )
            .andExpect(status().isOk());

        // Validate the Funcionario in the database
        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeUpdate);
        Funcionario testFuncionario = funcionarioList.get(funcionarioList.size() - 1);
        assertThat(testFuncionario.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testFuncionario.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testFuncionario.getSalario()).isEqualByComparingTo(UPDATED_SALARIO);
        assertThat(testFuncionario.getDataNasc()).isEqualTo(DEFAULT_DATA_NASC);
    }

    @Test
    @Transactional
    void fullUpdateFuncionarioWithPatch() throws Exception {
        // Initialize the database
        funcionarioRepository.saveAndFlush(funcionario);

        int databaseSizeBeforeUpdate = funcionarioRepository.findAll().size();

        // Update the funcionario using partial update
        Funcionario partialUpdatedFuncionario = new Funcionario();
        partialUpdatedFuncionario.setId(funcionario.getId());

        partialUpdatedFuncionario.nome(UPDATED_NOME).cpf(UPDATED_CPF).salario(UPDATED_SALARIO).dataNasc(UPDATED_DATA_NASC);

        restFuncionarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFuncionario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFuncionario))
            )
            .andExpect(status().isOk());

        // Validate the Funcionario in the database
        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeUpdate);
        Funcionario testFuncionario = funcionarioList.get(funcionarioList.size() - 1);
        assertThat(testFuncionario.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testFuncionario.getCpf()).isEqualTo(UPDATED_CPF);
        assertThat(testFuncionario.getSalario()).isEqualByComparingTo(UPDATED_SALARIO);
        assertThat(testFuncionario.getDataNasc()).isEqualTo(UPDATED_DATA_NASC);
    }

    @Test
    @Transactional
    void patchNonExistingFuncionario() throws Exception {
        int databaseSizeBeforeUpdate = funcionarioRepository.findAll().size();
        funcionario.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFuncionarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, funcionario.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(funcionario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Funcionario in the database
        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFuncionario() throws Exception {
        int databaseSizeBeforeUpdate = funcionarioRepository.findAll().size();
        funcionario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFuncionarioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(funcionario))
            )
            .andExpect(status().isBadRequest());

        // Validate the Funcionario in the database
        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFuncionario() throws Exception {
        int databaseSizeBeforeUpdate = funcionarioRepository.findAll().size();
        funcionario.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFuncionarioMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(funcionario))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Funcionario in the database
        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFuncionario() throws Exception {
        // Initialize the database
        funcionarioRepository.saveAndFlush(funcionario);

        int databaseSizeBeforeDelete = funcionarioRepository.findAll().size();

        // Delete the funcionario
        restFuncionarioMockMvc
            .perform(delete(ENTITY_API_URL_ID, funcionario.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Funcionario> funcionarioList = funcionarioRepository.findAll();
        assertThat(funcionarioList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
