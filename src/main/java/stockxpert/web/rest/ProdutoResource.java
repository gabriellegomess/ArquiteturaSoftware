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
import stockxpert.domain.Produto;
import stockxpert.repository.ProdutoRepository;
import stockxpert.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link stockxpert.domain.Produto}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProdutoResource {

    private final Logger log = LoggerFactory.getLogger(ProdutoResource.class);

    private static final String ENTITY_NAME = "produto";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProdutoRepository produtoRepository;

    public ProdutoResource(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    /**
     * {@code POST  /produtos} : Create a new produto.
     *
     * @param produto the produto to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new produto, or with status {@code 400 (Bad Request)} if the produto has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/produtos")
    public ResponseEntity<Produto> createProduto(@Valid @RequestBody Produto produto) throws URISyntaxException {
        log.debug("REST request to save Produto : {}", produto);
        if (produto.getId() != null) {
            throw new BadRequestAlertException("A new produto cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Produto result = produtoRepository.save(produto);
        return ResponseEntity
            .created(new URI("/api/produtos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /produtos/:id} : Updates an existing produto.
     *
     * @param id the id of the produto to save.
     * @param produto the produto to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated produto,
     * or with status {@code 400 (Bad Request)} if the produto is not valid,
     * or with status {@code 500 (Internal Server Error)} if the produto couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/produtos/{id}")
    public ResponseEntity<Produto> updateProduto(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Produto produto
    ) throws URISyntaxException {
        log.debug("REST request to update Produto : {}, {}", id, produto);
        if (produto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, produto.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!produtoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Produto result = produtoRepository.save(produto);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, produto.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /produtos/:id} : Partial updates given fields of an existing produto, field will ignore if it is null
     *
     * @param id the id of the produto to save.
     * @param produto the produto to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated produto,
     * or with status {@code 400 (Bad Request)} if the produto is not valid,
     * or with status {@code 404 (Not Found)} if the produto is not found,
     * or with status {@code 500 (Internal Server Error)} if the produto couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/produtos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Produto> partialUpdateProduto(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Produto produto
    ) throws URISyntaxException {
        log.debug("REST request to partial update Produto partially : {}, {}", id, produto);
        if (produto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, produto.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!produtoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Produto> result = produtoRepository
            .findById(produto.getId())
            .map(existingProduto -> {
                if (produto.getNome() != null) {
                    existingProduto.setNome(produto.getNome());
                }
                if (produto.getPreco() != null) {
                    existingProduto.setPreco(produto.getPreco());
                }
                if (produto.getDescricao() != null) {
                    existingProduto.setDescricao(produto.getDescricao());
                }
                if (produto.getCodBarra() != null) {
                    existingProduto.setCodBarra(produto.getCodBarra());
                }

                return existingProduto;
            })
            .map(produtoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, produto.getId().toString())
        );
    }

    /**
     * {@code GET  /produtos} : get all the produtos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of produtos in body.
     */
    @GetMapping("/produtos")
    public List<Produto> getAllProdutos() {
        log.debug("REST request to get all Produtos");
        return produtoRepository.findAll();
    }

    /**
     * {@code GET  /produtos/:id} : get the "id" produto.
     *
     * @param id the id of the produto to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the produto, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/produtos/{id}")
    public ResponseEntity<Produto> getProduto(@PathVariable Long id) {
        log.debug("REST request to get Produto : {}", id);
        Optional<Produto> produto = produtoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(produto);
    }

    /**
     * {@code DELETE  /produtos/:id} : delete the "id" produto.
     *
     * @param id the id of the produto to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/produtos/{id}")
    public ResponseEntity<Void> deleteProduto(@PathVariable Long id) {
        log.debug("REST request to delete Produto : {}", id);
        produtoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
