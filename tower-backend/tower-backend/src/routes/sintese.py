from flask import Blueprint, jsonify

sintese_bp = Blueprint("sintese", __name__)

@sintese_bp.route("/sintese", methods=["GET"])
def get_sintese():
    # Exemplo de dados simulados (depois você pode puxar do banco)
    dados = {
        "total_vendas": 125000,
        "categorias_ativas": 3,
        "categorias": [
            {
                "nome": "Eletrônicos",
                "produtos": [
                    {
                        "nome": "Notebook Gamer",
                        "custo": 3500,
                        "preco": 5000,
                        "margem": "30%",
                        "desempenho": "Alto",
                        "vendas": 120,
                        "total_vendas": 600000
                    },
                    {
                        "nome": "Smartphone X",
                        "custo": 1500,
                        "preco": 2500,
                        "margem": "40%",
                        "desempenho": "Médio",
                        "vendas": 300,
                        "total_vendas": 750000
                    }
                ]
            },
            {
                "nome": "Eletrodomésticos",
                "produtos": [
                    {
                        "nome": "Geladeira",
                        "custo": 2000,
                        "preco": 3200,
                        "margem": "35%",
                        "desempenho": "Alto",
                        "vendas": 80,
                        "total_vendas": 256000
                    }
                ]
            },
            {
                "nome": "Móveis",
                "produtos": [
                    {
                        "nome": "Sofá 3 lugares",
                        "custo": 900,
                        "preco": 1500,
                        "margem": "40%",
                        "desempenho": "Baixo",
                        "vendas": 45,
                        "total_vendas": 67500
                    }
                ]
            }
        ]
    }

    return jsonify(dados)
