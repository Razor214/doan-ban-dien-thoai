// --- Toàn bộ logic giỏ hàng, địa chỉ, đơn hàng ---
function loadAddresses() {
  const saved = localStorage.getItem("savedAddresses");
  if (saved) return JSON.parse(saved);
  return [
    { name: "Nguyen Van A", phone: "0901234567", address: "123 Lê Lợi, Q1, TP.HCM", isDefault: true },
    { name: "Tran Thi B", phone: "0912345678", address: "456 Nguyễn Trãi, Q5, TP.HCM", isDefault: false }
  ];
}
function saveAddresses() { localStorage.setItem("savedAddresses", JSON.stringify(savedAddresses)); }

function renderAddressOptions() {
  savedAddressSelect.innerHTML = '<option value="">-- Chọn địa chỉ --</option>';
  savedAddresses.forEach((a, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${a.isDefault ? "⭐ " : ""}${a.name} - ${a.address}`;
    savedAddressSelect.appendChild(opt);
  });
  renderAddressList();
}
function renderAddressList() {
  let container = document.getElementById("addressManager");
  if (!container) {
    container = document.createElement("div");
    container.id = "addressManager";
    document.querySelector(".address-section").appendChild(container);
  }
  container.innerHTML = "<h4>📍 Danh sách địa chỉ đã lưu:</h4>";
  savedAddresses.forEach((a,i)=>{
    const div = document.createElement("div");
    div.style.margin="6px 0";div.style.padding="8px";div.style.border="1px solid #ddd";
    div.style.borderRadius="5px";div.style.background=a.isDefault?"#eaf8ff":"#fff";
    div.innerHTML=`
      <b>${a.name}</b> (${a.phone})<br>${a.address}<br>
      <button class="btn-set-default" data-index="${i}" style="background:#27ae60;color:white;border:none;border-radius:4px;padding:3px 8px;cursor:pointer;margin-top:5px;">${a.isDefault?"✔ Mặc định":"Đặt mặc định"}</button>
      <button class="btn-delete-address" data-index="${i}" style="background:#e74c3c;color:white;border:none;border-radius:4px;padding:3px 8px;margin-left:5px;cursor:pointer;">Xóa</button>`;
    container.appendChild(div);
  });
  container.querySelectorAll(".btn-set-default").forEach(btn=>{
    btn.onclick=()=>{const idx=btn.dataset.index;savedAddresses.forEach((a,i)=>a.isDefault=i==idx);saveAddresses();renderAddressOptions();};
  });
  container.querySelectorAll(".btn-delete-address").forEach(btn=>{
    btn.onclick=()=>{if(confirm("Xóa địa chỉ này?")){savedAddresses.splice(btn.dataset.index,1);saveAddresses();renderAddressOptions();}};
  });
}
let savedAddresses=loadAddresses();
const savedAddressSelect=document.getElementById("savedAddress");
renderAddressOptions();

savedAddressSelect.onchange=()=>{
  const idx=savedAddressSelect.value;
  if(idx!==""){
    const a=savedAddresses[idx];
    newName.value=a.name;newPhone.value=a.phone;newAddress.value=a.address;
  }else{newName.value="";newPhone.value="";newAddress.value="";}
};

function saveNewAddress(name,phone,address){
  const exists=savedAddresses.some(a=>a.name===name&&a.phone===phone&&a.address===address);
  if(!exists){savedAddresses.push({name,phone,address,isDefault:false});saveAddresses();renderAddressOptions();}
}

// --- Auto điền mặc định ---
window.addEventListener("load",()=>{
  const def=savedAddresses.find(a=>a.isDefault);
  if(def){newName.value=def.name;newPhone.value=def.phone;newAddress.value=def.address;}
});

// --- Giỏ hàng ---
let cart={};
const cartTableBody=document.querySelector("#cartTable tbody");
const totalPriceEl=document.getElementById("totalPrice");
function loadCart(){const s=localStorage.getItem("cart");if(s)cart=JSON.parse(s);renderCart();}
function saveCart(){localStorage.setItem("cart",JSON.stringify(cart));}
function renderCart(){
  cartTableBody.innerHTML="";let total=0;
  for(const id in cart){
    const i=cart[id];const t=i.price*i.qty;total+=t;
    cartTableBody.innerHTML+=`
    <tr><td>${i.name}</td><td>${i.price.toLocaleString('vi-VN')}₫</td>
    <td><button class='btn btn-minus' data-id='${id}'>-</button></td>
    <td><input type='number' class='qty-input' value='${i.qty}' min='1' data-id='${id}'></td>
    <td><button class='btn btn-plus' data-id='${id}'>+</button></td>
    <td>${t.toLocaleString('vi-VN')}₫</td>
    <td><button class='btn btn-remove' data-id='${id}'>Xóa</button></td></tr>`;
  }
  totalPriceEl.textContent=total.toLocaleString('vi-VN')+"₫";
}
document.querySelectorAll(".btn-add").forEach(btn=>{
  btn.onclick=()=>{
    const p=btn.closest(".product");
    const id=p.dataset.id;const name=p.dataset.name;const price=parseInt(p.dataset.price);
    if(!cart[id])cart[id]={name,price,qty:1};else cart[id].qty++;
    renderCart();saveCart();alert("Đã thêm "+name+" vào giỏ hàng!");
  };
});
cartTableBody.onclick=e=>{
  const id=e.target.dataset.id;
  if(e.target.classList.contains("btn-plus"))cart[id].qty++;
  if(e.target.classList.contains("btn-minus")){cart[id].qty--;if(cart[id].qty<=0)delete cart[id];}
  if(e.target.classList.contains("btn-remove")&&confirm("Xóa sản phẩm này?"))delete cart[id];
  renderCart();saveCart();
};
cartTableBody.onchange=e=>{
  if(e.target.classList.contains("qty-input")){
    const id=e.target.dataset.id;const qty=parseInt(e.target.value);
    if(qty<=0)delete cart[id];else cart[id].qty=qty;renderCart();saveCart();
  }
};
document.querySelector(".btn-update").onclick=()=>{renderCart();saveCart();alert("Giỏ hàng đã cập nhật!");};

// --- Đặt hàng ---
document.querySelector(".btn-checkout").onclick=()=>{
  if(Object.keys(cart).length===0)return alert("Giỏ hàng trống!");
  const name=newName.value.trim(),phone=newPhone.value.trim(),address=newAddress.value.trim(),payment=paymentMethod.value;
  if(!name||!phone||!address)return alert("Vui lòng nhập đầy đủ thông tin!");
  if(confirm(`Xác nhận đặt hàng với hình thức: ${payment}?`)){
    const orders=JSON.parse(localStorage.getItem("orders")||"[]");
    orders.push({
      id:Date.now(),
      date:new Date().toLocaleString(),
      items:Object.values(cart),
      customer:{name,phone,address},
      payment
    });
    localStorage.setItem("orders",JSON.stringify(orders));
