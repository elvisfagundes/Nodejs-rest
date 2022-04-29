const res = require('express/lib/response')
const moment = require ('moment'    )
const conexao = require('../infraestrutura/conexao')

class Atendimento {
    adiciona(atendimento){
        const dataCiacao = moment(atendimento.data).format('YYYY-MM-DD HH:MM:SS');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');

        const dataEValida = moment(data).isSameOrAfter(dataCiacao);
        const clienteEValido = atendimento.cliente.length >=5

        const validacoes = [
            {
                nome: 'data',
                valido: dataEValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteEValido,
                mensagem: 'Cliente deve ter pelo menos 5 caracteres'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido);
        const existemErros = erros.length;

        if(existemErros){
            res.status(400).json(erros);
        } else {
            const atendimentoDatado = {...atendimento, dataCiacao, data}
            const sql = 'INSERT INTO Atendimentos SET?'
    
            conexao.query(sql, atendimento, (erro, resultados) =>{
                if(erro){
                    res.status(400).json(erro)
                } else {
                    res.status(201).json(resultados)
                }
            })
        }
       
    }
}

module.exports = new Atendimento;