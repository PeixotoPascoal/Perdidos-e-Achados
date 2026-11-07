// ============================================================
// CONFIGURAÇÃO
// ============================================================
const WHATSAPP = "244928336212";

// ============================================================
// LISTA DE DOCUMENTOS
// Para acrescentar um documento, copia um bloco, cola por baixo
// e altera os campos. Estado: "Disponível", "Em contacto" ou "Entregue".
// Nunca ponhas aqui nomes completos nem números de documentos.
// Os documentos abaixo são apenas exemplos: apaga-os antes de publicar.
// ============================================================
const documentos = [
  {
    id: "PA-001",
    tipo: "Bilhete de identidade",
    iniciais: "A. M. S.",
    zona: "Viana",
    data: "2026-11-02",
    estado: "Disponível"
  },
  {
    id: "PA-002",
    tipo: "Carta de condução",
    iniciais: "J. P. C.",
    zona: "Talatona",
    data: "2026-11-03",
    estado: "Disponível"
  },
  {
    id: "PA-003",
    tipo: "Cartão de estudante",
    iniciais: "M. F. L.",
    zona: "Cazenga",
    data: "2026-11-04",
    estado: "Em contacto"
  }, 
	{
    id: "PA-004",
    tipo: "Cartão Multicaixa",
    iniciais: "P. F. P.",
    zona: "Desvio do Zango",
    data: "2026-11-07",
    estado: "Em contacto"
  }, 
];

// ============================================================
// CÓDIGO DO SITE (não é preciso alterar daqui para baixo)
// ============================================================
const lista = document.getElementById("lista-documentos");
const contagem = document.getElementById("contagem");
const mensagemVazia = document.getElementById("mensagem-vazia");
const campoPesquisa = document.getElementById("pesquisa");
const filtroZona = document.getElementById("filtro-zona");
const filtroTipo = document.getElementById("filtro-tipo");
const filtroEstado = document.getElementById("filtro-estado");

function normalizar(texto) {
  return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function formatarData(iso) {
  const [ano, mes, dia] = iso.split("-");
  return dia + "/" + mes + "/" + ano;
}

function classeEstado(estado) {
  return "estado-" + normalizar(estado).replace(/\s+/g, "-");
}

function preencherFiltros() {
  const zonas = [...new Set(documentos.map(d => d.zona))].sort();
  const tipos = [...new Set(documentos.map(d => d.tipo))].sort();
  zonas.forEach(z => filtroZona.add(new Option(z, z)));
  tipos.forEach(t => filtroTipo.add(new Option(t, t)));
}

function criarCartao(doc) {
  const cartao = document.createElement("article");
  cartao.className = "cartao";

  const mensagem = encodeURIComponent(
    "Olá, penso que o documento " + doc.id + " (" + doc.tipo + ", encontrado em " + doc.zona + ") é meu."
  );
  const ligacao = "https://wa.me/" + WHATSAPP + "?text=" + mensagem;
  const entregue = doc.estado === "Entregue";

  cartao.innerHTML =
    '<div class="cartao-topo">' +
      "<h3></h3>" +
      '<span class="estado ' + classeEstado(doc.estado) + '"></span>' +
    "</div>" +
    "<dl>" +
      "<dt>Referência</dt><dd class='d-id'></dd>" +
      "<dt>Iniciais</dt><dd class='d-iniciais'></dd>" +
      "<dt>Zona</dt><dd class='d-zona'></dd>" +
      "<dt>Encontrado em</dt><dd class='d-data'></dd>" +
    "</dl>" +
    '<a class="botao botao-whatsapp' + (entregue ? " botao-desativado" : "") + '" target="_blank" rel="noopener" href="' + (entregue ? "#" : ligacao) + '">' +
      (entregue ? "Já entregue" : "É meu – contactar por WhatsApp") +
    "</a>";

  cartao.querySelector("h3").textContent = doc.tipo;
  cartao.querySelector(".estado").textContent = doc.estado;
  cartao.querySelector(".d-id").textContent = doc.id;
  cartao.querySelector(".d-iniciais").textContent = doc.iniciais;
  cartao.querySelector(".d-zona").textContent = doc.zona;
  cartao.querySelector(".d-data").textContent = formatarData(doc.data);
  return cartao;
}

function mostrar() {
  const termo = normalizar(campoPesquisa.value.trim());
  const resultado = documentos.filter(d => {
    const texto = normalizar(d.tipo + " " + d.iniciais + " " + d.zona + " " + d.id);
    return (!termo || texto.includes(termo)) &&
           (!filtroZona.value || d.zona === filtroZona.value) &&
           (!filtroTipo.value || d.tipo === filtroTipo.value) &&
           (!filtroEstado.value || d.estado === filtroEstado.value);
  }).sort((a, b) => b.data.localeCompare(a.data));

  lista.innerHTML = "";
  resultado.forEach(d => lista.appendChild(criarCartao(d)));

  mensagemVazia.hidden = resultado.length > 0;
  contagem.textContent = resultado.length === 1
    ? "1 documento encontrado"
    : resultado.length + " documentos encontrados";
}

[campoPesquisa, filtroZona, filtroTipo, filtroEstado].forEach(el => {
  el.addEventListener("input", mostrar);
  el.addEventListener("change", mostrar);
});

document.getElementById("ano").textContent = new Date().getFullYear();
preencherFiltros();
mostrar();