var uri = 'http://localhost:8080/disciplinas'
// var uri = 'http://10.0.2.2:8080/disciplinas'

const urlParams = new URLSearchParams(window.location.search);
const idDisciplina = urlParams.get('id');

console.log(idDisciplina)
// Função executada automaticamente assim que a página é carregada
$(function () {
    carregarDetalhesDisciplina(idDisciplina)
});

function carregarDetalhesDisciplina(id) {
    $.get(uri + '/' + id, function (disciplina) {
        console.log(disciplina)
        $('#disciplina-identificacao').text(disciplina.nome + ' - ' + disciplina.cargaHoraria + ' horas.')
        montarTabelaDetalhesDisciplina(disciplina.alunos)
    })
}

// Monta a tabela de turmas
function montarTabelaDetalhesDisciplina(alunosDisciplina) {
    $('#tabelaDetalhesDisciplina>tbody>tr').remove()
    console.log(alunosDisciplina)
    for (i = 0; i < alunosDisciplina.length; i++) {
        linhaDetalhes = montarLinhaDetalhesDisciplina(alunosDisciplina[i])
        $('#tabelaDetalhesDisciplina>tbody').append(linhaDetalhes)
    }
}

// Monta cada linha que compoem a lista de turmas
function montarLinhaDetalhesDisciplina(alunos) {    
    var linha = '<tr>' +
        '<td>' + alunos.aluno.id + '</td>' +
        '<td>' + alunos.aluno.nome + '</td>' +
        '<td>' + alunos.aluno.email + '</td>' +
        '</tr>'
    return linha
}