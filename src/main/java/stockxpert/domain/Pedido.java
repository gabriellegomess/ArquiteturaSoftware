package stockxpert.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pedido.
 */
@Entity
@Table(name = "pedido")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Pedido implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "data_pedido", nullable = false)
    private Instant dataPedido;

    @NotNull
    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    @ManyToOne(fetch = FetchType.LAZY)
    private Cliente cliente;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_pedido__produto",
        joinColumns = @JoinColumn(name = "pedido_id"),
        inverseJoinColumns = @JoinColumn(name = "produto_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "estoque", "pedidos" }, allowSetters = true)
    private Set<Produto> produtos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Pedido id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDataPedido() {
        return this.dataPedido;
    }

    public Pedido dataPedido(Instant dataPedido) {
        this.setDataPedido(dataPedido);
        return this;
    }

    public void setDataPedido(Instant dataPedido) {
        this.dataPedido = dataPedido;
    }

    public Integer getQuantidade() {
        return this.quantidade;
    }

    public Pedido quantidade(Integer quantidade) {
        this.setQuantidade(quantidade);
        return this;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Cliente getCliente() {
        return this.cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Pedido cliente(Cliente cliente) {
        this.setCliente(cliente);
        return this;
    }

    public Set<Produto> getProdutos() {
        return this.produtos;
    }

    public void setProdutos(Set<Produto> produtos) {
        this.produtos = produtos;
    }

    public Pedido produtos(Set<Produto> produtos) {
        this.setProdutos(produtos);
        return this;
    }

    public Pedido addProduto(Produto produto) {
        this.produtos.add(produto);
        produto.getPedidos().add(this);
        return this;
    }

    public Pedido removeProduto(Produto produto) {
        this.produtos.remove(produto);
        produto.getPedidos().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pedido)) {
            return false;
        }
        return getId() != null && getId().equals(((Pedido) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pedido{" +
            "id=" + getId() +
            ", dataPedido='" + getDataPedido() + "'" +
            ", quantidade=" + getQuantidade() +
            "}";
    }
}
