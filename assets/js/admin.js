//Quản lý giá bán
    const modal = document.getElementById('popup');
    const form = document.getElementById('productadd');
    const cancelBtn = document.getElementById('cancelBtn');
    const table = document.querySelector('#Bangsp tbody');
    const searchInput = document.getElementById('Timkiem')
    const categoryInput = document.getElementById('category');
    const nameInput = document.getElementById('name');
    const costInput = document.getElementById('cost');
    const profitInput = document.getElementById('profit');
    const priceInput = document.getElementById('sell');

    let editingRow = null;
    fetch("../data/manageproduct.json")
        .then(r => r.json())
        .then(d => khungbang.innerHTML = d.map(sp => `
            <tr>
                <td>${sp.brand}</td>
                <td>${sp.name}</td>
                <td>${sp.cost.toLocaleString("vi-VN")}</td>
                <td>${sp.profit}%</td>
                <td>${(sp.price*(1+sp.profit/100)).toLocaleString("vi-VN")}</td>
                <td class="action">
                    <button class="edit">Sửa</button> 
                    <button class="delete">Xóa</button>
                </td>
            </tr>`
        ).join("")
    );
    table.addEventListener("click", (e) => {
        if (e.target.classList.contains("edit")) {
            openModal("edit", e.target);
        } else if (e.target.classList.contains("delete")) {
            confirmDelete(e.target);
        }
    });

    function openModal(mode, btn) {
        form.reset();
        priceInput.value = '';
        modal.style.display = 'flex'; 
        editingRow = null;

        if (mode === 'edit' && btn) {
            const row = btn.closest('tr');
            categoryInput.value = row.cells[0].innerText;
            nameInput.value = row.cells[1].innerText;
            costInput.value = row.cells[2].innerText.replace(/,/g,'');
            profitInput.value = parseFloat(row.cells[3].innerText);
            priceInput.value = row.cells[4].innerText.replace(/,/g,'');
            editingRow = row;
        }
    }

    cancelBtn.onclick = () => modal.style.display = 'none';

    
    costInput.addEventListener('input', updatePrice);
    profitInput.addEventListener('input', updatePrice);
    priceInput.addEventListener('input', updateProfit);

    function cleanNumber(value){
        return parseFloat(value.replace(/[.,\s]/g, ''))||0;
    }
    function formatNumber(num){
        return num.toLocaleString('vi-VN');
    }
    function updatePrice() {
        const cost = cleanNumber(costInput.value);
        const profit = parseFloat(profitInput.value);
        if (cost >0  && !isNaN(profit)) {
            const price = cost + (cost * profit / 100);
            priceInput.value = formatNumber(Math.round(price));
        }else{
            priceInput.value='';
        }
    }

    function updateProfit() {
        const cost = cleanNumber(costInput.value);
        const price = cleanNumber(priceInput.value);
        if (cost > 0 && price>0) {
            const profit = ((price - cost) / cost) * 100;
            profitInput.value = profit.toFixed(2);
        }
    }
    function formatOnInput(input){
        let val = cleanNumber(input.value);
        input.value = val ? formatNumber(val) : '';
    }
    
    form.onsubmit = (e) => {
        e.preventDefault();
        const category = categoryInput.value;
        const name = nameInput.value;
        const cost = costInput.value;
        const profit = profitInput.value;
        const price = priceInput.value;

        if (!category || !name || !cost || !profit) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        if (editingRow) {
            editingRow.cells[0].innerText = category;
            editingRow.cells[1].innerText = name;
            editingRow.cells[2].innerText = cost;
            editingRow.cells[3].innerText = profit + '%';
            editingRow.cells[4].innerText = price;
        } else {
            const row = table.insertRow();
            row.innerHTML = `
                <td>${category}</td>
                <td>${name}</td>
                <td>${cost}</td>
                <td>${profit}%</td>
                <td>${price}</td>
                <td class="action">
                    <button class="edit" onclick="openModal('edit', this)">Sửa</button>
                    <button class="delete" onclick="confirmDelete(this)">Xóa</button>
                </td>
            `;
        }
        modal.style.display = 'none';
    };

    function searchProduct(){
        const keyword = searchInput.value.trim().toLowerCase();
        const rows = table.getElementsByTagName('tr');

        for(let row of rows){
            const productName = row.cells[1].innerText.toLowerCase();
            row.style.display = productName.startsWith(keyword) || keyword === '' ? '' : 'none';

        }
    }
    searchInput.addEventListener('input', searchProduct);
    costInput.addEventListener('blur', ()=>{
        let val = cleanNumber(costInput.value);
        costInput.value = val ? formatNumber(val) : '';
    });
    updatePrice();
    priceInput.addEventListener('blur', ()=>{
        let val = cleanNumber(priceInput.value);
        priceInput.value = val ? formatNumber(val) : '';
    });
    updatePrice();


    function confirmDelete(btn) {
        const popup = document.getElementById('xacnhan');
        popup.style.display = 'flex';
        const row = btn.closest('tr');
        document.getElementById('xacnhanxoa').onclick = () => {
            row.remove();
            popup.style.display = 'none';
        };
        document.getElementById('xacnhankhong').onclick = () => popup.style.display = 'none';
    }

    function confirmExit() {
        document.getElementById('xacnhanthoat').style.display = 'flex';
        document.getElementById('confirmco').onclick = () => {
            document.getElementById('xacnhanthoat').style.display='none';
            document.getElementById('price-section').style.display='none';
            document.getElementById('home-section').style.display='block';
        }
        document.getElementById('confirmno').onclick = () => document.getElementById('xacnhanthoat').style.display = 'none';
    }

    function exportData() {
        document.getElementById('Xuatfile').style.display = 'flex';
        document.getElementById('confirm').onclick = () => {
            alert('Xuất dữ liệu thành công!');
            document.getElementById('Xuatfile').style.display = 'none';
        };
        document.getElementById('confirm-no').onclick = () => document.getElementById('Xuatfile').style.display = 'none';
    }
