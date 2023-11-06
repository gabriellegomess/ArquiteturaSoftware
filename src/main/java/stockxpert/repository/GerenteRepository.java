package stockxpert.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import stockxpert.domain.Gerente;

/**
 * Spring Data JPA repository for the Gerente entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GerenteRepository extends JpaRepository<Gerente, Long> {}
