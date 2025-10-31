//Quản lý giá bán
    const priceModal = document.getElementById('popup');
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
    fetch("/data/manageproduct.json")
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
            openPriceModal("edit", e.target);
        } else if (e.target.classList.contains("delete")) {
            confirmDelete(e.target);
        }
    });

    function openPriceModal(mode, btn) {
        form.reset();
        priceInput.value = '';
        priceModal.style.display = 'flex'; 
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

    cancelBtn.onclick = () => priceModal.style.display = 'none';

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
        priceModal.style.display = 'none';
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
            openSection("home-section");
            document.getElementById('xacnhanthoat').style.display='none';
            document.getElementById('price-section').style.display='none';
            document.getElementById('home-section').style.display='block';
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
    openSection("home-section");
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
//Quản lý tồn kho

const tableBody = document.querySelector('#Table tbody');
const Modal = document.getElementById('detailModal');
const summaryModal = document.getElementById('popup-modal');
const btnSearch = document.getElementById('Btnsearch');
const exportBtn = document.getElementById('exportBtn');
const viewDetails = document.querySelector('.view-details');
const closeBtns = document.querySelectorAll('.close-btn, .closepopup');
const nameSearch = document.getElementById('Namesearch');
const nhanhieuSelect = document.getElementById('danhsach');
const cuahangSelect = document.getElementById('kho');
let inventory =[];
let filterData=[];
fetch("/data/ton.json")
    .then(response => response.json())
    .then(data => {
        inventory=data;
        filterData = [...inventory];
        renderTable(filterData);
        renderSummary(filterData);
    })
    .catch(error => console.error("Lỗi khi tải JSON: ", error));
function renderTable(data){
    if(!tableBody) return;
    tableBody.innerHTML='';
    if(data.length===0){
        tableBody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Không tìm thấy sản phẩm.</td></tr>';
        return;
    }
    data.forEach(item=>{
        const row = document.createElement('tr');
        let statusText = 'Còn hàng', statusClass = 'ok';
        if(item.slTon===0){statusText = 'Hết hàng';statusClass = 'out';}
        else if(item.slTon<=item.minTon){statusText = 'Sắp hết';statusClass = 'low';}
        row.innerHTML=`
            <td>${item.maSP}</td>
            <td>${item.nhanHieu}</td>
            <td>${item.tenSP}</td>
            <td>${item.slNhap.toLocaleString()}</td>
            <td>${item.slXuat.toLocaleString()}</td>
            <td>${item.slTon.toLocaleString()}</td>
            <td>${item.ngayCapNhat}</td>
            <td><span class="${statusClass}">${statusText}</span></td>
        `;
        row.addEventListener('click', () => openModal(item));
        tableBody.appendChild(row);
    });
}
function renderSummary(data){
    document.getElementById('outcount').textContent = data.filter(i => i.slTon === 0).length;
    document.getElementById('lowcount').textContent = data.filter(i => i.slTon >0 && i.slTon <= i.minTon).length;
    document.getElementById('okcount').textContent = data.filter(i => i.slTon > i.minTon).length;
}
function openModal(item){
    if(!Modal) return;
    document.getElementById('modalMaSP').textContent=item.maSP;
    document.getElementById('modalTenSP').textContent=item.tenSP;
    document.getElementById('modalNhanhieuSP').textContent=item.nhanHieu;
    document.getElementById('modalKhoSP').textContent=item.khoHang;
    document.getElementById('modalGhichuSP').textContent=item.ghiChu || 'Không có ghi chú';

    const historyBody = document.getElementById('modalHistoryBody');
    historyBody.innerHTML='';
    if (item.history && item.history.length > 0) {
        item.history
            .sort((a,b) => new Date(b.ngay) - new Date(a.ngay))
            .slice(0,5)
            .forEach(hist => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${hist.ngay}</td>
                    <td class="${hist.hanhDong === 'Xuất' ? 'action-xuat':'action-nhap'}">${hist.hanhDong}</td>
                    <td>${hist.soLuong.toLocaleString()}</td>
                    <td>${hist.nguoiThucHien}</td>
                `;
            historyBody.appendChild(row);
        });
    } else {
         historyBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Không có lịch sử nhập/xuất gần đây.</td></tr>';
    }
    Modal.classList.add('show');
} 
function openSummaryModal(){
    if(!summaryModal) return;
    const outOfStock = inventory.filter(item=>item.slTon === 0);
    const lowStock = inventory.filter(item=>item.slTon>0 && item.slTon <= item.minTon);
    const inStock = inventory.filter(item => item.slTon > item.minTon);
    document.getElementById('sum-outcount').textContent = `(${outOfStock.length})`;
    document.getElementById('sum-lowcount').textContent = `(${lowStock.length})`;
    document.getElementById('sum-okcount').textContent = `(${inStock.length})`;
    const outList = document.getElementById('sum-outList');
    const lowList = document.getElementById('sum-lowlist');
    const okList = document.getElementById('sum-oklist');
    const createListItems = (list) => list.map(item => 
        `<li><span class="summary-code">[${item.maSP}]</span> ${item.tenSP}</li>`
    ).join('');

    outList.innerHTML = outOfStock.length ? createListItems(outOfStock) : '<li>Không có sản phẩm nào.</li>';
    lowList.innerHTML = lowStock.length ? createListItems(lowStock) : '<li>Không có sản phẩm nào.</li>';
    okList.innerHTML = inStock.length ? createListItems(inStock) : '<li>Không có sản phẩm nào.</li>';

    summaryModal.classList.add('show');
}
if(btnSearch) {
    btnSearch.addEventListener('click', () => {
        const keyword = nameSearch.value.toLowerCase();
        const nhanHieu = nhanhieuSelect.value;
        const kho = cuahangSelect.value;
        let startDate = null, endDate = null;
        const startInput = document.getElementById("startDate").value;
        const endInput = document.getElementById("endDate").value;
        filterData = inventory.filter(item => {
            const itemDate = new Date(item.ngayCapNhat);
            return (
                (item.maSP.toLowerCase().includes(keyword) || item.tenSP.toLowerCase().includes(keyword)) &&
                (!nhanHieu || item.nhanHieu === nhanHieu) &&
                (!kho || item.khoHang === kho) &&
                (!startDate || !endDate || (itemDate >= startDate && itemDate <= endDate))
            );
        });
        renderTable(filterData);
        renderSummary(filterData);
    });
}
if (exportBtn) {
    exportBtn.addEventListener('click', () => {
        alert('Đã xuất báo cáo thành công! (Dữ liệu dựa trên kết quả lọc hiện tại)');
    });
}
if (viewDetails) {
    viewDetails.addEventListener('click', (e) => {
        e.preventDefault(); 
        openSummaryModal();
    });
}
closeBtns.forEach(btn => {
    btn.onclick = function() {
        if(Modal) Modal.classList.remove('show');
        if(summaryModal) summaryModal.classList.remove('show');
    }
});
function closeInventory(){
    const stockSection = document.getElementById("stock-section");
    if (stockSection) stockSection.style.display = "none";
    const modal = document.getElementById("detailModal");
    const popup = document.getElementById("popup-modal");
    if (modal) modal.classList.remove("show");
    if (popup) popup.classList.remove("show");
    openSection("home-section");

}
function openDetailModal(item) {
    Modal.classList.add('show');
}
function closeModal() {
    Modal.classList.remove('show');
}
function openminiPU() {
    summaryModal.classList.add('show');
}
function closeMiniPU() {
    summaryModal.classList.remove('show');
}

// sidebar
document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".sidebar-menu a");

  menuItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = item.dataset.section;
      openSection(`${target}-section`);
    });
  });

  // Hiển thị mặc định
  openSection("home-section");
});
function openSection(id) {
  // Ẩn tất cả section
  document.querySelectorAll(".admin-section").forEach(sec => {
    sec.style.display = "none";
  });

  // Ẩn tất cả popup/modal nếu có
  document.querySelectorAll(".modal, .popup").forEach(p => {
    p.style.display = "none";
    p.classList.remove("show");
  });

  // Hiện section được chọn
  const target = document.getElementById(id);
  if (target) target.style.display = "block";
}
