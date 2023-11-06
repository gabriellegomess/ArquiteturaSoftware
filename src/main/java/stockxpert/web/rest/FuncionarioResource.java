package stockxpert.web.rest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import stockxpert.domain.Funcionario;
import stockxpert.repository.FuncionarioRepository;
import stockxpert.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link stockxpert.domain.Funcionario}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FuncionarioResource {

    private final Logger log = LoggerFactory.getLogger(FuncionarioResource.class);

    private static final String ENTITY_NAME = "funcionario";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FuncionarioRepository funcionarioRepository;

    public FuncionarioResource(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    /**
     * {@code POST  /funcionarios} : Create a new funcionario.
     *
     * @param funcionario the funcionario to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new funcionario, or with status {@code 400 (Bad Request)} if the funcionario has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/funcionarios")
    public ResponseEntity<Funcionario> createFuncionario(@Valid @RequestBody Funcionario funcionario) throws URISyntaxException {
        log.debug("REST request to save Funcionario : {}", funcionario);
        if (funcionario.getId() != null) {
            throw new BadRequestAlertException("A new funcionario cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Funcionario result = funcionarioRepository.save(funcionario);
        return ResponseEntity
            .created(new URI("/api/funcionarios/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /funcionarios/:id} : Updates an existing funcionario.
     *
     * @param id the id of the funcionario to save.
     * @param funcionario the funcionario to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated funcionario,
     * or with status {@code 400 (Bad Request)} if the funcionario is not valid,
     * or with status {@code 500 (Internal Server Error)} if the funcionario couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/funcionarios/{id}")
    public ResponseEntity<Funcionario> updateFuncionario(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Funcionario funcionario
    ) throws URISyntaxException {
        log.debug("REST request to update Funcionario : {}, {}", id, funcionario);
        if (funcionario.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, funcionario.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!funcionarioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Funcionario result = funcionarioRepository.save(funcionario);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, funcionario.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /funcionarios/:id} : Partial updates given fields of an existing funcionario, field will ignore if it is null
     *
     * @param id the id of the funcionario to save.
     * @param funcionario the funcionario to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated funcionario,
     * or with status {@code 400 (Bad Request)} if the funcionario is not valid,
     * or with status {@code 404 (Not Found)} if the funcionario is not found,
     * or with status {@code 500 (Internal Server Error)} if the funcionario couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/funcionarios/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Funcionario> partialUpdateFuncionario(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Funcionario funcionario
    ) throws URISyntaxException {
        log.debug("REST request to partial update Funcionario partially : {}, {}", id, funcionario);
        if (funcionario.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, funcionario.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!funcionarioRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Funcionario> result = funcionarioRepository
            .findById(funcionario.getId())
            .map(existingFuncionario -> {
                if (funcionario.getNome() != null) {
                    existingFuncionario.setNome(funcionario.getNome());
                }
                if (funcionario.getCpf() != null) {
                    existingFuncionario.setCpf(funcionario.getCpf());
                }
                if (funcionario.getSalario() != null) {
                    existingFuncionario.setSalario(funcionario.getSalario());
                }
                if (funcionario.getDataNasc() != null) {
                    existingFuncionario.setDataNasc(funcionario.getDataNasc());
                }

                return existingFuncionario;
            })
            .map(funcionarioRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, funcionario.getId().toString())
        );
    }

    /**
     * {@code GET  /funcionarios} : get all the funcionarios.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of funcionarios in body.
     */
    @GetMapping("/funcionarios")
    public List<Funcionario> getAllFuncionarios() {
        log.debug("REST request to get all Funcionarios");
        return funcionarioRepository.findAll();
    }

    /**
     * {@code GET  /funcionarios/:id} : get the "id" funcionario.
     *
     * @param id the id of the funcionario to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the funcionario, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/funcionarios/{id}")
    public ResponseEntity<Funcionario> getFuncionario(@PathVariable Long id) {
        log.debug("REST request to get Funcionario : {}", id);
        Optional<Funcionario> funcionario = funcionarioRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(funcionario);
    }

    /**
     * {@code DELETE  /funcionarios/:id} : delete the "id" funcionario.
     *
     * @param id the id of the funcionario to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/funcionarios/{id}")
    public ResponseEntity<Void> deleteFuncionario(@PathVariable Long id) {
        log.debug("REST request to delete Funcionario : {}", id);
        funcionarioRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
