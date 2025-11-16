/* ======================================================
              RÀNG BUỘC QUẢN LÝ SẢN PHẨM
====================================================== */
function validateProductForm(prod) {
  // Mã sản phẩm: SP + 2-3 chữ số
  if (!/^SP\d{2}$/.test(prod.id)) {
    alert("Mã sản phẩm phải có dạng SP01!");
    return false;
  }

  // Tên sản phẩm không được trống, không quá dài
  if (!prod.name || prod.name.length > 100) {
    alert("Tên sản phẩm không hợp lệ (rỗng hoặc quá dài)!");
    return false;
  }

  // Mã loại sản phẩm phải hợp lệ
  const categories = getLocal("categoryList");
  if (!categories.some(c => c.id === prod.categoryId)) {
    alert("Mã loại sản phẩm không tồn tại!");
    return false;
  }

  // Màu sắc chỉ chứa ký tự chữ và khoảng trắng
  if (!/^[A-Za-zÀ-ỹ\s]+$/.test(prod.color)) {
    alert("Màu sắc chỉ được chứa chữ và khoảng trắng!");
    return false;
  }

  // Dung lượng phải kết thúc bằng GB hoặc TB
  if (!/^\d+(GB|TB)$/.test(prod.storage)) {
    alert("Dung lượng phải kết thúc bằng GB hoặc TB!");
    return false;
  }

  // RAM phải kết thúc bằng GB
  if (!/^\d+GB$/.test(prod.ram)) {
    alert("RAM phải có dạng 8GB, 16GB,...");
    return false;
  }

  // Màn hình phải bắt đầu bằng số và có “inch”
  if (!/^\d+(\.\d+)?\s*inch/.test(prod.display)) {
    alert("Màn hình phải bắt đầu bằng kích thước (ví dụ: 6.1 inch)");
    return false;
  }

  // Camera phải có “MP”
  if (!/MP/.test(prod.camera)) {
    alert("Camera phải có thông số MP!");
    return false;
  }

  // Pin phải có “mAh”
  if (!/mAh/.test(prod.battery)) {
    alert("Dung lượng pin phải có đơn vị mAh!");
    return false;
  }

  // Mô tả không dài quá 300 ký tự
  if (prod.desc.length > 300) {
    alert("Mô tả không được dài hơn 300 ký tự!");
    return false;
  }

  return true;
}
function checkDuplicateProduct(prod) {
  const products = getLocal("productList");
  const exists = products.some(p => p.id === prod.id && p.id !== (editingProductRow?.id));
  if (exists) {
    alert("Mã sản phẩm đã tồn tại!");
    return false;
  }

  const nameExists = products.some(p => 
    p.name.toLowerCase() === prod.name.toLowerCase() && p.id !== prod.id
  );
  if (nameExists) {
    alert("Tên sản phẩm đã tồn tại!");
    return false;
  }
  return true;
}
/* ======================================================
              RÀNG BUỘC QUẢN LÝ NHẬP SẢN PHẨM
====================================================== */

// -------------------- RÀNG BUỘC DỮ LIỆU CƠ BẢN --------------------
function validateImportForm(pn) {
  // Mã phiếu nhập phải đúng định dạng PNxx hoặc PNxxx
  if (!/^PN\d{2,3}$/.test(pn.id)) {
    alert("Mã phiếu nhập phải có dạng PN01 hoặc PN001!");
    return false;
  }

  // Ngày nhập phải có giá trị và không lớn hơn ngày hiện tại
  if (!pn.date) {
    alert("Vui lòng nhập ngày nhập!");
    return false;
  }
  const inputDate = new Date(pn.date);
  const today = new Date();
  if (inputDate > today) {
    alert("Ngày nhập không được lớn hơn ngày hiện tại!");
    return false;
  }

  // Trạng thái chỉ cho phép hai giá trị
  if (!["pending", "completed"].includes(pn.status)) {
    alert("Trạng thái phiếu nhập không hợp lệ!");
    return false;
  }

  // Phải có ít nhất một sản phẩm
  if (!pn.items || pn.items.length === 0) {
    alert("Phiếu nhập phải có ít nhất 1 sản phẩm!");
    return false;
  }

  // Tổng giá trị phải hợp lệ
  if (pn.total <= 0) {
    alert("Tổng giá trị phiếu nhập không hợp lệ!");
    return false;
  }

  return true;
}

// -------------------- RÀNG BUỘC TRÙNG LẶP --------------------
function checkDuplicateImport(pn) {
  const imports = getLocal("importList");

  
  // Mã phiếu đã tồn tại
  const exists = imports.some(i => i.id === pn.id && i.id !== (editingImportRow?.id));
  if (exists) {
    alert(" Mã phiếu nhập đã tồn tại!");
    return false;
  }

  // Không cho sửa phiếu hoàn thành
  const existing = imports.find(i => i.id === pn.id);
  if (existing && existing.status === "Hoàn thành") {
    alert(" Không thể sửa phiếu đã hoàn thành!");
    return false;
  }

  return true;
}

// -------------------- RÀNG BUỘC NGHIỆP VỤ --------------------
function businessLogicImportCheck(pn) {
  const productList = getLocal("productList");
  const categoryList = getLocal("categoryList");

  // Từng sản phẩm trong phiếu nhập phải tồn tại trong danh mục
  for (const item of pn.items) {
    const prod = productList.find(p => p.id === item.productId);
    if (!prod) {
      alert(` Sản phẩm mã ${item.productId} không tồn tại trong danh mục!`);
      return false;
    }

    // Số lượng phải > 0
    if (item.quantity <= 0) {
      alert(`Sản phẩm ${item.productId} có số lượng không hợp lệ!`);
      return false;
    }

    // Giá nhập phải > 0
    if (item.price <= 0) {
      alert(`Sản phẩm ${item.productId} có giá nhập không hợp lệ!`);
      return false;
    }

    // Không trùng sản phẩm trong cùng phiếu
    const duplicates = pn.items.filter(i => i.productId === item.productId);
    if (duplicates.length > 1) {
      alert(`Sản phẩm ${item.productId} bị trùng trong danh sách nhập!`);
      return false;
    }

    // Không nhập sản phẩm thuộc thương hiệu ngừng kinh doanh
    const cate = categoryList.find(c => c.id === prod.categoryId);
    if (cate?.status === "inactive") {
      alert(`Không thể nhập sản phẩm thuộc thương hiệu ${cate.brand} (đã ngừng kinh doanh)!`);
      return false;
    }
  }

  // Tổng giá trị quá thấp → xác nhận lại
  if (pn.total < 1_000_000) {
    const confirmSmall = confirm("Tổng giá trị phiếu nhập quá thấp. Bạn có chắc muốn lưu?");
    if (!confirmSmall) return false;
  }

  // Kiểm tra mối liên kết với tồn kho
  if (typeof processInventoryUpdate !== "function") {
    console.warn("Chưa có hàm cập nhật tồn kho (processInventoryUpdate)!");
  }

  return true;
}
