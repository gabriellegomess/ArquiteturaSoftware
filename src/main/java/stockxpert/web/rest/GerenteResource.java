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
import stockxpert.domain.Gerente;
import stockxpert.repository.GerenteRepository;
import stockxpert.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link stockxpert.domain.Gerente}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class GerenteResource {

    private final Logger log = LoggerFactory.getLogger(GerenteResource.class);

    private static final String ENTITY_NAME = "gerente";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final GerenteRepository gerenteRepository;

    public GerenteResource(GerenteRepository gerenteRepository) {
        this.gerenteRepository = gerenteRepository;
    }

    /**
     * {@code POST  /gerentes} : Create a new gerente.
     *
     * @param gerente the gerente to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new gerente, or with status {@code 400 (Bad Request)} if the gerente has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/gerentes")
    public ResponseEntity<Gerente> createGerente(@Valid @RequestBody Gerente gerente) throws URISyntaxException {
        log.debug("REST request to save Gerente : {}", gerente);
        if (gerente.getId() != null) {
            throw new BadRequestAlertException("A new gerente cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Gerente result = gerenteRepository.save(gerente);
        return ResponseEntity
            .created(new URI("/api/gerentes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /gerentes/:id} : Updates an existing gerente.
     *
     * @param id the id of the gerente to save.
     * @param gerente the gerente to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gerente,
     * or with status {@code 400 (Bad Request)} if the gerente is not valid,
     * or with status {@code 500 (Internal Server Error)} if the gerente couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/gerentes/{id}")
    public ResponseEntity<Gerente> updateGerente(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Gerente gerente
    ) throws URISyntaxException {
        log.debug("REST request to update Gerente : {}, {}", id, gerente);
        if (gerente.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gerente.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gerenteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Gerente result = gerenteRepository.save(gerente);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gerente.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /gerentes/:id} : Partial updates given fields of an existing gerente, field will ignore if it is null
     *
     * @param id the id of the gerente to save.
     * @param gerente the gerente to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated gerente,
     * or with status {@code 400 (Bad Request)} if the gerente is not valid,
     * or with status {@code 404 (Not Found)} if the gerente is not found,
     * or with status {@code 500 (Internal Server Error)} if the gerente couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/gerentes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Gerente> partialUpdateGerente(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Gerente gerente
    ) throws URISyntaxException {
        log.debug("REST request to partial update Gerente partially : {}, {}", id, gerente);
        if (gerente.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, gerente.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!gerenteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Gerente> result = gerenteRepository
            .findById(gerente.getId())
            .map(existingGerente -> {
                if (gerente.getNome() != null) {
                    existingGerente.setNome(gerente.getNome());
                }
                if (gerente.getCpf() != null) {
                    existingGerente.setCpf(gerente.getCpf());
                }
                if (gerente.getSalario() != null) {
                    existingGerente.setSalario(gerente.getSalario());
                }
                if (gerente.getDataNasc() != null) {
                    existingGerente.setDataNasc(gerente.getDataNasc());
                }

                return existingGerente;
            })
            .map(gerenteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, gerente.getId().toString())
        );
    }

    /**
     * {@code GET  /gerentes} : get all the gerentes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of gerentes in body.
     */
    @GetMapping("/gerentes")
    public List<Gerente> getAllGerentes() {
        log.debug("REST request to get all Gerentes");
        return gerenteRepository.findAll();
    }

    /**
     * {@code GET  /gerentes/:id} : get the "id" gerente.
     *
     * @param id the id of the gerente to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the gerente, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/gerentes/{id}")
    public ResponseEntity<Gerente> getGerente(@PathVariable Long id) {
        log.debug("REST request to get Gerente : {}", id);
        Optional<Gerente> gerente = gerenteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(gerente);
    }

    /**
     * {@code DELETE  /gerentes/:id} : delete the "id" gerente.
     *
     * @param id the id of the gerente to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/gerentes/{id}")
    public ResponseEntity<Void> deleteGerente(@PathVariable Long id) {
        log.debug("REST request to delete Gerente : {}", id);
        gerenteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
