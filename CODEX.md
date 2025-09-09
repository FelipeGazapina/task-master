# CODEX

Guia de princípios e práticas para este repositório.

## Regras

- Mobile First: Sempre projete e implemente primeiro para telas pequenas, escalando para telas maiores com media queries (`min-width`). Priorize performance, legibilidade e toque/gestos.
- SOLID: Siga os princípios de design de software (SRP, OCP, LSP, ISP, DIP) para manter código coeso, desacoplado, testável e extensível.
- DDD: Modele o domínio explicitamente. Separe camadas (Domínio, Aplicação, Infraestrutura, Apresentação), use linguagem ubíqua, entidades/Value Objects, serviços de domínio e repositórios. Mantenha limites claros entre contexto de domínio e UI.
- Tidy First: Sempre que possível, aplique refatorações pequenas e seguras antes de adicionar novas funcionalidades, visando reduzir complexidade, tornar o código mais claro e pagar dívidas técnicas de baixo risco.
- Sem comentários explicativos: Não inserir comentários explicativos; prefira nomes autoexplicativos em variáveis, funções e módulos. Use comentários apenas para contexto de alto nível e decisões (o porquê), não para descrever o que o código faz.

## Diretrizes rápidas

- Estilos: base mobile sem media queries; adicione breakpoints progressivamente (ex.: `@media (min-width: 640px)`, `768px`, `1024px`…).
- Componentes: responsabilidade única; extraia dependências via interfaces; injete dependências quando aplicável.
- Domínio: regras de negócio no domínio; evite lógica de negócio em componentes de UI; proteja invariantes no modelo.
- Tidy First: prefira passos curtos e reversíveis; mantenha testes verdes; evite refatorações grandes sem cobertura; documente mudanças estruturais relevantes.
- Nomenclatura clara: código deve se explicar por si; escolha nomes descritivos que eliminem a necessidade de comentários.
