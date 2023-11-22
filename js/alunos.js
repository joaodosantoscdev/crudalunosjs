var uri = 'http://localhost:8080/alunos'
var uri_turmas = 'http://localhost:8080/turmas'
// var uri = 'http://10.0.2.2:8080/alunos'
// var uri_turmas = 'http://10.0.2.2:8080/turmas'

// Função executada automaticamente assim que a página é carregada
$(function () {
    carregarAlunos()
    carregarComboTurmas() 
});

// Exibe todos os alunos do sistema
function carregarAlunos() {
    var nomeBusca = $('#consultaNomeAluno').val()
    if ((nomeBusca == '') || (nomeBusca == undefined)){
        $.get(uri, function (alunos) {
            console.log(alunos)
            montarTabelaAluno(alunos)
        })
    }else{
        findByNome(nomeBusca)
    }
    
}

// Monta a tabela de alunos
function montarTabelaAluno(alunos) {
    $('#tabelaAlunos>tbody>tr').remove()
    for (i = 0; i < alunos.length; i++) {
        linha = montarLinhaAluno(alunos[i])
        $('#tabelaAlunos>tbody').append(linha)
    }
}

// Monta cada linha que compoem a lista de alunos
function montarLinhaAluno(aluno) {
    var linha = '<tr>' +
        '<td>' + aluno.id + '</td>' +
        '<td>' + aluno.nome + '</td>' +
        '<td>' + aluno.email + '</td>' +
        '<td>' + aluno.idade + '</td>' +
        '<td>' + aluno.turma.nome + '</td>' +
        '<td><a href="alunos_detalhes.html?id=' + aluno.id + '" class="btn btn-info btn-sm text-white"><span class="d-none d-lg-block">Detalhes<span></a></td>' +
        '<td><button class="btn btn-warning btn-sm" onclick="editarAluno(' + aluno.id + ')"><span class="d-none d-lg-block">Editar<span></button></td>' +
        '<td><button class="btn btn-danger btn-sm" onclick="confirmaExclusaoAluno(' + aluno.id + ')"><span class="d-none d-lg-block">Remover<span></button></td>' +
        '</tr>'
    return linha
}

// Exibe o modal para confirmar a exclusao de alunos
function confirmaExclusaoAluno(id) {
    $('#id_exclusao').val(id) // campo no modal de exclusão
    $('#md_excluir_registro').modal('show')
}

// Exibe o modal com campos preenchidos (para alteração de alunos)
function editarAluno(id) {
    $.getJSON(uri + '/' + id, function (aluno) {
        $('#idAluno').val(aluno.id)
        $('#nome').val(aluno.nome)
        $('#email').val(aluno.email)
        $('#idade').val(aluno.idade)
        $('#select_turma').val(aluno.turma.id)
        $('#dlgAlunos').modal('show')
    })
}

// Exibe o modal para inserir um novo aluno
function novoAluno() {
    $('#idAluno').val('')
    $('#nome').val('')
    $('#email').val('')
    $('#idade').val('')
    $('#dlgAlunos').modal('show')
}

// Grava um registro no banco de dados (Inclusão ou Alteração)
function gravarAluno() {
    if ($('#idAluno').val() != '') {
        salvarAluno()
    } else {
        criarAluno()
    }

    carregarAlunos()
    $('#dlgAlunos').modal('hide')
}

// Insere um novo registro no banco de dados
function criarAluno() {
    aluno = {
        nome: $('#nome').val(),
        email: $('#email').val(),
        idade: $('#idade').val(),
        turma:{
            id: $('#select_turma').val()
        }
    }

    $.ajax({
        type: "POST",
        url: uri,
        contentType: 'application/json',
        data: JSON.stringify(aluno), // converte um valor para uma notação JSON
        success: function (response) {
            console.log(response)
            carregarAlunos()
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
function salvarAluno() {
    aluno = {
        id: $('#idAluno').val(),
        nome: $('#nome').val(),
        email: $('#email').val(),
        idade: $('#idade').val(),
        turma:{
            id: $('#select_turma').val()
        }
    }

    $.ajax({
        type: "PUT",
        url: uri + '/' + aluno.id,
        contentType: 'application/json',
        data: JSON.stringify(aluno),
        success: function (response) {
            //console.log(response)
            carregarAlunos()
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
function removerAluno(id) {
    $.ajax({
        type: "DELETE",
        url: uri + '/' + id,
        success: function () {
            $('#md_excluir_registro').modal('hide')
            carregarAlunos()
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
function limpaPesquisaAluno(){
    $('#consultaNomeAluno').val('')
    carregarAlunos()
}

// Monta o combo de turmas
function carregarComboTurmas() {
    $('#select_turma>option').remove()
    $.get(uri_turmas, function (turmas) {
        for (i = 0; i < turmas.length; i++) {
            $('#select_turma').append('<option value = "' + turmas[i].id + '">' + turmas[i].nome + '</option>');
        }
    })
}

function findByNome(nome){
    $.ajax({
        type: "POST",
        url: uri + '/find',
        contentType: 'application/json',
        data: nome,
        success: function (alunos) {
            montarTabelaAluno(alunos)
        },
        error: function (erro) {
            console.log(erro)
        }
    })
}