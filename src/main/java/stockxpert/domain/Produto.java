package stockxpert.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Produto.
 */
@Entity
@Table(name = "produto")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Produto implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nome", nullable = false)
    private String nome;

    @NotNull
    @Column(name = "preco", precision = 21, scale = 2, nullable = false)
    private BigDecimal preco;

    @Column(name = "descricao")
    private String descricao;

    @NotNull
    @Column(name = "cod_barra", nullable = false)
    private Double codBarra;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "produtos", "gerente" }, allowSetters = true)
    private Estoque estoque;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "produtos")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "cliente", "produtos" }, allowSetters = true)
    private Set<Pedido> pedidos = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Produto id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Produto nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public BigDecimal getPreco() {
        return this.preco;
    }

    public Produto preco(BigDecimal preco) {
        this.setPreco(preco);
        return this;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public String getDescricao() {
        return this.descricao;
    }

    public Produto descricao(String descricao) {
        this.setDescricao(descricao);
        return this;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public Double getCodBarra() {
        return this.codBarra;
    }

    public Produto codBarra(Double codBarra) {
        this.setCodBarra(codBarra);
        return this;
    }

    public void setCodBarra(Double codBarra) {
        this.codBarra = codBarra;
    }

    public Estoque getEstoque() {
        return this.estoque;
    }

    public void setEstoque(Estoque estoque) {
        this.estoque = estoque;
    }

    public Produto estoque(Estoque estoque) {
        this.setEstoque(estoque);
        return this;
    }

    public Set<Pedido> getPedidos() {
        return this.pedidos;
    }

    public void setPedidos(Set<Pedido> pedidos) {
        if (this.pedidos != null) {
            this.pedidos.forEach(i -> i.removeProduto(this));
        }
        if (pedidos != null) {
            pedidos.forEach(i -> i.addProduto(this));
        }
        this.pedidos = pedidos;
    }

    public Produto pedidos(Set<Pedido> pedidos) {
        this.setPedidos(pedidos);
        return this;
    }

    public Produto addPedido(Pedido pedido) {
        this.pedidos.add(pedido);
        pedido.getProdutos().add(this);
        return this;
    }

    public Produto removePedido(Pedido pedido) {
        this.pedidos.remove(pedido);
        pedido.getProdutos().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Produto)) {
            return false;
        }
        return getId() != null && getId().equals(((Produto) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Produto{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", preco=" + getPreco() +
            ", descricao='" + getDescricao() + "'" +
            ", codBarra=" + getCodBarra() +
            "}";
    }
}
