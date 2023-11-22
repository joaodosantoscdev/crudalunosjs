var uri = 'http://localhost:8080/alunos'
var uri_disciplina = 'http://localhost:8080/disciplinas'
var uri_ad = 'http://localhost:8080/ad'

// var uri = 'http://10.0.2.2:8080/alunos'
// var uri_disciplina = 'http://10.0.2.2:8080/disciplinas'
// var uri_ad = 'http://10.0.2.2:8080/ad'


const urlParams = new URLSearchParams(window.location.search);
const idAluno = urlParams.get('id');
let disciplinasDoAluno = [];

$(function () {
    carregarDetalhesAluno(idAluno)
});

function carregarDetalhesAluno(id) {
    $.get(uri + '/' + id, function (aluno) {
        $('#aluno-identificacao').text(aluno.nome)
        montarTabelaDetalhesAluno(aluno)
        montarTabelaDetalhesAlunoTurma(aluno.turma);
        carregarDisciplinasDoAluno(id);
    })
}

function carregarDisciplinasDoAluno(id) { 
    $.get(uri + '/disciplinas/' + id, function (disciplinas) {
        montarTabelaDetalhesAlunoDisciplina(disciplinas);
    });
}

function montarTabelaDetalhesAluno(aluno) {
    $('#tabelaDetalhesAluno>tbody>tr').remove()
    linhaDetalhesAluno = montarLinhaDetalhesAluno(aluno)
    $('#tabelaDetalhesAluno>tbody').append(linhaDetalhesAluno)
}

function montarTabelaDetalhesAlunoTurma(turma) {
    $('#tabelaDetalhesTurma>tbody>tr').remove()
    linhaDetalhesTurma = montarLinhaDetalhesTurma(turma)
    $('#tabelaDetalhesTurma>tbody').append(linhaDetalhesTurma)
}

function montarTabelaDetalhesAlunoDisciplina(disciplinas) {
    $('#tabelaDetalhesDisciplinas>tbody>tr').remove()

    
    for (i = 0; i < disciplinas.length; i++) {
        disciplinasDoAluno.push(disciplinas[i].disciplina.id);
        linhaDetalhesDisciplinas = montarLinhaDetalhesDisciplinas(disciplinas[i])
        $('#tabelaDetalhesDisciplinas>tbody').append(linhaDetalhesDisciplinas)
    }
}

function montarLinhaDetalhesAluno(aluno) {    
    var linha = '<tr>' +
        '<td>' + aluno.id + '</td>' +
        '<td>' + aluno.nome + '</td>' +
        '<td>' + aluno.email + '</td>' +
        '<td>' + aluno.idade + '</td>' +
        '</tr>'
    return linha
}

function montarLinhaDetalhesTurma(turma) {    
    var linha = '<tr>' +
        '<td>' + turma.id + '</td>' +
        '<td>' + turma.nome + '</td>' +
        '<td>' + turma.ano + '</td>' +
        '</tr>'
    return linha
}

function montarLinhaDetalhesDisciplinas(disciplinas) {    
    var linha = '<tr>' +
        '<td>' + disciplinas.disciplina.id + '</td>' +
        '<td>' + disciplinas.disciplina.nome + '</td>' +
        '<td>' + disciplinas.disciplina.cargaHoraria + '</td>' +
        '<td>' + disciplinas.nota1 + '</td>' +
        '<td>' + disciplinas.nota2 + '</td>' +
        '<td><button class="btn btn-warning btn-sm" onclick="definirNotas(' + disciplinas.id + ')"><span class="d-none d-lg-block">Editar<span></button></td>' +
        '<td><button class="btn btn-danger btn-sm" onclick="desassociarDisciplina(' + disciplinas.id + ')"><span class="d-none d-lg-block">Remover<span></button></td>' +
        '</tr>'
    return linha
}

// Exibe o modal para associação aluno-disciplina
function associarDisciplina() {
    $('#dlgAlunosDisciplinas').modal('show')
    carregarDisciplinasParaAluno()
}

function gravaAssociacaoAlunoDisciplina(){
    var disciplinasSelecionadas = getAllCheckSelected()
    
    for (i = 0; i < disciplinasSelecionadas.length; i++){
        ad = {
            aluno: {
                id: idAluno
            },
            disciplina: { 
                id: disciplinasSelecionadas[i]
            },
            nota1: 0,
            nota2: 0
        }
    
        $.ajax({
            type: "POST",
            url: uri_ad,
            contentType: 'application/json',
            data: JSON.stringify(ad), // converte um valor para uma notação JSON
            success: function (response) {
                console.log(response)
            },
            error: function (erro) {
                console.log(erro)
            }
        })
    }

    $('#dlgAlunosDisciplinas').modal('hide')
    carregarDetalhesAluno(idAluno)
    $('#tituloModalSucesso').text('Registros Incluídos')
    $('#mensagemModalSucesso').text('Registros Incluídos com Sucesso.')
    $('#md_mensagem_sucesso').modal('show')
}

