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

- `POST /product/create`: Cadastra um novo produto.
- `DELETE /product/delete/:productId`: Deleta um produto pelo ID.
- `PATCH /product/edit/:productId`: Edita um produto pelo ID.
- `GET /product/all`: Retorna todos os produtos cadastrados.
- `GET /product?q`: Retorna todos os produtos com base em uma busca.
- `GET /product/get/:productId`: Retorna um produto pelo ID.
- `POST /product/addcart/:productId`: Adiciona um produto ao carrinho com base no ID.
- `GET /product/products?ofert`: Retorna produtos com desconto.
- `GET /product/availables`: Retorna produtos com estoque.

### Address

- `POST /address/addUserAddress`: Cadastra um novo endereço para a empresa ou usuário.
- `DELETE /address/delete/:addressId`: Deleta o endereço desejado cadastrado na conta.
- `GET /address/allAddress`: Retorna todos os endereços cadastrados na conta.
- `PATCH /address/edit/:addressId`: Edita um determinado endereço.
- `GET /address/getaddress/:addressId`: Retorna informações de um endereço.
- `PATCH /address/select/mainAddress/:addressId`: Seleciona o endereço principal.

### Avaliações

- `POST /avaliation/create/:productId`: O usuário pode criar uma avaliação de texto e número para um produto.
- `GET /avaliation/:productId`: Retorna todas as avaliações dos produtos com todas as informações.
- `GET /avaliation/myavaliations`: Retorna todas as avaliações do usuário.
- `DELETE /avaliation/delete/:avaliationID`: Deleta uma avaliação.

### Perguntas

- `POST /questions/create/:productId`: O usuário pode criar uma pergunta para um produto.
- `GET /questions/:productId`: Retorna todas as perguntas do produto.
- `GET /questions/myquestions`: Retorna todas as perguntas do usuário.
- `DELETE /questions/delete/:questionId`: Deleta uma pergunta.

### Respostas

- `POST /answers/create/:questionId`: O usuário pode criar uma resposta para uma pergunta do produto.
- `GET /answers/:questionId?product=`: Retorna todas as respostas da pergunta do produto.
- `GET /answers/myanswers`: Retorna todas as respostas do usuário.
- `DELETE /answers/delete/:answersId?product=`: Deleta uma resposta.

## Autenticação

A E-commerce API utiliza autenticação baseada em tokens JWT (JSON Web Token) para proteger os endpoints que requerem autorização. Abaixo, explicamos como a autenticação funciona e como os usuários podem obter um token de autenticação.

### Obtendo um Token JWT

Para obter um token JWT e acessar os recursos protegidos, siga estas etapas:

1. Realize o cadastro como estabelecimento ou usuário da empresa.
2. Faça o login com suas credenciais utilizando o endpoint `POST /enterprise/login`.
3. Isso fornecerá um token JWT que deve ser incluído no cabeçalho de todas as solicitações autenticadas.

### Usando o Token JWT

Uma vez que você tenha obtido um token JWT, inclua-o no cabeçalho de suas solicitações para acessar os endpoints protegidos. O cabeçalho deve ser definido da seguinte forma:

```http
Authorization: Bearer SEU_TOKEN_JWT_AQUI


 
