var uri = 'http://localhost:8080/turmas'
// var uri = 'http://10.0.2.2:8080/turmas'

// Função executada automaticamente assim que a página é carregada
$(function () {
    carregarTurmas()
});

// Exibe todos os turmas do sistema
function carregarTurmas() {
    var nomeBusca = $('#consultaNomeTurma').val()
    if ((nomeBusca == '') || (nomeBusca == undefined)){
        $.get(uri, function (turmas) {
            console.log(turmas)
            montarTabelaTurma(turmas)
        })
    }else{
        findByNome(nomeBusca)
    }
}

// Monta a tabela de turmas
function montarTabelaTurma(turmas) {
    $('#tabelaTurmas>tbody>tr').remove()
    for (i = 0; i < turmas.length; i++) {
        linha = montarLinhaTurma(turmas[i])
        $('#tabelaTurmas>tbody').append(linha)
    }
}

// Monta cada linha que compoem a lista de turmas
function montarLinhaTurma(turma) {
    var linha = '<tr>' +
        '<td>' + turma.id + '</td>' +
        '<td>' + turma.nome + '</td>' +
        '<td>' + turma.ano + '</td>' +
        '<td><a href="turmas_detalhes.html?id=' + turma.id + '" class="btn btn-info btn-sm text-white">Detalhes</a></td>' +
        '<td><button class="btn btn-warning btn-sm" onclick="editarTurma(' + turma.id + ')">Editar</button></td>' +
        '<td><button class="btn btn-danger btn-sm" onclick="confirmaExclusaoTurma(' + turma.id + ')">Apagar</button></td>' +
        '</tr>'
    return linha
}

// Exibe o modal para confirmar a exclusao de turmas
function confirmaExclusaoTurma(id) {
    $('#id_exclusao').val(id) // campo no modal de exclusão
    $('#md_excluir_registro').modal('show')
}

// Exibe o modal com campos preenchidos (para alteração de turmas)
function editarTurma(id) {
    $.getJSON(uri + '/' + id, function (turma) {
        $('#idTurma').val(turma.id)
        $('#nome').val(turma.nome)
        $('#ano').val(turma.ano)
        $('#dlgTurmas').modal('show')
    })
}

// Exibe o modal para inserir um novo turma
function novoTurma() {
    $('#idTurma').val('')
    $('#nome').val('')
    $('#ano').val('')
    $('#dlgTurmas').modal('show')
}

// Grava um registro no banco de dados (Inclusão ou Alteração)
function gravarTurma() {
    if ($('#idTurma').val() != '') {
        salvarTurma()
    } else {
        criarTurma()
    }

    carregarTurmas()
    $('#dlgTurmas').modal('hide')
}

// Insere um novo registro no banco de dados
function criarTurma() {
    turma = {
        nome: $('#nome').val(),
        ano: $('#ano').val()
    }

    $.ajax({
        type: "POST",
        url: uri,
        contentType: 'application/json',
        data: JSON.stringify(turma), // converte um valor para uma notação JSON
        success: function (response) {
            carregarTurmas()
            $('#tituloModalSucesso').text('Registro Incluído')
            $('#mensagemModalSucesso').text('Registro Incluído com Sucesso.')
            $('#md_mensagem_sucesso').modal('show')
        },
        error: function (erro) {
            console.log(erro)
        }
    })
}

// Grava as alteracoes de um registro
function salvarTurma() {
    turma = {
        id: $('#idTurma').val(),
        nome: $('#nome').val(),
        ano: $('#ano').val()
    }

    $.ajax({
        type: "PUT",
        url: uri + '/' + turma.id,
        contentType: 'application/json',
        data: JSON.stringify(turma),
        success: function (response) {
            //console.log(response)
            carregarTurmas()
            $('#tituloModalSucesso').text('Registro Alterado')
            $('#mensagemModalSucesso').text('Registro Alterado com Sucesso.')
            $('#md_mensagem_sucesso').modal('show')
        },
        error: function (erro) {
            console.log(erro)
        }
    })
}

// Exclui um registro pelo id
function removerTurma(id) {
    $.ajax({
        type: "DELETE",
        url: uri + '/' + id,
        success: function () {
            $('#md_excluir_registro').modal('hide')
            carregarTurmas()
            $('#tituloModalSucesso').text('Registro Alterado')
            $('#mensagemModalSucesso').text('Registro Alterado com Sucesso.')
            $('#md_mensagem_sucesso').modal('show')
        },
        error: function (erro) {
            alert('Falha na exclusão do registro')
        }
    });
}

// Limpa o campo de consulta e carrega todos os registros
function limpaPesquisaTurma(){
    $('#consultaNomeTurma').val('')
    carregarTurmas()
}

function findByNome(nome){
    $.ajax({
        type: "POST",
        url: uri + '/find',
        contentType: 'application/json',
        data: nome,
        success: function (turmas) {
            montarTabelaTurma(turmas)
        },
        error: function (erro) {
            console.log(erro)
        }
    })
}