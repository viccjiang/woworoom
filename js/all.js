const productList = document.querySelector(".productWrap");
const productFilter = document.querySelector(".productSelect");
const cartList = document.querySelector(".shoppingCart-tableList");
const delAllItems = document.querySelector(".discardAllBtn");
// 綁定 form 表單
const orderInfoForm = document.querySelector(".orderInfo-form");
const sendOrderBtn = document.querySelector(".orderInfo-btn");

const inputs = document.querySelectorAll("input[name],select");
const form = document.querySelector(".orderInfo-form");
const constraints = {
  姓名: {
    presence: {
      message: "必填欄位",
    },
  },
  電話: {
    presence: {
      message: "必填欄位",
    },
    length: {
      minimum: 8,
      message: "需超過 8 碼",
    },
  },
  信箱: {
    presence: {
      message: "必填欄位",
    },
    email: {
      message: "格式錯誤",
    },
  },
  寄送地址: {
    presence: {
      message: "必填欄位",
    },
  },
  交易方式: {
    presence: {
      message: "必填欄位",
    },
  },
};

let productData = [];
let cartData = [];

// 初始化
function init() {
  formValidate();
  getProductData();
  getCartData();
}
// 取得產品列表
function getProductData() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then((res) => {
      productData = res.data.products;
      console.log("所有產品列表", productData);
      renderProductList();
    })
    .catch((error) => {
      console.log("錯誤資訊", error.message);
    });
}
// 組產品列表字串
function strCombination(productDataItem) {
  return `<li class="productCard">
  <h4 class="productType">新品</h4>
  <img src="${productDataItem.images}" alt="">
  <a href="#" class="js-addCart" data-id="${productDataItem.id}">加入購物車</a>
  <h3>${productDataItem.title}</h3>
  <del class="originPrice">NT$${productDataItem.origin_price}</del>
  <p class="nowPrice">NT$${productDataItem.price}</p>
  </li>`;
}
// 渲染產品列表
function renderProductList() {
  let str = "";
  productData.forEach((productDataItem) => {
    str += strCombination(productDataItem);
  });
  productList.innerHTML = str;
}
// 監聽下拉選單 category 篩選器
productFilter.addEventListener("change", dataFilter);
function dataFilter(e) {
  const category = e.target.value;
  console.log(category);

  // 篩選判斷
  if (category === "全部") {
    renderProductList();
    return;
  }
  productData.forEach((item) => {
    if (item.category === category) {
      let str = "";
      productData.forEach(function (item) {
        if (item.category == category) {
          str += strCombination(item);
        }
      });
      productList.innerHTML = str;
    }
  });
}
// 監聽列表內的加入購物車按鈕並且取得產品 id
productList.addEventListener("click", function (e) {
  e.preventDefault();
  const addCartClass = e.target.getAttribute("class");
  if (addCartClass !== "js-addCart") {
    alert("請加入購物車");
    return;
  }
  // 取出 id 資料，加入購物車
  let productId = e.target.dataset.id;
  let addNum = 1; // 預設都是一筆資料
  cartData.forEach(function (item) {
    if (item.product.id == productId) {
      addNum = item.quantity += 1;
    }
  });
  // 傳入參數，axios 需要傳入 id 以及 數量
  addCart(productId, addNum);
});

// 加入購物車
function addCart(id, num) {
  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`,
      {
        data: {
          productId: id,
          quantity: num,
        },
      }
    )
    .then((res) => {
      alert("已加入購物車");
      getCartData(); // 重新 render渲染購物車列表
    })
    .catch((error) => {
      console.log("錯誤資訊", error.message);
    });
}

// 取得購物車資料
function getCartData() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then((res) => {
      const jsTotal = document.querySelector(".js-total"); // 總金額
      jsTotal.textContent = res.data.finalTotal;
      cartData = res.data.carts;
      console.log("購物車列表", cartData);
      renderCartList();
    })
    .catch((error) => {
      console.log("錯誤資訊", error.message);
    });
}
// 渲染購物車列表
function renderCartList() {
  let str = "";
  cartData.forEach((item) => {
    str += `<tr>
      <td>
        <div class="cardItem-title">
          <img src="${item.product.images}" alt="">
          <p>${item.product.title}</p>
        </div>
      </td>
      <td>NT$${item.product.origin_price}</td>
      <td>${item.quantity}</td>
      <td>NT$${item.product.price * item.quantity}</td>
      <td class="discardBtn">
        <a href="#" class="material-icons" data-id="${item.id}">
        delete
        </a>
      </td>
    </tr>`;
  });
  cartList.innerHTML = str;
}

// 刪除購物車單一品項
cartList.addEventListener("click", deleteItem);
function deleteItem(e) {
  e.preventDefault();
  let itemId = e.target.dataset.id;
  console.log(itemId);
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${itemId}`
    )
    .then(() => {
      console.log("刪除成功");
      getCartData();
    });
}

//刪除所有購物車品項

delAllItems.addEventListener("click", deleteAllItems);
function deleteAllItems(e) {
  e.preventDefault();
  axios
    .delete(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`
    )
    .then(() => {
      alert("已清空購物車");
      getCartData();
    })
    .catch(() => {
      alert("購物車已清空，請勿重複點擊");
    });
}

// 表單驗證
function formValidate() {

  inputs.forEach((item) => {
    item.addEventListener("change", function () {
      item.nextElementSibling.textContent = "";
      let errors = validate(form, constraints) || "";
      console.log(errors);

      if (errors) {
        Object.keys(errors).forEach(function (keys) {
          document.querySelector(`[data-message="${keys}"]`).textContent =
            errors[keys];
        });
      }
    });
  });
}

sendOrderBtn.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(e.target);
  let cartLength = cartData.length;
  console.log(cartLength);

  //先確認購物車是否有數量
  if (cartData.length == 0) {
    alert("請加入購物車");
    return;
  }
  // 先確認表單資訊是否有填寫
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value == "") return alert("所有欄位請填寫完畢");
  }

  
  // 綁定 DOM 並且取出表單裡面的值
  const customerName = document.querySelector("#customerName").value;
  const customerPhone = document.querySelector("#customerPhone").value;
  const customerEmail = document.querySelector("#customerEmail").value;
  const customerAddress = document.querySelector("#customerAddress").value;
  const customerTradeWay = document.querySelector("#tradeWay").value;

  formValidate();

  axios
    .post(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
      {
        data: {
          user: {
            name: customerName,
            tel: customerPhone,
            email: customerEmail,
            address: customerAddress,
            payment: customerTradeWay,
          },
        },
      }
    )
    .then(() => {
      alert("訂單建立成功");
      //方法一：訂單建立成功後，清空資料，變回空字串
      orderInfoForm.reset();

      //方法二：訂單建立成功後，清空資料，變回空字串
      // document.querySelector("#customerName").value = "";//訂單建立成功後，清空資料，變回空字串
      // document.querySelector("#customerPhone").value = "";
      // document.querySelector("#customerEmail").value = "";
      // document.querySelector("#customerAddress").value = "";
      // document.querySelector("#tradeWay").value = "ATM";//訂單建立成功後，初始值

      getCartData(); //重新取得購物車資料
    })
    .catch((error) => {
      console.log("錯誤資訊", error.message);
    });
});

init();
