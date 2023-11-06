package stockxpert.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import stockxpert.domain.Pedido;

public interface PedidoRepositoryWithBagRelationships {
    Optional<Pedido> fetchBagRelationships(Optional<Pedido> pedido);

    List<Pedido> fetchBagRelationships(List<Pedido> pedidos);

    Page<Pedido> fetchBagRelationships(Page<Pedido> pedidos);
}
