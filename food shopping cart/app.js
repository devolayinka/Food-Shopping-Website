const cartBtn= document.querySelector(".cart-btn");  
const cartOverlay= document.querySelector(".cart-overlay");
const cartItems= document.querySelector(".cart-items");
const cartTotal= document.querySelector(".cart-total");
const closeCartBtn= document.querySelector(".close-cart");
const clearCartBtn= document.querySelector(".clear-cart");
const cartContent= document.querySelector(".cart-content");
const cartDOM= document.querySelector(".cart");
const productsDOM= document.querySelector(".products-center");
//cart[] main cart is where we will be placing and getting info from local storage and other places
let cart=[];
let buttonsDOM =[];
//class for getting all products
class Products{
async getProducts(){
    try{
        let result= await fetch("products.json");
        let data =await result.json();
        let products = data.items
      products = products.map(item =>{
       const{title,price}  =item.fields;
       const{id} =item.sys;
       const image= item.fields.image.fields.file.url;
       return {title,price,id,image}
      });
      return products
    } catch(error){
       console.log(error) 
    }
}
}
//for displaying all the products returned from the product or getting from local storage
class UI {
displayProducts(products){
let result="";
products.forEach(product=>{
  result += `<article class="product">
  <div class="img-container">
   <img src="./${product.image}" alt="${product.image}" class="product-img">
   <button class="bag-btn" data-id="${product.id}">
  <i class="fa fa-shopping-cart"></i>Add to cart
 </button>
</div> 
  <h3>${product.title}</h3>
  <h4>#${product.price}</h4>
   </article>`;
});
productsDOM.innerHTML = result; 
}
getBagButton(){
  const buttons =[...document.querySelectorAll(".bag-btn")];//helps turn all buttons to arrya instead of nodelist  
  buttonsDOM = buttons;
  buttons.forEach(button  =>{
      let id = button.dataset.id;
     let inCart = cart.find(item => item-id === id);
 
     if(inCart){
    button.innerText = "In Cart";
    button.disabled = true;
  }
      button.addEventListener("click",(e)=>{
e.target.innerText = "In Cart";
 e.target.disabled= true; 
 //get product from products 
let cartItem = {...Storage.getMeal(id), amount: 1};

 //get product from cart
 cart =[...cart,cartItem];
 //save cart in local storage
 Storage.saveCart(cart);
 //set values of cart
 this.setCartValues(cart);
 //show cart item
this.addCartItem(cartItem)
 //display the cart
 this.showCart()
});
});
}
setCartValues(cart){
  let tempTotal=0; 
  let itemsTotal=0;  
  cart.map(item =>{
      tempTotal+= item.price * item.amount;
      itemsTotal += item.amount;
  });
  cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
   cartItems.innerText = itemsTotal;
   
}
addCartItem(item){
 const div =  document.createElement('div');
 div.classList.add('cart-item');
 div.innerHTML= `<img src="${item.image}" alt="${item.image}"/>
 <div>
  <h4>${item.title}</h4>
  <h5>#${ item.price}</h5>
  <span class="remove-item"data-id=${item.id}>remove</i></span>
 </div>
 <div>
 <i class="fa fa-chevron-up"data-id=${item.id}></i>
 <p class="item-amount">${item.amount}</p>  
 <i class="fa fa-chevron-down"data-id=${item.id}></i>
</div>`;
cartContent.appendChild(div);
}
showCart(){
  cartOverlay.classList.add("transparentBcg");
  cartDOM.classList.add("showCart");
}

setApp(){
  cart = Storage.getCart();
  this.setCartValues(cart);
  this.populateCart(cart);
  cartBtn.addEventListener("click",this.showCart);
  closeCartBtn.addEventListener("click",this.hideCart);
}
populateCart(cart){
  cart.forEach(item => this.addCartItem(item));
}
hideCart(){
  cartOverlay.classList.remove("transparentBcg");
  cartDOM.classList.remove("showCart"); 
}
cartLogic(){
  clearCartBtn.addEventListener("click",() =>{
    this.clearCart();
  });
  cartContent.addEventListener("click",e=>{
    if(e.target.classList.contains("remove-item")){
      let removeItem = e.target;
      let id = removeItem.dataset.id;
    cartContent.removeChild(removeItem.parentElement.parentElement);
      this.removeItem(id);
    }
    else if(e.target.classList.contains("fa-chevron-up")){
let addAmount = e.target;
let id= addAmount.dataset.id;
let tempItem = cart.find(item=> item.id===id);
tempItem.amount = tempItem.amount + 1;
Storage.saveCart(cart);
this.setCartValues(cart);
addAmount.nextElementSibling.innerText = tempItem.amount; 
    }
    else if(e.target.classList.contains("fa-chevron-down")){ 
      let reduceAmount = e.target;
      let id= reduceAmount.dataset.id;
      let tempItem = cart.find(item=> item.id===id);
      tempItem.amount = tempItem.amount - 1;
     if(tempItem.amount>0){
       Storage.saveCart(cart);
       this.setCartValues(cart);
       reduceAmount.previousElementSibling.innerText = tempItem.amount; 
     }else{
       cartContent.removeChild(reduceAmount.parentElement.parentElement);
       this.removeItem(id);
     }
    }
  })
}
clearCart(){
  let cartItems= cart.map( item => item.id);
  cartItems.forEach(id => this.removeItem(id));
  while(cartContent.children.length>0){
    cartContent.removeChild(cartContent.children[0]);
  }
  this.hideCart();
}
removeItem(id){
  cart = cart.filter(item => item.id !==id); 
  this.setCartValues(cart);
  Storage.saveCart(cart);
  let button = this.getSingleButton(id)
  button.disabled =false;
  button.innerHTML= `<i class="fa fa-shopping-cart"></i>add to cart`
}
getSingleButton(id){
  return buttonsDOM.find(button => button.dataset.id ===id);
}
}
//local storage.im using ststiuc because i dont have to create anbother instance,just to reuse in other places
class Storage{
static saveProducts(products){
   localStorage.setItem("products",JSON.stringify(products));
}
static getMeal(id){
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id) 
}
static saveCart(cart) {
localStorage.setItem("cart",JSON.stringify(cart));
} 
static getCart(){
  return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')): [];
}

}

