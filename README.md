# E-commerce API

## Descrição

A E-commerce API é um sistema desenvolvido para lojas virtuais, como Amazon, Americanas, KABUM, entre outras. A API oferece diversas funcionalidades relacionadas a produtos e empresas.

## Funcionalidades

- Cadastro e login de empresas e usuários com autenticação, utilizando a biblioteca JSON Web Token (JWT).
- Cadastro, edição e remoção de produtos pela empresa.
- Sistema de carrinhos de compras: Criação de carrinhos para cada usuário e adição de produtos da loja com todas as informações.
- Controle de estoque com atualização a cada venda.

## Endpoints

### Empresa

- `POST /enterprise/register`: Cadastra uma nova empresa.
- `POST /enterprise/login`: Realiza login de uma empresa existente.
- `GET /enterprise/getuser`: Retorna informações da empresa pelo token.
- `PATCH /enterprise/edituser`: Atualiza as informações da empresa existente usando o token.
- `DELETE /enterprise/delete`: Deleta a empresa cadastrada.

### Usuários

- `POST /user/register`: Cadastra um novo usuário.
- `POST /user/login`: Realiza login de um usuário existente.
- `GET /user/getuser`: Retorna informações do usuário pelo token.
- `PATCH /user/edituser`: Atualiza as informações do usuário existente usando o token.
- `DELETE /user/delete`: Deleta o usuário cadastrado.

### Produtos

- `POST /product/create`: Cadastra um novo

 
