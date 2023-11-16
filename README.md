# Sumário

1. [Descrição](#descrição)
2. [Funcionalidades](#funcionalidades)
3. [Endpoints](#endpoints)
    - [Empresas](#empresas)
    - [Usuários](#usuários)
    - [Produtos](#produtos)
    - [Endereços](#endereços)
    - [Avaliações](#avaliações)
    - [Perguntas](#perguntas)
    - [Respostas](#respostas)
    - [Carrinho de Produtos](#carrinho-de-produtos)
4. [Autenticação](#autenticação)
    - [Obtendo um Token JWT](#obtendo-um-token-jwt)
    - [Usando o Token JWT](#usando-o-token-jwt)
    - [Expiração do Token](#expiração-do-token)
    - [Exemplo de Solicitação Autenticada](#exemplo-de-solicitação-autenticada)
    - [Possíveis Erros de Autenticação](#possíveis-erros-de-autenticação)
5. [Pré-requisitos](#pré-requisitos)
6. [Instalação](#instalação)
7. [Contato](#contato)

# E-commerce API

## Descrição
A E-commerce API é um sistema desenvolvido para lojas virtuais, inspirado em plataformas como Amazon, Americanas, KABUM, entre outras. A API oferece diversas funcionalidades relacionadas a produtos e empresas.

## Funcionalidades
### Cadastro e Login de Empresas e Usuários
- Autenticação segura utilizando a biblioteca JSON Web Token (JWT).

### Empresas
## Endpoint `POST /enterprise/register`

### Descrição
Este endpoint é responsável por cadastrar uma nova empresa no sistema.

### Parâmetros necessários

1. **name** (*string*): Nome da empresa.
2. **email** (*string*): Endereço de e-mail da empresa.
3. **password** (*string*): Senha para a conta da empresa.
4. **confirmPassword** (*string*): Confirmação da senha, deve coincidir com o campo de senha.
5. **phone** (*string*): Número de telefone da empresa.

### Exemplo de solicitação (JSON)

```json
{
  "name": "Nome da Empresa",
  "email": "empresa@email.com",
  "password": "senha123",
  "confirmPassword": "senha123",
  "phone": "123456789"
}
```
### Respostas
* **200 OK**: O cadastro foi realizado com sucesso. Retorna informações adicionais, como o ID da empresa.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Pode incluir uma mensagem de erro para indicar o problema específico. Exemplo:

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica.

## Endpoint `POST /enterprise/login`

### Descrição
Este endpoint realiza o login de uma empresa existente no sistema.

### Parâmetros necessários

1. **email** (*string*): Endereço de e-mail da empresa.
2. **password** (*string*): Senha associada à conta da empresa.

### Exemplo de solicitação (JSON)

```json
{
  "email": "empresa@email.com",
  "password": "senha123"
}
```
### Respostas

* **200 OK**: O login foi realizado com sucesso. Retorna informações adicionais, como o token da empresa.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Pode incluir uma mensagem de erro para indicar o problema específico.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica.

## Endpoint `DELETE /enterprise/delete`

### Descrição
Este endpoint deleta a empresa cadastrada com base no token de autenticação fornecido. É necessário também fornecer a senha da empresa para confirmação.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação da empresa.
2. **Senha da Empresa** (*string*): Senha atual da empresa para confirmar a exclusão da conta.

### Exemplo de solicitação

```http
DELETE /enterprise/delete
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```
```json
{
  "password": "senha123"
}
```

### Respostas

* **200 OK**: A empresa foi deletada com sucesso.  

* **400 Bad Request**: Erro nos parâmetros fornecidos. Pode incluir uma mensagem de erro para indicar o problema específico.

* **401 Unauthorized**: Token inválido ou ausente, ou senha incorreta. Indica que o token fornecido não é válido, não foi enviado ou a senha fornecida não confere.  

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica.  

## Endpoint `PATCH /enterprise/addcolaborator`

### Descrição
Adiciona um colaborador à empresa com a função de administrador. É necessário fornecer o nome completo (fullname) e CPF do colaborador, além do token de autenticação da empresa.

### Parâmetros necessários

1. **Fullname** (*string*): Nome completo do colaborador.
2. **CPF** (*string*): Número de CPF do colaborador.

### Exemplo de solicitação (JSON)

```http
PATCH /enterprise/addcolaborator
Authorization: Bearer seu_token_aqui
Content-Type: application/json
```

```json
{
  "fullname": "Nome Completo do Colaborador",
  "cpf": "123.456.789-01"
}
```
### Respostas

* **200 OK**: O colaborador foi adicionado com sucesso.  

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: O usuário não é administrador e não pode ser adicionado.

* **401 Unauthorized**: Token inválido ou ausente, ou senha incorreta. Indica que o token fornecido não é válido, não foi enviado ou a senha fornecida não confere.  

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica. 

### Usuários
## Endpoint `POST /user/register`

### Descrição
Cadastra um novo usuário no sistema.

### Parâmetros necessários

1. **firstname** (*string*): Primeiro nome do usuário.
2. **lastname** (*string*): Sobrenome do usuário.
3. **email** (*string*): Endereço de e-mail do usuário.
4. **password** (*string*): Senha para a conta do usuário.
5. **confirmPassword** (*string*): Confirmação da senha, deve coincidir com o campo de senha.
6. **phone** (*string*): Número de telefone do usuário.
7. **cpf** (*string*): Número de CPF do usuário.

### Exemplo de solicitação (JSON)

```json
{
  "firstname": "Primeiro Nome",
  "lastname": "Sobrenome",
  "email": "usuario@email.com",
  "password": "senha123",
  "confirmPassword": "senha123",
  "phone": "123456789",
  "cpf": "123.456.789-01"
}
```
### Respostas
* **200 OK**: O cadastro do usuário foi realizado com sucesso.  

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Já existe algum usuário cadastrado com os dados. 

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica. 

## Endpoint `POST /user/login`

### Descrição
Realiza o login de um usuário existente no sistema.

### Parâmetros necessários

1. **email** (*string*): Endereço de e-mail do usuário.
2. **password** (*string*): Senha associada à conta do usuário.

### Exemplo de solicitação (JSON)

```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```
### Respostas
* **200 OK**: O  usuário foi logado realizado com sucesso. Retorna o token gerado.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Erro de senha. 

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica. 

## Endpoint `GET /user/getuser`

### Descrição
Retorna informações do usuário com base no token de autenticação.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário.

### Exemplo de solicitação (HTTP)

```http
GET /user/getuser
Authorization: Bearer seu_token_aqui
```
### Respostas
* **200 OK**: Retorna informações do usuário.

* **401 Unauthorized**: Token inválido ou ausente. Indica que o token fornecido não é válido ou não foi enviado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica. 

## Endpoint `PATCH /user/edituser`

### Descrição
Atualiza informações do usuário usando o token de autenticação. É necessário passar os dados que deseja alterar.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário.
2. Dados a serem alterados.

### Exemplo de solicitação (HTTP)

```http
PATCH /user/edituser
Authorization: Bearer seu_token_aqui
Content-Type: application/json
```
```json
{
  "firstname": "Novo Primeiro Nome",
  "phone": "987654321"
}
```
### Respostas
* **200 OK**: Edita informações do usuário.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: O usuário quer adicionar um email que pertence a outro usuário.

* **401 Unauthorized**: Token inválido ou ausente. Indica que o token fornecido não é válido ou não foi enviado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica. 

## Endpoint `DELETE /user/deleteuser`

### Descrição
Deleta o usuário cadastrado com base no token de autenticação.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário.

### Exemplo de solicitação (HTTP)

```http
DELETE /user/deleteuser
Authorization: Bearer seu_token_aqui
```
### Respostas
* **200 OK**: Deleta o usuário.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Deletar um usuário que já foi deletado.

* **401 Unauthorized**: Token inválido ou ausente. Indica que o token fornecido não é válido ou não foi enviado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica. 

### Produtos
## Endpoint `POST /product/create`

### Descrição
Cadastra um novo produto no sistema.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário (passado pelo cabeçalho da solicitação).
2. **name** (*string*): Nome do produto.
3. **price** (*number*): Preço do produto.
4. **qty** (*integer*): Quantidade disponível em estoque.
5. **category** (*string*): Categoria do produto.
6. **ondiscount** (*boolean*): Indica se o produto está em desconto.
7. **pricediscount** (*number*): Preço com desconto (se aplicável).

### Exemplo de solicitação (HTTP)

```http
POST /product/create
Authorization: Bearer seu_token_aqui
Content-Type: application/json
```
```json
{
  "name": "Nome do Produto",
  "price": 49.99,
  "qty": 100,
  "category": "Eletrônicos",
  "ondiscount": true,
  "pricediscount": 39.99
}
```
### Respostas
* **200 OK**: Cadastra o produto.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Produto com mesmo nome já cadastrado.

* **401 Unauthorized**: Token inválido ou ausente. Indica que o token fornecido não é válido ou não foi enviado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica. 

## Endpoint `DELETE /product/delete/:productId`

### Descrição
Deleta um produto com base no ID.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário (passado pelo cabeçalho da solicitação).
2. **productId** (*string*): ID do produto a ser deletado.

### Exemplo de solicitação (HTTP)

```http
DELETE /product/delete/123456789
Authorization: Bearer seu_token_aqui
```
### Respostas
* **200 OK**: Deleta o produto específico.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Produto já foi excluído.

* **401 Unauthorized**: Token inválido ou ausente. Indica que o token fornecido não é válido ou não foi enviado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica. 


## Endpoint `PATCH /product/edit/:productId`

### Descrição
Edita um produto com base no ID.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário (passado pelo cabeçalho da solicitação).
2. **productId** (*string*): ID do produto a ser editado.
3. **Dados a serem Alterados** (*object*): Objeto contendo os campos que deseja alterar no produto.

### Exemplo de solicitação (HTTP)

```http
PATCH /product/edit/123456789
Authorization: Bearer seu_token_aqui
Content-Type: application/json
```
```json
{
  "preco": 59.99,
  "qty": 80,
  "pricediscount": 49.99
}
```
### Respostas
* **200 OK**: Edita informações e um produto específico.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Nome a ser editado já está cadastrado em outro produto.

* **401 Unauthorized**: Token inválido ou ausente. Indica que o token fornecido não é válido ou não foi enviado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica. 

## Endpoint `GET /product/all`

### Descrição
Retorna todos os produtos cadastrados.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário (passado pelo cabeçalho da solicitação).

### Exemplo de solicitação (HTTP)

```http
GET /product/all
Authorization: Bearer seu_token_aqui
```
### Respostas
* **200 OK**: Retorna todos os produtos cadastrados(usar somente em modo admistrador)

* **401 Unauthorized**: Token inválido ou ausente. Indica que o token fornecido não é válido ou não foi enviado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica. 

## Endpoint `GET /product/get/:productId`

### Descrição
Retorna informações de um produto com base no ID.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário (passado pelo cabeçalho da solicitação).
2. **productId** (*string*): ID do produto a ser consultado.

### Exemplo de solicitação (HTTP)

```http
GET /product/get/123456789
Authorization: Bearer seu_token_aqui
```
### Respostas
* **200 OK**: Retorna um produto específico.

* **401 Unauthorized**: Token inválido ou ausente. Indica que o token fornecido não é válido ou não foi enviado.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Produto não encontrado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica.

## Endpoint `GET /product?q=product`

### Descrição
Retorna todos os produtos com base em uma busca.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário (passado pelo cabeçalho da solicitação).
2. **q** (*string*): Consulta de busca.

### Exemplo de solicitação (HTTP)

```http
GET /product?q=product
```
### Respostas
* **200 OK**: Retorna um produto específico.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Produto não encontrado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica.

## Endpoint `GET /product/onoffer`

### Descrição
Retorna produtos com desconto.

### Exemplo de solicitação (HTTP)

```http
GET /product/onoffer
```
### Respostas
* **200 OK**: Retorna produtos com desconto.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Produtos com descontos não encontrados.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica.

## Endpoint `GET /product/availables`

### Descrição
Retorna produtos disponíveis em estoque. Usar para os usuários.

### Exemplo de solicitação (HTTP)

```http
GET /product/availables
```
### Respostas
* **200 OK**: Retorna produtos com estoque.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica.

### Endereços

## Endpoint `POST /address/addUserAddress`

### Descrição
Cadastra um novo endereço para empresa ou usuário.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário (passado pelo cabeçalho da solicitação).
2. **country** (*string*): País do endereço.
3. **city** (*string*): Cidade do endereço.
4. **state** (*string*): Estado do endereço.
5. **zipcode** (*string*): CEP do endereço.
6. **streetaddress** (*string*): Endereço de rua.
7. **numberhouse** (*string*): Número da casa.

### Exemplo de solicitação (HTTP)

```http
POST /address/addUserAddress
Authorization: Bearer seu_token_aqui
Content-Type: application/json
```
```json
{
  "country": "Brasil",
  "city": "São Paulo",
  "state": "SP",
  "zipcode": "01234-567",
  "streetaddress": "Rua das Flores",
  "numberhouse": "123"
}
```
## Respostas
* **200 OK**: Cadastra endereço.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Endereço já cadastrado.

* **401 Unauthorized**: Token inválido ou ausente. Indica que o token fornecido não é válido ou não foi enviado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica.

## Endpoint `DELETE /address/delete/:addressId`

### Descrição
Deleta um endereço cadastrado com base no ID.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário (passado pelo cabeçalho da solicitação).
2. **addressId** (*string*): ID do endereço a ser deletado.

### Exemplo de solicitação (HTTP)

```http
DELETE /address/delete/123456789
Authorization: Bearer seu_token_aqui
```
* **200 OK**: Deleta o endereço.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Endereço já excuído.

* **401 Unauthorized**: Token inválido ou ausente. Indica que o token fornecido não é válido ou não foi enviado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica.

## Endpoint `GET /address/allAddress`

### Descrição
Retorna todos os endereços cadastrados.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário (passado pelo cabeçalho da solicitação).

### Exemplo de solicitação (HTTP)

```http
GET /address/allAddress
Authorization: Bearer seu_token_aqui
```
## Respostas
* **200 OK**: Retorna os endereços cadastrados.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Nenhum endereço encontrado.

* **401 Unauthorized**: Token inválido ou ausente. Indica que o token fornecido não é válido ou não foi enviado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica.


## Endpoint `PATCH /address/edit/:addressId`

### Descrição
Edita um endereço com base no ID.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário (passado pelo cabeçalho da solicitação).
2. **addressId** (*string*): ID do endereço a ser editado.
3. **Dados a serem Alterados** (*object*): Objeto contendo os campos que deseja alterar no endereço.

### Exemplo de solicitação (HTTP)

```http
PATCH /address/edit/123456789
Authorization: Bearer seu_token_aqui
Content-Type: application/json
```
```json
{
  "country": "Brasil",
  "city": "São Paulo",
  "state": "SP",
  "zipcode": "01234-567",
  "streetaddress": "Nova Rua",
  "numberhouse": "456"
}
```
* **200 OK**: Edita o endereço.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Nenhum endereço encontrado.

* **401 Unauthorized**: Token inválido ou ausente. Indica que o token fornecido não é válido ou não foi enviado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica.

## Endpoint `GET /address/getaddress/:addressId`

### Descrição
Retorna informações de um endereço com base no ID.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário (passado pelo cabeçalho da solicitação).
2. **addressId** (*string*): ID do endereço a ser consultado.

### Exemplo de solicitação (HTTP)

```http
GET /address/getaddress/123456789
Authorization: Bearer seu_token_aqui
```
* **200 OK**: Retorna o endereço.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Nenhum endereço encontrado.

* **401 Unauthorized**: Token inválido ou ausente. Indica que o token fornecido não é válido ou não foi enviado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica.

## Endpoint `PATCH /address/select/mainAddress/:addressId`

### Descrição
Seleciona o endereço principal.

### Parâmetros necessários

1. **Token** (*string*): Token de autenticação do usuário (passado pelo cabeçalho da solicitação).
2. **addressId** (*string*): ID do endereço a ser selecionado como principal.

### Exemplo de solicitação (HTTP)

```http
PATCH /address/select/mainAddress/123456789
Authorization: Bearer seu_token_aqui
```

* **200 OK**: Seleciona o endereço como principal.

* **400 Bad Request**: Erro nos parâmetros fornecidos. Por exemplo: Nenhum endereço encontrado.

* **401 Unauthorized**: Token inválido ou ausente. Indica que o token fornecido não é válido ou não foi enviado.

* **500 Internal Server Error**: Erro interno no servidor. Retorna uma mensagem de erro genérica.
### Avaliações
- `POST /avaliation/create/:productId`: Permite que o usuário crie uma avaliação para um produto, incluindo texto e número.
- `GET /avaliation/:productId`: Retorna todas as avaliações de um produto com todas as informações.
- `GET /avaliation/myavaliations`: Retorna todas as avaliações do usuário.
- `DELETE /avaliation/delete/:avaliationID`: Deleta uma avaliação.

### Perguntas
- `POST /questions/create/:productId`: Permite que o usuário faça uma pergunta sobre um produto.
- `GET /questions/:productId`: Retorna todas as perguntas de um produto.
- `GET /questions/myquestions`: Retorna todas as perguntas do usuário.
- `DELETE /questions/delete/:questionId`: Deleta uma pergunta.

### Respostas
- `POST /answers/create/:questionId`: Permite que o usuário responda a uma pergunta sobre um produto.
- `GET /answers/:questionId?product=`: Retorna todas as respostas para uma pergunta de um produto.
- `GET /answers/myanswers`: Retorna todas as respostas do usuário.
- `DELETE /answers/delete/:answersId?product=`: Deleta uma resposta.

### Carrinho de Produtos
- `POST /cart/addcart/:productID`: Adiciona um produto ao carrinho do usuário.
- `GET /cart/getcart`: Retorna informações do carrinho do usuário.
- `DELETE /cart/removeproduct/:productId`: Remove um produto do carrinho.
- `POST /cart/addqty/:productId`: Aumenta a quantidade do produto em 1 unidade.
- `DELETE /cart/decreasyqty/:productId`: Diminui a quantidade do produto em 1 unidade.
- `POST /cart/checkout`: Finaliza a compra.
- `PATCH /cart/select/:productId`: Seleciona os produtos do carrinho a serem comprados.
- `PATCH /cart/editqty/:productId`: Edita a quantidade desejada do produto.
- `POST /cart/updatestock`: Atualiza o estoque após a finalização da compra.

## Autenticação
A E-commerce API utiliza autenticação baseada em tokens JWT (Json Web Token) para proteger os endpoints que requerem autorização. A seguir, explicamos como a autenticação funciona e como os usuários podem obter um token de autenticação.

### Obtendo um Token JWT
Para obter um token JWT e acessar os recursos protegidos, siga estas etapas:
1. Realize o cadastro como estabelecimento ou usuário da empresa.
2. Faça o login com suas credenciais utilizando o endpoint:
   `POST /enterprise/login`

Isso fornecerá um token JWT que deve ser incluído no cabeçalho de todas as solicitações autenticadas.

### Usando o Token JWT
Uma vez que você tenha obtido um token JWT, inclua-o no cabeçalho de suas solicitações para acessar os endpoints protegidos. O cabeçalho deve ser definido da seguinte forma:
```makefile
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```
## Expiração do Token
Os tokens JWT geralmente têm um tempo de vida limitado. Certifique-se de que seu token esteja atualizado para evitar a expiração. Caso contrário, você precisará obter um novo token fazendo login novamente.

## Exemplo de Solicitação Autenticada
Aqui está um exemplo de como fazer uma solicitação autenticada utilizando o token JWT no cabeçalho:

GET /cart/addCart/:productId 
Authorization: Bearer SEU_TOKEN_JWT_AQUI

## Possíveis Erros de Autenticação
Caso ocorram erros de autenticação, a API retornará as mensagens de erro apropriadas para ajudar a solucionar problemas de autenticação.

Certifique-se de proteger seu token JWT e nunca compartilhá-lo publicamente. Mantenha suas credenciais seguras para garantir a segurança da sua conta.

Lembre-se de que esta é uma visão geral da autenticação na E-commerce API. Consulte a documentação completa para obter detalhes adicionais e exemplos.

## Pré-requisitos
Antes de começar a usar a E-commerce API, verifique se você atende aos seguintes pré-requisitos:
- Node.js e npm (gerenciador de pacotes Node.js) instalados em seu sistema. Você pode baixá-los em [nodejs.org](https://nodejs.org/).
- Um banco de dados MySQL configurado e acessível.
- Um ambiente de desenvolvimento ou servidor onde você possa implantar a API.

## Instalação
Siga estas etapas para instalar e configurar a E-commerce API:

1. Clone o repositório a partir do GitHub:

    ```bash
    git clone https://github.com/ViniciusRimes/Api-E-commerce.git
    ```
## Contato
- 📧 E-mail: viniciusrimess@gmail.com
- 💼 LinkedIn: [ViníciusRimes](https://www.linkedin.com/in/vinicius-rimes-de-oliveira/)