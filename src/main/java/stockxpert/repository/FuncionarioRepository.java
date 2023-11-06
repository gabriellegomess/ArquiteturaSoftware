package stockxpert.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import stockxpert.domain.Funcionario;

/**
 * Spring Data JPA repository for the Funcionario entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {}
