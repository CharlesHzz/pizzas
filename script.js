let cart = [];//Array do carrinho, nele será adicionado o tamanho, quantidade e as informações da pizza.
let modalQT = 1; //Quantidade de item no modal, já inicia com 1.
let modalKey = 0;

const c = (el) => {
    return document.querySelector(el);
}
//Aqui eu crio um elemento que me retorna o "documente.querySelector()" que simplifica, para que eu não passe "documente.querySelector()" a todo momento

const cs = (el) => document.querySelectorAll(el);
//Retorna pra mim um array com os itens que ele achou em "document.querySelectorAll"

pizzaJson.map((item, index)=> { //mapear o array. O .map() recebe cada pizza e o index, que é o número do array do pizzaJson
    let pizzaItem = c('.models .pizza-item').cloneNode(true);// O .cloneNode() serve para clonar a div. Se eu adicionar mais pizzas em "pizzas.js", ele automaticamente coloca a pizza na tela

    pizzaItem.setAttribute('data-key', index);//Guarda a informação de qual pizza foi clicada para poder usar no modal
    //preencher as informações em pizzaItem
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;//Adiciona a imagem da pizza
    pizzaItem.querySelector('.pizza-item--price').innerHTML= `R$ ${item.price.toFixed(2)}`;//Adciona o preço da pizza. coloca o ".toFixed(2)" pra que o valor que com números depois da vírgula
    pizzaItem.querySelector('.pizza-item--name').innerHTML= item.name;//Adiciona o nome da pizza
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;//Adiciona a descrição da pizza


    //-----------------------------------------------------MODAL---------------------------------------------------------


    pizzaItem.querySelector('a').addEventListener('click', (e)=> {//Pega o "href" mas ele atualiza a pagina se clicar, então preciso cancelar o evento de atualizar a página
        e.preventDefault();//previna a ação padrão. Basicamente vai bloquer a ação (no caso, atualizar a tela dito acima).

        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        /*
        O target serve pra dizer que clicamos no próprio elemento.(Nesse caso o "a").
        O closest serve pra dizer ao JS para encontar o elemento mais próximo que tenha a classe ('.pizza-item'). Ela vai apartir o 'a' vai procurar o elemetno mais próximo do a, pra fora ou dentro do próprio "a".
        O getAttribute é pra pegar o atributo 'data-key'. Basicamente vai pegar a chave que foi clicada
        */
        modalQT = 1; //Deixa o modalQT(quantidade) sempre com o valor 1.
        modalKey = key;//Guarda as informações da pizza pra poder colocar no carrinho

        c('.pizzaBig img').src =pizzaJson[key].img;//Coloca a imagem da pizza no modal
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;//Coloca o nome da pizza no modal
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;//Coloca a descrição da pizza no modal
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;//Coloca o valor da pizza no modal e utiliza o toFixed(2) para que tenha números depois da vírgula
        c('.pizzaInfo--size.selected').classList.remove('selected');//Serve pra tirar a seleção do tamanho quando o modal for fechado.
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{//Pega todos os elementos com a classe 'pizzaInfo--size' e utiliza o 'forEach' para que ele execute uma função a cada um dos itens.

            if(sizeIndex == 2) {  //Seleciona o elemento e deixa o tamanho "grande" selecionado mesmo se o modal for fechado
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];//Pega o span da div e altera o HTML de acordo com o pizzaJson
        });
        c('.pizzaInfo--qt').innerHTML = modalQT;//Pega a classe e adionaca o 'modalQT' no HTML.
        
        c('.pizzaWindowArea').style.opacity = 0;//começa a opacidade 0
        c('.pizzaWindowArea').style.display = 'flex';//faz com que o modal apareça na tela
        setTimeout(() =>{
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);//Essa função faz com que demore 200ms para mudar a opacidade de 0 para 1.
    });
    c('.pizza-area').append( pizzaItem);//Adiciona mais um conteúdo no HTML. Diferente do innerHTML, que iria trocar o item
});

//-----------------------------------------------------Eventos do MODAL---------------------------------------------------------
//Evento de fechar o modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
    c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{//retorna um array e com isso eu percorro o array com o 'forEach'(e pra cada um deles) que recebe o próprio item(item).
    item.addEventListener('click', closeModal);//Crio um evento de clique e ao clicar ele executa a função de fechar o modal.
});

