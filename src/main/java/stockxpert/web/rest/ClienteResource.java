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
import stockxpert.domain.Cliente;
import stockxpert.repository.ClienteRepository;
import stockxpert.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link stockxpert.domain.Cliente}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ClienteResource {

    private final Logger log = LoggerFactory.getLogger(ClienteResource.class);

    private static final String ENTITY_NAME = "cliente";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClienteRepository clienteRepository;

    public ClienteResource(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    /**
     * {@code POST  /clientes} : Create a new cliente.
     *
     * @param cliente the cliente to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new cliente, or with status {@code 400 (Bad Request)} if the cliente has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/clientes")
    public ResponseEntity<Cliente> createCliente(@Valid @RequestBody Cliente cliente) throws URISyntaxException {
        log.debug("REST request to save Cliente : {}", cliente);
        if (cliente.getId() != null) {
            throw new BadRequestAlertException("A new cliente cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Cliente result = clienteRepository.save(cliente);
        return ResponseEntity
            .created(new URI("/api/clientes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /clientes/:id} : Updates an existing cliente.
     *
     * @param id the id of the cliente to save.
     * @param cliente the cliente to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cliente,
     * or with status {@code 400 (Bad Request)} if the cliente is not valid,
     * or with status {@code 500 (Internal Server Error)} if the cliente couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/clientes/{id}")
    public ResponseEntity<Cliente> updateCliente(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Cliente cliente
    ) throws URISyntaxException {
        log.debug("REST request to update Cliente : {}, {}", id, cliente);
        if (cliente.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cliente.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clienteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Cliente result = clienteRepository.save(cliente);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cliente.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /clientes/:id} : Partial updates given fields of an existing cliente, field will ignore if it is null
     *
     * @param id the id of the cliente to save.
     * @param cliente the cliente to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated cliente,
     * or with status {@code 400 (Bad Request)} if the cliente is not valid,
     * or with status {@code 404 (Not Found)} if the cliente is not found,
     * or with status {@code 500 (Internal Server Error)} if the cliente couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/clientes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Cliente> partialUpdateCliente(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Cliente cliente
    ) throws URISyntaxException {
        log.debug("REST request to partial update Cliente partially : {}, {}", id, cliente);
        if (cliente.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, cliente.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!clienteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Cliente> result = clienteRepository
            .findById(cliente.getId())
            .map(existingCliente -> {
                if (cliente.getNome() != null) {
                    existingCliente.setNome(cliente.getNome());
                }
                if (cliente.getCpf() != null) {
                    existingCliente.setCpf(cliente.getCpf());
                }

                return existingCliente;
            })
            .map(clienteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, cliente.getId().toString())
        );
    }

    /**
     * {@code GET  /clientes} : get all the clientes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of clientes in body.
     */
    @GetMapping("/clientes")
    public List<Cliente> getAllClientes() {
        log.debug("REST request to get all Clientes");
        return clienteRepository.findAll();
    }

    /**
     * {@code GET  /clientes/:id} : get the "id" cliente.
     *
     * @param id the id of the cliente to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the cliente, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/clientes/{id}")
    public ResponseEntity<Cliente> getCliente(@PathVariable Long id) {
        log.debug("REST request to get Cliente : {}", id);
        Optional<Cliente> cliente = clienteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(cliente);
    }

    /**
     * {@code DELETE  /clientes/:id} : delete the "id" cliente.
     *
     * @param id the id of the cliente to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/clientes/{id}")
    public ResponseEntity<Void> deleteCliente(@PathVariable Long id) {
        log.debug("REST request to delete Cliente : {}", id);
        clienteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
