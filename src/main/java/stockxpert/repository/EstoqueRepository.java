package stockxpert.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import stockxpert.domain.Estoque;

/**
 * Spring Data JPA repository for the Estoque entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, Long> {}
