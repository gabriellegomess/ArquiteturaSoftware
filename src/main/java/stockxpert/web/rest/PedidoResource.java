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
import stockxpert.domain.Pedido;
import stockxpert.repository.PedidoRepository;
import stockxpert.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link stockxpert.domain.Pedido}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PedidoResource {

    private final Logger log = LoggerFactory.getLogger(PedidoResource.class);

    private static final String ENTITY_NAME = "pedido";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PedidoRepository pedidoRepository;

    public PedidoResource(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }

    /**
     * {@code POST  /pedidos} : Create a new pedido.
     *
     * @param pedido the pedido to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new pedido, or with status {@code 400 (Bad Request)} if the pedido has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/pedidos")
    public ResponseEntity<Pedido> createPedido(@Valid @RequestBody Pedido pedido) throws URISyntaxException {
        log.debug("REST request to save Pedido : {}", pedido);
        if (pedido.getId() != null) {
            throw new BadRequestAlertException("A new pedido cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Pedido result = pedidoRepository.save(pedido);
        return ResponseEntity
            .created(new URI("/api/pedidos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /pedidos/:id} : Updates an existing pedido.
     *
     * @param id the id of the pedido to save.
     * @param pedido the pedido to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pedido,
     * or with status {@code 400 (Bad Request)} if the pedido is not valid,
     * or with status {@code 500 (Internal Server Error)} if the pedido couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/pedidos/{id}")
    public ResponseEntity<Pedido> updatePedido(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Pedido pedido
    ) throws URISyntaxException {
        log.debug("REST request to update Pedido : {}, {}", id, pedido);
        if (pedido.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pedido.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pedidoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Pedido result = pedidoRepository.save(pedido);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pedido.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /pedidos/:id} : Partial updates given fields of an existing pedido, field will ignore if it is null
     *
     * @param id the id of the pedido to save.
     * @param pedido the pedido to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated pedido,
     * or with status {@code 400 (Bad Request)} if the pedido is not valid,
     * or with status {@code 404 (Not Found)} if the pedido is not found,
     * or with status {@code 500 (Internal Server Error)} if the pedido couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/pedidos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Pedido> partialUpdatePedido(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Pedido pedido
    ) throws URISyntaxException {
        log.debug("REST request to partial update Pedido partially : {}, {}", id, pedido);
        if (pedido.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, pedido.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!pedidoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Pedido> result = pedidoRepository
            .findById(pedido.getId())
            .map(existingPedido -> {
                if (pedido.getDataPedido() != null) {
                    existingPedido.setDataPedido(pedido.getDataPedido());
                }
                if (pedido.getQuantidade() != null) {
                    existingPedido.setQuantidade(pedido.getQuantidade());
                }

                return existingPedido;
            })
            .map(pedidoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, pedido.getId().toString())
        );
    }

    /**
     * {@code GET  /pedidos} : get all the pedidos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of pedidos in body.
     */
    @GetMapping("/pedidos")
    public List<Pedido> getAllPedidos(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Pedidos");
        if (eagerload) {
            return pedidoRepository.findAllWithEagerRelationships();
        } else {
            return pedidoRepository.findAll();
        }
    }

    /**
     * {@code GET  /pedidos/:id} : get the "id" pedido.
     *
     * @param id the id of the pedido to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the pedido, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/pedidos/{id}")
    public ResponseEntity<Pedido> getPedido(@PathVariable Long id) {
        log.debug("REST request to get Pedido : {}", id);
        Optional<Pedido> pedido = pedidoRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(pedido);
    }

    /**
     * {@code DELETE  /pedidos/:id} : delete the "id" pedido.
     *
     * @param id the id of the pedido to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/pedidos/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable Long id) {
        log.debug("REST request to delete Pedido : {}", id);
        pedidoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