document.addEventListener("DOMContentLoaded",()=>{
const ui  = new UI();
const products= new Products();

ui.setApp();
products.getProducts().then(products=>{
    ui.displayProducts(products)
Storage.saveProducts(products);
}).then (()=>{
 ui.getBagButton(); 
 ui.cartLogic();   
});

});

const menu = document.querySelector(".menu-tab");
const bigWrapper = document.querySelector(".wrapper-big");

const upBtn = document.querySelector(".up");
function doing(){
menu.addEventListener("click",()=>{
  bigWrapper.classList.toggle("active");
});
};
doing();

const navLinks = document.querySelectorAll(".nav-list");
navLinks.forEach(navbtn=>{
  navbtn.addEventListener("click",()=>{
    bigWrapper.classList.remove("active");
  });
});
const date = document.querySelector(".date");

date.innerHTML= new Date().getFullYear();


window.addEventListener("scroll",()=>{
if(window.pageYOffset>100){
    upBtn.classList.add("active");
}
else{
    upBtn.classList.remove("active");
};
});


const form = document.getElementById("form")

form.addEventListener("submit",(e)=>{
  e.preventDefault();
})



const menus=[
  {
      id:1,
      title:"pancake tatata",
      price:100,
      category:"breakfast",
      img:"./img/breakfast3.jpg",
      desc:`interesting apetitizing lor llshdh jllajd jdhf jdfhjfryy6e hegfr`,
  },
  {
      id:2,
      title:"steak sauce",
      price:1200,
      category:"lunch",
      img:"./img/lunch3.jpg",
      desc:`aakdh alldjd e er ajudj adhhd anndheh ajdr`
  },
{ 
      id:3,
      title:"la familia ",
      price:2200,
      category:"dinner",
      img:"./img/dinner3.jpg",
      desc:`aLorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum nisi suscipit beatae officiis, ipsa nemo explicabo itaque eius corporis incidunt.`,
  },
  {
      id:4,
      title:"pink shake ",
      price:500,
      category:"shakes",
      img:"./img/shakes2.jpg",
      desc:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam, consequatur asperiores hic dignissimos placeat assumenda!
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, unde..`,
  },
  {
      id:5,
      title:"loaf egg sauce",
      price:400,
      category:"breakfast",
      
      img:"./img/breakfast2.jpg",
      desc:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis exercitationem autem nulla, sapiente asperiores laborum consequatur sed pariatur ipsa reiciendis, molestias obcaecati placeat amet.`,
  },
  {
      id:6,
      title:"pasta bolongese",
      price:1500,
      category:"lunch",
      img:"./img/lunch2.jpg",
     
      desc:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos sed fugiat Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae similique qui tempore eligendi?`,
  },
  {
      id:7,
      title:"le pizza",
      price:2500,
      category:"dinner",
      img:"./img/dinner2.jpg",
     
      desc:`aLorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit beatae nobis adipisci. Iusto provident nobis dignissimos ut nam numquam molestiae omnis quaerat tempore. Non velit debitis modi quo magnam labore qui!`,
  },
  {
      id:8,
      title:"le pizza",
      price:2500,
      category:"dinner",
      img:"./img/dinner2.jpg",
      desc:`aLorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit beatae nobis adipisci. Iusto provident nobis dignissimos ut nam numquam molestiae omnis quaerat tempore. Non velit debitis modi quo magnam labore qui!`,
  },
  // /*{
  //     id:8,
  //     title:"streewberry shake",
  //     price:900,
  //     category:"shakes",
  //     img:"./images/shakes1.jpg",
      
  //     desc:`Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo unde quas eius aliquam a recusandae tempora asperiores, quam aliquid quae voluptatibus ut. Quisquam numquam dicta culpa distinctio unde, repellat praesentium non dignissimos. A, at! `,
  // },*/

  {
      id:9,
      title:"fruit salad",
      price:700,
      category:"breakfast",
      img:"./img/breakfast1.jpg",
     
      desc:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis exercitationem autem nulla, sapiente asperiores laborum consequatur sed pariatur ipsa reiciendis, molestias obcaecati placeat amet.`,
  },
  {
      id:10,
      title:"fruit salad",
      price:700,
      category:"breakfast",
      img:"./img/breakfast1.jpg",
     
      desc:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis exercitationem autem nulla, sapiente asperiores laborum consequatur sed pariatur ipsa reiciendis, molestias obcaecati placeat amet.`,
  },
  /*{
      id:10,
      title:"pasta nigeriane",
      price:2500,
      category:"lunch",
      img:"./images/lunch1.jpg",
      
      desc:`Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos sed fugiat Lorem ipsum, dolor sit amet consectetur adipisicing elit. Beatae similique qui tempore eligendi?`,
  },*/
  {
      id:11,
      title:"salad poketeono sauce",
      price:2000,
      category:"dinner",
      img:"./img/dinner1.jpg",
     
      desc:`aLorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit beatae nobis adipisci. Iusto provident nobis dignissimos ut nam numquam molestiae omnis quaerat tempore. Non velit debitis modi quo magnam labore qui! `,
  },
  {
      id:12,
      title:"melon-orange shake ",
      price:900,
      category:"shakes",
      img:"./img/shakes4.jpg",
      
     
      desc:`Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo unde quas eius aliquam a recusandae tempora asperiores, quam aliquid quae voluptatibus ut. Quisquam numquam dicta culpa distinctio unde, repellat praesentium non dignissimos. A, at! `,
  }, 
  { 
      id:13,
      title:"melon-orange shake ",
      price:900,
      category:"Salad",
      img:"./img/breakfast1.jpg",
      desc:`Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo unde quas eius aliquam a recusandae tempora asperiores, quam aliquid quae voluptatibus ut. Quisquam numquam dicta culpa distinctio unde, repellat praesentium non dignissimos. A, at! `,
  },  
  { 
      id:14,
      title:"melon-orange shake ",
      price:900,
      category:"Salad",
      img:"./img/breakfast2.jpg",
      desc:`Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo unde quas eius aliquam a recusandae tempora asperiores, quam aliquid quae voluptatibus ut. Quisquam numquam dicta culpa distinctio unde, repellat praesentium non dignissimos. A, at! `,
  }, 
  { 
    id:15,
    title:"melon-orange shake ",
    price:900,
    category:"Salad",
    img:"./img/lunch2.jpg",
    desc:`Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo unde quas eius aliquam a recusandae tempora asperiores, quam aliquid quae voluptatibus ut. Quisquam numquam dicta culpa distinctio unde, repellat praesentium non dignissimos. A, at! `,
},   
  { 
    id:16,
    title:"melon-orange shake ",
    price:900,
    category:"Salad",
    img:"./img/lunch3.jpg",
    desc:`Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo unde quas eius aliquam a recusandae tempora asperiores, quam aliquid quae voluptatibus ut. Quisquam numquam dicta culpa distinctio unde, repellat praesentium non dignissimos. A, at! `,
} 
];

const section= document.querySelector(".products-center");//this is the pARENT CONTAINER;

const btnContainer = document.querySelector(".button-container");
//load items
window.addEventListener("DOMContentLoaded",function(){

//i want to iterate over all the itemss in my array,i will be using map method,helps you access all elements in a perimeter
menuDisplayList(menus);
displayMenuButton();
activeBtn()
});


function menuDisplayList(menuList){
  let menuDisplay= menuList.map((list)=>{
      
    //     ` <article class="product">
    //    <img src=${list.img} class="product-img"alt=${list.title}>
    //    <div class="item-info">
    //        <header>
    //             <h4>${list.title}</h4>
    //            <h4 class="price">#${list.price}</h4>
    //        </header>
    //        <p class="item-text">${list.desc}</p>
    //     </div>
    // </article> 
    
   return `<article class="product">
<div class="img-container">
 <img src="${list.img}" alt="${list.title}" class="product-img">
 <button class="bag-btn"data-id="1">
  <i class="fa fa-shopping-cart"></i>Add to bag
 </button>
</div>
<h3>${list.title}</h3>
<h4>${list.price}</h4>
 </article>`
        
   }).join("");

   //join all the items in the array to the section-center,using joinmethod  
  //  menuDisplay=menuDisplay.join("");(you can do this two ways by either joining directly at the end of the mapfunction or you create ass separate variable)
  //the join("") is empty because we dont want to have comma at the end of each closing article tag and its is just the item that will be displayed.
   section.innerHTML= menuDisplay;//using thid help us to be able to display each and every item in my array;  
  }

  function displayMenuButton(){
      //this is when you want to add item(button) to a page without adding it to html file directly.values=the entire menu array and itemss=each and everyitem in array
      const menuCatgoryButton = menus.reduce(
          function(values,itemss){
              if(!values.includes(itemss.category)){
                  values.push(itemss.category);
              }
              return values;
          },["all"]
      );
      const newCategory= menuCatgoryButton.map(
       function(latest){
             return` <button class="filter-btn" type="button" data-class="${latest}"> ${latest}</button> `
          }).join("");
          btnContainer.innerHTML = newCategory;
          //button items
          let buttons= document.querySelectorAll(".filter-btn");
       buttons.forEach(function(btn){
      btn.addEventListener("click",function(e){
        const button=e.currentTarget.dataset.class;  
// const buttons=e.target.dataset.class
     
        const menuCategory= menus.filter(function(list){
      if(list.category === button){
    return list
      } 
 
     });
       
      if(button==="all"){
          menuDisplayList(menus)
      } 
      else{
          menuDisplayList(menuCategory) 
          
      } 
      }); 
     
      });  
  }
  //function is used to add an active color so it can tell a user the category he is
  function activeBtn(){
    const buttonContainer = document.querySelector(".button-container")
    const filterbtns = document.querySelectorAll(".filter-btn");
    buttonContainer.addEventListener("click",(e)=>{
     const buttons = e.target.dataset.class;
     if (buttons){
      filterbtns.forEach(filterItems=>{
        filterItems.classList.remove("activer");
        e.target.classList.add("activer");
      });
     }
    })
}
    
  
     
