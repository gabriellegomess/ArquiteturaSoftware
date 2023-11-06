package stockxpert.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import stockxpert.domain.Produto;

/**
 * Spring Data JPA repository for the Produto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {}
