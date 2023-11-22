var uri = 'http://localhost:8080/disciplinas'

// Função executada automaticamente assim que a página é carregada
$(function () {
    carregarDisciplinas()
});

// Exibe todos os disciplinas do sistema
function carregarDisciplinas() {
    // Exibe todos os disciplinas
    var nomeBusca = $('#consultaNomeDisciplina').val()
        if ((nomeBusca == '') || (nomeBusca == undefined)){
        $.get(uri, function (disciplinas) {
            console.log(disciplinas)
            montarTabelaDisciplina(disciplinas)
        })
    }else{
        findByNomeDisciplina(nomeBusca)
    }
}

// Monta a tabela de disciplinas
function montarTabelaDisciplina(disciplinas) {
    $('#tabelaDisciplinas>tbody>tr').remove()
    for (i = 0; i < disciplinas.length; i++) {
        linha = montarLinhaDisciplina(disciplinas[i])
        $('#tabelaDisciplinas>tbody').append(linha)
    }
}

// Monta cada linha que compoem a lista de disciplinas
function montarLinhaDisciplina(disciplina) {
    var linha = '<tr>' +
        '<td>' + disciplina.id + '</td>' +
        '<td>' + disciplina.nome + '</td>' +
        '<td>' + disciplina.cargaHoraria + '</td>' +
        '<td><a href="disciplinas_detalhes.html?id=' + disciplina.id + '" class="btn btn-info btn-sm text-white">Detalhes</a></td>' +
        '<td><button class="btn btn-warning btn-sm" onclick="editarDisciplina(' + disciplina.id + ')">Editar</button></td>' +
        '<td><button class="btn btn-danger btn-sm" onclick="confirmaExclusaoDisciplina(' + disciplina.id + ')">Apagar</button></td>' +
        '</tr>'
    return linha
}

// Exibe o modal para confirmar a exclusao de disciplinas
function confirmaExclusaoDisciplina(id) {
    $('#id_exclusao').val(id) // campo no modal de exclusão
    $('#md_excluir_registro').modal('show')
}

// Exibe o modal com campos preenchidos (para alteração de disciplinas)
function editarDisciplina(id) {
    $.getJSON(uri + '/' + id, function (disciplina) {
        $('#idDisciplina').val(disciplina.id)
        $('#nome').val(disciplina.nome)
        $('#cargaHoraria').val(disciplina.cargaHoraria)
        $('#dlgDisciplinas').modal('show')
    })
}

// Exibe o modal para inserir um novo disciplina
function novoDisciplina() {
    $('#idDisciplina').val('')
    $('#nome').val('')
    $('#cargaHoraria').val('')
    $('#dlgDisciplinas').modal('show')
}

// Grava um registro no banco de dados (Inclusão ou Alteração)
function gravarDisciplina() {
    if ($('#idDisciplina').val() != '') {
        salvarDisciplina()
    } else {
        criarDisciplina()
    }

    carregarDisciplinas()
    $('#dlgDisciplinas').modal('hide')
}

// Insere um novo registro no banco de dados
function criarDisciplina() {
    disciplina = {
        nome: $('#nome').val(),
        cargaHoraria: $('#cargaHoraria').val()
    }
    
    $.ajax({
        type: "POST",
        url: uri,
        contentType: 'application/json',
        data: JSON.stringify(disciplina), // converte um valor para uma notação JSON
        success: function (response) {
            // console.log(response)
            carregarDisciplinas()
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
function salvarDisciplina() {
    disciplina = {
        id: $('#idDisciplina').val(),
        nome: $('#nome').val(),
        cargaHoraria: $('#cargaHoraria').val()
    }

    $.ajax({
        type: "PUT",
        url: uri + '/' + disciplina.id,
        contentType: 'application/json',
        data: JSON.stringify(disciplina),
        success: function (response) {
            //console.log(response)
            carregarDisciplinas()
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
function removerDisciplina(id) {
    $.ajax({
        type: "DELETE",
        url: uri + '/' + id,
        success: function () {
            $('#md_excluir_registro').modal('hide')
            carregarDisciplinas()
            $('#tituloModalSucesso').text('Registro Excluído')
            $('#mensagemModalSucesso').text('Registro Excluído com Sucesso.')
            $('#md_mensagem_sucesso').modal('show')
        },
        error: function (erro) {
            alert('Falha na exclusão do registro')
        }
    });
}

// Limpa o campo de consulta e carrega todos os registros
function limpaPesquisaDisciplina(){
    $('#consultaNomeDisciplina').val('')
    carregarDisciplinas()
}

function findByNomeDisciplina(nome){
    $.ajax({
        type: "POST",
        url: uri + '/find',
        contentType: 'application/json',
        data: nome,
        success: function (disciplinas) {
            montarTabelaDisciplina(disciplinas)
        },
        error: function (erro) {
            console.log(erro)
        }
    })
}