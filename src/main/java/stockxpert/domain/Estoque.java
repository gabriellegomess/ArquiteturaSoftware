package stockxpert.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Estoque.
 */
@Entity
@Table(name = "estoque")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Estoque implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "qtde", nullable = false)
    private Integer qtde;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "estoque")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "estoque", "pedidos" }, allowSetters = true)
    private Set<Produto> produtos = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "estoques" }, allowSetters = true)
    private Gerente gerente;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Estoque id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQtde() {
        return this.qtde;
    }

    public Estoque qtde(Integer qtde) {
        this.setQtde(qtde);
        return this;
    }

    public void setQtde(Integer qtde) {
        this.qtde = qtde;
    }

    public Set<Produto> getProdutos() {
        return this.produtos;
    }

    public void setProdutos(Set<Produto> produtos) {
        if (this.produtos != null) {
            this.produtos.forEach(i -> i.setEstoque(null));
        }
        if (produtos != null) {
            produtos.forEach(i -> i.setEstoque(this));
        }
        this.produtos = produtos;
    }

    public Estoque produtos(Set<Produto> produtos) {
        this.setProdutos(produtos);
        return this;
    }

    public Estoque addProduto(Produto produto) {
        this.produtos.add(produto);
        produto.setEstoque(this);
        return this;
    }

    public Estoque removeProduto(Produto produto) {
        this.produtos.remove(produto);
        produto.setEstoque(null);
        return this;
    }

    public Gerente getGerente() {
        return this.gerente;
    }

    public void setGerente(Gerente gerente) {
        this.gerente = gerente;
    }

    public Estoque gerente(Gerente gerente) {
        this.setGerente(gerente);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Estoque)) {
            return false;
        }
        return getId() != null && getId().equals(((Estoque) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Estoque{" +
            "id=" + getId() +
            ", qtde=" + getQtde() +
            "}";
    }
}