//Quản lý đơn đặt hàng 
let orderData=[];
fetch("/data/orders.json")
    .then(response => response.json())
    .then(data => {
        orderData = data;
        displayOrder(orderData);
    })
    .catch(error => console.error("Lỗi khi tải JSON: ", error));
function displayOrder(orders){
    const tableBody = document.getElementById("orderTable");
    tableBody.innerHTML ="";

    orders.forEach(order=> {
        const row = document.createElement("tr");
        row.innerHTML =`
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.date}</td>
            <td>${order.total.toLocaleString()}đ</td>
            <td>${order.status}</td>
            <td><button onclick ="showDetails('${order.id}')">Xem chi tiết</button></td>
        `;
        tableBody.appendChild(row);
    });
}
function Orders(){
    const fromDate =document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const status = document.getElementById("status").value;

    const filtered = orderData.filter(order => {
        const orderDate = new Date(order.date);
        const from = fromDate ? new Date(fromDate): null;
        const to = toDate ? new Date(toDate): null;

        const inDateRange = (!from || orderDate >= from) && (!to || orderDate <= to);
        const statusMatch = !status || order.status === status;
        return inDateRange && statusMatch;
    });
    displayOrder(filtered);
}
function showDetails(orderId){
    const order = orderData.find(o=>o.id ===orderId);
    const popup = document.getElementById("details");

    document.getElementById("detail-id").textContent = order.id;
    document.getElementById("detail-cus").textContent = order.customer;
    document.getElementById("detail-date").textContent = order.date;
    document.getElementById("detail-total").textContent = order.total.toLocaleString() + " đ";

    document.getElementById("detailsstatus").value = order.status;

    const listBody = document.querySelector("#list tbody");
    listBody.innerHTML = order.details.map(d => `
        <tr>
            <td>${d.product}</td>
            <td>${d.quantity}</td>
            <td>${d.price.toLocaleString()} đ</td>
        </tr>
    `).join("");
    popup.style.display = "flex";
}
function closeDetails() {
    document.getElementById("details").style.display = "none";
}
function closeMain(){
    document.getElementById("order-section").style.display = "none";
    document.getElementById("home-section").style.display ="block";
}
function update() {
    const id = document.getElementById("detail-id").textContent;
    const newStatus = document.getElementById("detailsstatus").value;

    const order = orderData.find(o => o.id === id);
    if (order) {
        order.status = newStatus;
        displayOrder(orderData); // Cập nhật lại bảng
        alert("Đã cập nhật trạng thái đơn hàng!");
        closeDetails();
    } else {
        alert("Không tìm thấy đơn hàng để cập nhật!");
    }
}
// sidebar
document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".sidebar-menu a");
  const sections = document.querySelectorAll(".admin-section");

  menuItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = item.dataset.section;

      // Ẩn tất cả phần
      sections.forEach(sec => sec.style.display = "none");

      // Hiện phần tương ứng
      const active = document.getElementById(`${target}-section`);
      if (active) active.style.display = "block";
        
    });
  });

  // Mặc định hiển thị Trang chủ
  document.getElementById("home-section").style.display = "block";
});
