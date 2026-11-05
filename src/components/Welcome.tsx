const principles = [
  'Valorização dos saberes africanos',
  'Diálogo intercultural e intersubjectivo',
  'Investigação com base na realidade africana',
  'Educação, ética pública e reconciliação',
]

export default function Welcome() {
  return <section className="welcome" aria-labelledby="welcome-title">
    <div className="welcome-intro">
      <span className="eyebrow">ESTUDO · DIÁLOGO · INVESTIGAÇÃO</span>
      <h1 id="welcome-title">Boas-vindas à Cátedra de <em>Filosofia Africana</em></h1>
      <p>Um espaço académico de estudo, diálogo e investigação sobre o pensamento filosófico africano.</p>
      <a className="button" href="#publicacoes">Explorar publicações ↗</a>
    </div>
    <div className="welcome-principles">
      <h2>O que defendemos</h2>
      <ul>{principles.map((principle, index) => <li key={principle}><span aria-hidden="true">0{index + 1}</span>{principle}</li>)}</ul>
      <p>Bem-vindo(a)! Junte-se a nós no diálogo pelo conhecimento e pela construção de uma sociedade mais justa.</p>
    </div>
  </section>
}