// Retorna todas as disciplinas selecionadas
function getAllCheckSelected(){
    var checkboxes = document.getElementsByName('chk_disciplinas');
    var disciplinasSelecionadas = new Array

    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            disciplinasSelecionadas.push(checkboxes[i].value)
        }
    }

    return disciplinasSelecionadas
}

// Carrega as disciplinas que o aluno não está martriculado
// Isso evita matricular o aluno mais de uma vez na mesma disciplina
function carregarDisciplinasParaAluno(){
    var idsDisciplina = relacaoDisciplinasDoAluno()
    $('#tabelaInclusaoDisciplinas>tbody>tr').remove()

    $.get(uri_disciplina, function (disciplinas) {    
        for (i = 0; i < disciplinas.length; i++) {
            if (!idsDisciplina.includes(disciplinas[i].id)) {
                linhaInclusaoDisciplinas = montarLinhaInclusaoDisciplinas(disciplinas[i])
                $('#tabelaInclusaoDisciplinas>tbody').append(linhaInclusaoDisciplinas)
            }
        }
    })
}

// Retorna a relação de disciplinas que o aluno já está matriculado
function relacaoDisciplinasDoAluno(){
    var idsDisciplina = new Array()
    $.get(uri + '/disciplinas/' + idAluno, function (disciplinas) {
        for (i = 0; i < disciplinas.length; i++) {
            idsDisciplina.push(disciplinas[i].disciplina.id);
        }
    });
    return idsDisciplina
}

// Cancela a matricula do aluno em uma disciplina
function desassociarDisciplina(idDisciplia){
    $.ajax({
        type: "DELETE",
        url: uri_ad + "/" + idDisciplia,
        contentType: 'application/json',
        success: function (response) {
            console.log(response)
            carregarDetalhesAluno(idAluno)
            $('#tituloModalSucesso').text('Disciplina Desassociada')
            $('#mensagemModalSucesso').text('Disciplina Desassociada com Sucesso.')
            $('#md_mensagem_sucesso').modal('show')
        },
        error: function (erro) {
            console.log(erro)
        }
    })
}

// Monta cada linha da tabela para associação aluno-disciplina
function montarLinhaInclusaoDisciplinas(disciplina) {    
    var linha = '<tr>' +
        '<td> <input type="checkbox" name="chk_disciplinas" value="' + disciplina.id + '"></td>' +
        '<td>' + disciplina.id + '</td>' +
        '<td>' + disciplina.nome + '</td>' +
        '<td>' + disciplina.cargaHoraria + '</td>' +
        '</tr>'
    return linha
}

function definirNotas(idAD) {
    $.getJSON(uri_ad + '/' + idAD, function (ad) {
        $('#disciplinaNota').val(ad.disciplina.nome)
        $('#disciplinaCargaNota').val(ad.disciplina.cargaHoraria)
        $('#disciplinaNota1').val(ad.nota1)
        $('#disciplinaNota2').val(ad.nota2)

        $('#disciplinaNotaId').val(ad.disciplina.id)
        $('#disciplinaAlunoId').val(ad.id)

        $('#dlgAlunosDisciplinasNotas').modal('show')
    })
}

function gravarAlunoDisciplinaNotas() {
    ad = {
        aluno: {
            id: idAluno
        },
        disciplina: { 
            id: $('#disciplinaNotaId').val()
        },
        nota1: $('#disciplinaNota1').val(),
        nota2: $('#disciplinaNota2').val()
    }

    var idAD = $('#disciplinaAlunoId').val()

    $.ajax({
        type: "PUT",
        url: uri_ad + '/' + idAD,
        contentType: 'application/json',
        data: JSON.stringify(ad), // converte um valor para uma notação JSON
        success: function (response) {
            console.log(response)
            carregarDetalhesAluno(idAluno)
            $('#dlgAlunosDisciplinasNotas').modal('hide')
            $('#tituloModalSucesso').text('Notas Atualizadas')
            $('#mensagemModalSucesso').text('Notas Atualizadas com Sucesso.')
            $('#md_mensagem_sucesso').modal('show')
        },
        error: function (erro) {
            console.log(erro)
        }
    })
}

function fechaModalAlunoDisciplinaNotas(){
    $('#dlgAlunosDisciplinasNotas').modal('hide')
}