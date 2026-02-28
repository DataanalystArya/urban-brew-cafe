const menuData = [
    { category:"☕ Coffee", items:[
      ["Cold Coffee",120],["Classic Cappuccino",150],["Cafe Latte",160],
      ["Espresso (Single Shot)",100],["Espresso (Double Shot)",130],
      ["Mocha Coffee",170],["Caramel Coffee",180],["Hazelnut Coffee",180],
      ["Vanilla Latte",170],["Iced Latte",160]
    ]},
    { category:"🍵 Tea", items:[
      ["Masala Chai",60],["Adrak Chai",70],["Elaichi Chai",70],
      ["Green Tea",80],["Lemon Tea",90],["Honey Ginger Tea",90],
      ["Ice Lemon Tea",100]
    ]},
    { category:"🥤 Cold Beverages", items:[
      ["Chocolate Milkshake",160],["Strawberry Milkshake",150],
      ["Vanilla Milkshake",140],["Oreo Shake",180],["KitKat Shake",190],
      ["Fresh Lime Soda",90],["Blue Lagoon Mocktail",150],["Mojito",140]
    ]},
    { category:"🥪 Snacks & Quick Bites", items:[
      ["Veg Sandwich",120],["Cheese Sandwich",140],
      ["Grilled Veg Sandwich",160],["Paneer Sandwich",170],
      ["Veg Burger",150],["Cheese Burger",170],
      ["French Fries",110],["Peri Peri Fries",130],
      ["Garlic Bread",140],["Cheese Garlic Bread",160]
    ]},
    { category:"🍕 Pizzas", items:[
      ["Margherita Pizza",220],["Farm Fresh Pizza",260],
      ["Paneer Tikka Pizza",280],["Cheese Burst Pizza",300]
    ]},
    { category:"🍝 Pasta", items:[
      ["Red Sauce Pasta",200],["White Sauce Pasta",220],
      ["Pink Sauce Pasta",230],["Cheese Pasta",250]
    ]},
    { category:"🍰 Desserts", items:[
      ["Chocolate Brownie",130],["Brownie with Ice Cream",170],
      ["Choco Lava Cake",160],["Chocolate Muffin",90],
      ["Cup Cake",80],["Waffle with Chocolate Syrup",180]
    ]},
    { category:"🥗 Add-ons", items:[
      ["Extra Cheese",40],["Extra Sauce",30],["Ice Cream Scoop",50]
    ]}
  ];
  
  const menuGrid = document.getElementById("menuGrid");
  
  menuData.forEach(section=>{
    const block=document.createElement("div");
    block.className="menu-block";
  
    let html=`<h3 class="menu-category">${section.category}</h3>`;
    section.items.forEach(item=>{
      html+=`
        <div class="menu-row">
          <span>${item[0]}</span>
          <span>₹${item[1]}</span>
          <button class="add-btn" onclick="addToCart('${item[0]}', ${item[1]})">
            Add
          </button>
        </div>
      `;
    });
  
    block.innerHTML=html;
    menuGrid.appendChild(block);
  });
  
  let cart = [];
  
  // Load saved cart
  const savedCart = localStorage.getItem("urbanCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  
  function addToCart(name, price) {
    const item = cart.find(i => i.name === name);
    if (item) {
      item.qty++;
    } else {
      cart.push({ name, price, qty: 1 });
    }
  
    renderCart();
    showAddedToast(name);
  }
  
  function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
  
    if (cart.length === 0) {
      cartItems.innerHTML = "<p style='text-align:center;margin-top:20px;'>Your cart is empty ☕</p>";
      cartTotal.textContent = 0;
    } else {
  
      let total = 0;
  
      cartItems.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
  
        return `
          <div class="cart-item">
            <span>${item.name}</span>
  
            <div class="cart-controls">
              <button onclick="decreaseQty(${index})">−</button>
              <span>${item.qty}</span>
              <button onclick="increaseQty(${index})">+</button>
            </div>
  
            <span>₹${item.price * item.qty}</span>
  
            <button onclick="removeItem(${index})"
              style="background:none;border:none;color:red;font-size:18px;cursor:pointer;">
              ×
            </button>
          </div>
        `;
      }).join("");
  
      cartTotal.textContent = total;
    }
  
    const cartCount = document.getElementById("cartCount");
    if (cartCount) {
      cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
    }
  
    localStorage.setItem("urbanCart", JSON.stringify(cart));
  }
  
  function increaseQty(index) {
    cart[index].qty++;
    renderCart();
  }
  
  function decreaseQty(index) {
    cart[index].qty--;
    if (cart[index].qty === 0) {
      cart.splice(index, 1);
    }
    renderCart();
  }
  
  function removeItem(index) {
    cart.splice(index, 1);
    renderCart();
  }
  
  function toggleCart() {
    const cartEl = document.getElementById("cart");
    cartEl.classList.toggle("open");
  
    document.body.style.overflow =
      cartEl.classList.contains("open") ? "hidden" : "auto";
  }
  
  /* PAYMENTS */
  function payWithUPI() {
    const total = Number(document.getElementById("cartTotal").textContent) || 0;
  
    if (total === 0) {
      alert("Cart is empty");
      return;
    }
  
    const upi = "urbancafe@okaxis";
    const upiURL = `upi://pay?pa=${upi}&pn=Urban Brew Cafe&am=${total}&cu=INR`;
  
    if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
      window.location.href = upiURL;
    } else {
      alert("UPI payment works on mobile phones only.");
    }
  }
  
  function orderOnWhatsApp() {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
  
    let msg = "Hello! I would like to order:\n";
  
    cart.forEach(i => {
      msg += `${i.name} x ${i.qty} = ₹${i.price * i.qty}\n`;
    });
  
    msg += `Total: ₹${document.getElementById("cartTotal").textContent}`;
  
    window.open(`https://wa.me/919351469466?text=${encodeURIComponent(msg)}`);
  }
  
  /* SLIDER */
  const slider = document.querySelector(".promo-slider");
  const cards = document.querySelectorAll(".promo-card");
  
  if (slider && cards.length > 0) {
  
    const cardWidth = cards[0].offsetWidth;
  
    cards.forEach(card => {
      slider.appendChild(card.cloneNode(true));
    });
  
    let translateX = 0;
  
    function animateSlider() {
      translateX -= 0.5;
  
      if (translateX <= -cardWidth * cards.length) {
        translateX = 0;
      }
  
      slider.style.transform = `translateX(${translateX}px)`;
      requestAnimationFrame(animateSlider);
    }
  
    requestAnimationFrame(animateSlider);
  }
  
  /* HEADER SCROLL */
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (header) {
      header.classList.toggle("scrolled", window.scrollY > 50);
    }
  });
  
  /* SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
  
  /* TOAST */
  function showAddedToast(name){
    const toast = document.createElement("div");
    toast.textContent = `${name} added to cart`;
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#3e2723";
    toast.style.color = "#fff";
    toast.style.padding = "10px 18px";
    toast.style.borderRadius = "30px";
    toast.style.fontSize = "0.8rem";
    toast.style.zIndex = "2000";
    toast.style.opacity = "0";
    toast.style.transition = "0.3s ease";
  
    document.body.appendChild(toast);
  
    setTimeout(()=> toast.style.opacity="1", 50);
    setTimeout(()=>{
      toast.style.opacity="0";
      setTimeout(()=> toast.remove(),300);
    },2000);
  }
  
  // Initial render on page load
  renderCart();
  function openCheckout(){
    if(cart.length === 0){
      alert("Cart is empty");
      return;
    }
  
    document.getElementById("checkoutModal").style.display = "flex";
  
    // Load saved user data
    const savedUser = JSON.parse(localStorage.getItem("urbanUser"));
    if(savedUser){
      document.getElementById("userName").value = savedUser.name;
      document.getElementById("userPhone").value = savedUser.phone;
      document.getElementById("userAddress").value = savedUser.address;
    }
  }
  
  function closeCheckout(){
    document.getElementById("checkoutModal").style.display = "none";
  }
  
  function placeOrder(){
    const name = document.getElementById("userName").value.trim();
    const phone = document.getElementById("userPhone").value.trim();
    const address = document.getElementById("userAddress").value.trim();
  
    if(!name || !phone || !address){
      alert("Please fill all details");
      return;
    }
  
    const total = document.getElementById("cartTotal").textContent;
  
    // Save user details
    localStorage.setItem("urbanUser", JSON.stringify({
      name, phone, address
    }));
  
    // Order summary message
    let msg = `New Order:\n\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\n`;
  
    cart.forEach(i=>{
      msg += `${i.name} x ${i.qty} = ₹${i.price * i.qty}\n`;
    });
  
    msg += `\nTotal: ₹${total}`;
  
    // Clear cart
    cart = [];
    localStorage.removeItem("urbanCart");
    renderCart();
  
    closeCheckout();
  
    alert("Order Placed Successfully!");
  
    window.open(`https://wa.me/919351469466?text=${encodeURIComponent(msg)}`);
  }
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("show");
      }
    });
  });
  
  document.querySelectorAll(".section").forEach(sec=>{
    observer.observe(sec);
  });
  window.addEventListener("scroll", function(){
    const header = document.querySelector("header");
    if(window.scrollY > 50){
      header.style.background = "rgba(0,0,0,0.6)";
    } else {
      header.style.background = "transparent";
    }
  });