//-----------------------------------------------------Botões de mais e menos do MODAL---------------------------------------------------------
//Botão de menos 
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQT > 1) {//se a quantidade for maior que 1
        modalQT --;//Ele diminui
        c('.pizzaInfo--qt').innerHTML = modalQT;
    }
    
});
//Botão de mais
c('.pizzaInfo--qtmais').addEventListener('click', ()=> {
    modalQT ++; //Ao clicar ele adiciona mais um a quantidade
    c('.pizzaInfo--qt').innerHTML = modalQT;//Altera o valor da variavel modal
});

//-----------------------------------------------------Botões dos tamanhos das pizzas no modal---------------------------------------------------------

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
//O código acima serve para quando o usuário clicar em um tamanho de pizza, o tamanho que tava selecionado antes, muda para o último clicado

c('.pizzaInfo--addButton').addEventListener('click', ()=> {
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));//Pega qual é o item pelo 'data-key' para saber o tamanho e usa o "parseInt()" para transformar as string em número.


    /*  
    Se por acaso clicar em uma pizza, com um tamanho e depois clicar na mesma pizza com o mesmo tamanho, para adicionar mais, o array deve ser o mesmo, eles devem se juntar o ser a mesma pizza e o mesmo tamanho
    Senão, se for a mesma pizza mas com tamanhos diferentes, ai sim deve se criar outro array, pq é a mesma pizza porém, com outro tamanho.
    como fazer isso:
    */
    let identifier = pizzaJson[modalKey].id+'@'+size;
    /*
    Variavel para identificar qual é a pizza pegando o id dela, contatenar com um símbolo qualquer, nesse caso, o "@" e depois o tamnho dela
    Sendo assim, toda pizza que for a selecionada vai receber o mesmo identificador ([modalKey].id+'@'+size)
    Se selecionar outra pizza, ele já vai gerar outro identificador
    */ 

    let key = cart.findIndex((item)=>item.identifier == identifier);//Váriavel que serve para verificar se o identifier já tem no carrinho
    /*
    Outra forma de fazer essa mesma função acima:
    let key = cart.findIndex((item)=>{
        return item.identifier = identifier
    )};
    */
    if (key > -1) {//ser o key for encontrado e for menor que o -1, irá alterar o item
        cart[key].qt += modalQT;//se achou, simplemente irá aumentar a quantidade
    }else{//senão, o usuário não adicionou a pizza ainda, ai sim eu adiciono o .push
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQT
    });
    }

    closeModal();
    updateCart();//atualiza o carrinho
});

c('.menu-openner').addEventListener('click', ()=>{
    if(cart.length > 0){
        c('aside').style.left = "0"
    }
});

c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = "100vw"
});

function updateCart(){
    c('.menu-openner span').innerHTML = cart.length;//Sempre que o updateCart rodar, o carrinho vai alterar de acordo.

    if(cart.length > 0){//se tiver itens no carrinho
        c('aside').classList.add('show');//ele abre o carrinho
        c('.cart').innerHTML = ''; //zera o HTML do cart, pra não ocorrer de aparecer outro item duplicado na tela

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){ //Pega item a item do carrinho
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id); //Váriavel serve para identificar qual é a pizza.
                /*return item.id = cart[i].id;
                console.log(pizzaItem);
                */

                subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size){
                case 0:
                    pizzaSizeName = "Pequena"
                    break;
                case 1:
                    pizzaSizeName = "Média"
                    break;
                case 2:
                    pizzaSizeName = "Grande"
                    break;
            }
            let pizzaName = `<strong>${pizzaItem.name}</strong> (${pizzaSizeName})`

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if(cart[i].qt > 1){//Se a quantidade de pizza for maior que 1
                    cart[i].qt--; //O botão executa e tira uma pizza 
                }else{
                    cart.splice(i, 1);//Se for menor que 1, o botão retira a pizza (utilizando o splice).
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].qt++;
                updateCart();
            });
           
            c('.cart').append(cartItem);

        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;//Pega a div subtotal e seleciona o último span da div com o comando "last-child"
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML =  `R$ ${total.toFixed(2)}`;
    }else {
        c('aside').classList.remove('show');//senão. ele esconde o carrinho.
        c('aside').style.left = "100vw"
    }
}
