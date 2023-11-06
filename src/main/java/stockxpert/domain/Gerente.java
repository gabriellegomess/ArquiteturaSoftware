package stockxpert.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Gerente.
 */
@Entity
@Table(name = "gerente")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Gerente implements Serializable {

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
    @Column(name = "cpf", nullable = false)
    private String cpf;

    @NotNull
    @Column(name = "salario", precision = 21, scale = 2, nullable = false)
    private BigDecimal salario;

    @NotNull
    @Column(name = "data_nasc", nullable = false)
    private LocalDate dataNasc;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "gerente")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "produtos", "gerente" }, allowSetters = true)
    private Set<Estoque> estoques = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Gerente id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Gerente nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return this.cpf;
    }

    public Gerente cpf(String cpf) {
        this.setCpf(cpf);
        return this;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public BigDecimal getSalario() {
        return this.salario;
    }

    public Gerente salario(BigDecimal salario) {
        this.setSalario(salario);
        return this;
    }

    public void setSalario(BigDecimal salario) {
        this.salario = salario;
    }

    public LocalDate getDataNasc() {
        return this.dataNasc;
    }

    public Gerente dataNasc(LocalDate dataNasc) {
        this.setDataNasc(dataNasc);
        return this;
    }

    public void setDataNasc(LocalDate dataNasc) {
        this.dataNasc = dataNasc;
    }

    public Set<Estoque> getEstoques() {
        return this.estoques;
    }

    public void setEstoques(Set<Estoque> estoques) {
        if (this.estoques != null) {
            this.estoques.forEach(i -> i.setGerente(null));
        }
        if (estoques != null) {
            estoques.forEach(i -> i.setGerente(this));
        }
        this.estoques = estoques;
    }

    public Gerente estoques(Set<Estoque> estoques) {
        this.setEstoques(estoques);
        return this;
    }

    public Gerente addEstoque(Estoque estoque) {
        this.estoques.add(estoque);
        estoque.setGerente(this);
        return this;
    }

    public Gerente removeEstoque(Estoque estoque) {
        this.estoques.remove(estoque);
        estoque.setGerente(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Gerente)) {
            return false;
        }
        return getId() != null && getId().equals(((Gerente) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Gerente{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", cpf='" + getCpf() + "'" +
            ", salario=" + getSalario() +
            ", dataNasc='" + getDataNasc() + "'" +
            "}";
    }
}
