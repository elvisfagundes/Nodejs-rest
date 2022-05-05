const { default: axios } = require('axios');
const res = require('express/lib/response')
const moment = require ('moment'    )
const conexao = require('../infraestrutura/database/conexao')
const axios = require('axios')

class Atendimento {
    adiciona(atendimento, res){
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
                    res.status(201).json(atendimento)
                }
            })
        }
       
    }
    lista(res){
        const sql = 'SELECT * FROM Atendimentos';

        conexao.query(sql, (erro, resultados) => {
            if(erro){
                res.status(400).json(erro);
            } else {
                res.status(200).json(resultados);
            }
        })
    }
    buscaPorId(id, res) {
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`;

        conexao.query(sql, async (erro, resultados) => {
            const atendimento = resultados[0]
            const cpf = atendimento.cliente
            if(erro){
                res.status(400).json(erro)
            } else {
                const { data } = await axios.get(`http://localhost:8082/${cpf}`)

                atendimento.cliente = data
                
                res.status(200).json(resultados)
            }
        })
    }
    altera(id, valores, res) {
        if(valores.data){
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }
        const sql = 'UPDATE Atendimentos SET ? WHERE id=?';

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if(erro){
                res.query(400).json(erro);
            } else {
                res.query(200).json({...valores, id});
            }
        })
    }   
    deleta(id, res) {
        const sql = 'DELETE FROM * Atendimentos WHERE id=?';

        conexao.query(sql, id, (erro, resultados) => {
            if(erro){
                res.status(400).json(erro);
            } else {
                res.status(200).json({id});
            }
        })
    }
}

module.exports = new Atendimento;