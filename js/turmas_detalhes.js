var uri = 'http://localhost:8080/turmas'
// var uri = 'http://.10.0.2.2:8080/turmas'

const urlParams = new URLSearchParams(window.location.search);
const idTurma = urlParams.get('id');

console.log(idTurma)
// Função executada automaticamente assim que a página é carregada
$(function () {
    carregarDetalhesTurma(idTurma)
});

// Exibe todos os turmas do sistema
function carregarDetalhesTurma(id) {
    // Exibe todos os turmas
    $.get(uri + '/' + id, function (turma) {
        console.log(turma)
        $('#turma-identificacao').text(turma.nome + ' - ' + turma.ano)
        montarTabelaDetalhesTurma(turma.alunos)
    })
}

// Monta a tabela de turmas
function montarTabelaDetalhesTurma(alunosTurma) {
    $('#tabelaDetalhesTurmas>tbody>tr').remove()
    console.log(alunosTurma)
    for (i = 0; i < alunosTurma.length; i++) {
        linhaDetalhes = montarLinhaDetalhesTurma(alunosTurma[i])
        $('#tabelaDetalhesTurmas>tbody').append(linhaDetalhes)
    }
}

// Monta cada linha que compoem a lista de turmas
function montarLinhaDetalhesTurma(alunos) {    
    var linha = '<tr>' +
        '<td>' + alunos.id + '</td>' +
        '<td>' + alunos.nome + '</td>' +
        '<td>' + alunos.email + '</td>' +
        '</tr>'
    return linha
}