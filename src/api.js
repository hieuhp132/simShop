import axios from "axios";

// Thay thế bằng  thật của bạn
const API_TOKEN = "";

// ================================== User ==================================
async function getUserProfile() {
  try {
    const response = await axios.get("https://5sim.net/v1/user/profile", {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    const data = response.data;

    console.log("🧾 Thông tin người dùng:");
    console.log(`ID: ${data.id}`);
    console.log(`Email: ${data.email}`);
    console.log(`Balance: ${data.balance}`);
    console.log(`Rating: ${data.rating}`);
    console.log(`Default Country: ${data.default_country?.name}`);
    console.log(`Forwarding Number: ${data.default_forwarding_number}`);
  } catch (error) {
    if (error.response) {
      console.error(
        "❌ Lỗi từ API:",
        error.response.status,
        error.response.data
      );
    } else {
      console.error("❌ Lỗi không xác định:", error.message);
    }
  }
}
async function getOrderHistory(
  category = "activation",
  limit = 10,
  offset = 0
) {
  try {
    const url = `https://5sim.net/v1/user/orders?category=${category}&limit=${limit}&offset=${offset}`;
    const headers = {
      Authorization: `Bearer ${API_TOKEN}`,
      Accept: "application/json",
    };

    const response = await axios.get(url, { headers });
    const data = response.data;
    if (!Array.isArray(data.Data)) {
      console.error("❌ Không có dữ liệu đơn hàng hoặc sai định dạng:", data);
      return;
    }

    console.log("🧾 Lịch sử đơn hàng:");
    data.Data.forEach((order, index) => {
      console.log(`\n🧩 Đơn #${index + 1}`);
      console.log(`ID: ${order.id}`);
      console.log(`Phone: ${order.phone}`);
      console.log(`Product: ${order.product}`);
      console.log(`Price: ${order.price}`);
      console.log(`Status: ${order.status}`);
      console.log(`Created at: ${order.created_at}`);
      console.log(`Country: ${order.country}`);
    });

    console.log(`\n📦 Tổng đơn hàng: ${data.Total}`);
  } catch (error) {
    console.error("❌ Lỗi:", error.response?.data || error.message);
  }
}

async function getPaymentHistory(limit = 10, offset = 0) {
  try {
    const url = `https://5sim.net/v1/user/payments?limit=${limit}&offset=${offset}`;
    const headers = {
      Authorization: `Bearer ${API_TOKEN}`,
      Accept: "application/json",
    };

    const response = await axios.get(url, { headers });
    const data = response.data;
    if (!Array.isArray(data.Data)) {
      console.error("❌ Không có dữ liệu đơn hàng hoặc sai định dạng:", data);
      return;
    }

    console.log("💰 Lịch sử thanh toán:");
    data.Data.forEach((payment, index) => {
      console.log(`\n🧾 Giao dịch #${index + 1}`);
      console.log(`ID: ${payment.ID}`);
      console.log(`Loại: ${payment.TypeName}`);
      console.log(`Nhà cung cấp: ${payment.ProviderName}`);
      console.log(`Số tiền: ${payment.Amount}`);
      console.log(`Số dư sau thanh toán: ${payment.Balance}`);
      console.log(`Thời gian: ${payment.CreatedAt}`);
    });

    console.log(`\n📊 Tổng giao dịch: ${data.Total}`);
  } catch (error) {
    console.error("❌ Lỗi:", error.response?.data || error.message);
  }
}
// ================================== Price Limits ==================================

async function getPriceLimits() {
  try {
    const response = await axios.get("https://5sim.net/v1/user/max-prices", {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    const data = response.data;

    if (!Array.isArray(data)) {
      console.log("❌ Không có dữ liệu hoặc sai định dạng:", data);
      return;
    }

    console.log("📦 Danh sách giới hạn giá:");
    data.forEach((item, index) => {
      console.log(`\n#${index + 1}`);
      console.log(`🆔 ID: ${item.id}`);
      console.log(`📱 Product: ${item.product}`);
      console.log(`💵 Price: ${item.price}`);
      console.log(`📅 Created at: ${item.created_at}`);
    });
  } catch (error) {
    console.error(
      "❌ Lỗi khi lấy giới hạn giá:",
      error.response?.data || error.message
    );
  }
}

async function deletePriceLimit(productName) {
  try {
    const response = await axios.delete("https://5sim.net/v1/user/max-prices", {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
      data: {
        product_name: productName,
      },
    });

    console.log(`✅ Đã xóa giới hạn giá của sản phẩm "${productName}"`);
    console.log(response.data);
  } catch (error) {
    console.error(
      `❌ Lỗi khi xóa giới hạn giá cho "${productName}":`,
      error.response?.data || error.message
    );
  }
}

async function createOrUpdatePriceLimit(productName, price) {
  try {
    const response = await axios.post(
      "https://5sim.net/v1/user/max-prices",
      {
        product_name: productName,
        price: price,
      },
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    console.log(
      `✅ Đã tạo/cập nhật giới hạn giá cho sản phẩm "${productName}" với giá ${price}`
    );
    console.log(response.data);
  } catch (error) {
    console.error(
      `❌ Lỗi khi tạo/cập nhật giới hạn giá cho "${productName}":`,
      error.response?.data || error.message
    );
  }
}

// =================================================== Products and prices ===================================================

async function getProducts(country, operator) {
  const url = `https://5sim.net/v1/guest/products/${country}/${operator}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // data là object có dạng như ví dụ response trong docs
    // Ví dụ in ra danh sách products
    for (const [productName, productInfo] of Object.entries(data)) {
      console.log(`Product: ${productName}`);
      console.log(`Category: ${productInfo.Category}`);
      console.log(`Quantity: ${productInfo.Qty}`);
      console.log(`Price: ${productInfo.Price}`);
      console.log("------------------------");
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

async function getPrices() {
  const url = "https://5sim.net/v1/guest/prices";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // data có dạng object lồng nhau như ví dụ
    console.log("Prices response:", data);

    // Ví dụ in ra giá và số lượng sản phẩm cho mỗi nước, nhà mạng
    for (const country in data) {
      console.log(`Country: ${country}`);
      const products = data[country];
      for (const productId in products) {
        console.log(`  Product ID: ${productId}`);
        const operators = products[productId];
        for (const operator in operators) {
          const info = operators[operator];
          console.log(`    Operator: ${operator}`);
          console.log(`      Cost: ${info.cost}`);
          console.log(`      Count: ${info.count}`);
          console.log(`      Rate: ${info.rate}`);
        }
      }
    }
  } catch (error) {
    console.error("Error fetching prices:", error);
  }
}

async function getPricesByCountry(country) {
  const url = `https://5sim.net/v1/guest/prices?country=${encodeURIComponent(
    country
  )}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Prices for country: ${country}`, data);

    // Xử lý dữ liệu tuỳ bạn, ví dụ:
    for (const productId in data) {
      const operators = data[productId];
      for (const operator in operators) {
        const info = operators[operator];
        console.log(
          `Product ID: ${productId}, Operator: ${operator}, Cost: ${info.cost}, Count: ${info.count}, Rate: ${info.rate}`
        );
      }
    }
  } catch (error) {
    console.error("Error fetching prices by country:", error);
  }
}

async function getPricesByProduct(product) {
  const url = `https://5sim.net/v1/guest/prices?product=${encodeURIComponent(
    product
  )}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Prices for product: ${product}`, data);

    // Xử lý dữ liệu tuỳ bạn, ví dụ:
    for (const country in data) {
      const operators = data[country];
      for (const operator in operators) {
        const info = operators[operator];
        console.log(
          `Country: ${country}, Operator: ${operator}, Cost: ${info.cost}, Count: ${info.count}, Rate: ${info.rate}`
        );
      }
    }
  } catch (error) {
    console.error("Error fetching prices by product:", error);
  }
}
async function getPricesByCountryAndProduct(country, product) {
  const url = `https://5sim.net/v1/guest/prices?country=${encodeURIComponent(
    country
  )}&product=${encodeURIComponent(product)}`;

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

// ========================================================= Purchase =========================================================
async function buyActivationNumber(country, operator, product, options = {}) {
  try {
    // Xây dựng URL
    const baseUrl = `https://5sim.net/v1/user/buy/activation/${encodeURIComponent(
      country
    )}/${encodeURIComponent(operator)}/${encodeURIComponent(product)}`;

    // Các tham số query option
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    }

    const url = queryParams.toString()
      ? `${baseUrl}?${queryParams.toString()}`
      : baseUrl;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data = await response.json();
    console.log("Bought number data:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

async function buyHostingNumber(country, operator, product) {
  try {
    const url = `https://5sim.net/v1/user/buy/hosting/${encodeURIComponent(
      country
    )}/${encodeURIComponent(operator)}/${encodeURIComponent(product)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data = await response.json();
    console.log("Bought hosting number data:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

async function reBuyNumber(product, number) {
  try {
    const url = `https://5sim.net/v1/user/reuse/${encodeURIComponent(
      product
    )}/${encodeURIComponent(number)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data = await response.json();
    console.log("Re-buy number response data:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

// ========================================================= Order management =========================================================
async function checkOrder(orderId) {
  try {
    const url = `https://5sim.net/v1/user/check/${encodeURIComponent(orderId)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data = await response.json();
    console.log("Check order response data:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

async function finishOrder(orderId) {
  try {
    const url = `https://5sim.net/v1/user/finish/${encodeURIComponent(
      orderId
    )}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data = await response.json();
    console.log("Finish order response data:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}
async function cancelOrder(orderId) {
  try {
    const url = `https://5sim.net/v1/user/cancel/${encodeURIComponent(
      orderId
    )}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data = await response.json();
    console.log("Cancel order response data:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

async function banOrder(orderId) {
  try {
    const url = `https://5sim.net/v1/user/ban/${encodeURIComponent(orderId)}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data = await response.json();
    console.log("Ban order response data:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

async function getSmsInboxList(orderId) {
  try {
    const url = `https://5sim.net/v1/user/sms/inbox/${encodeURIComponent(
      orderId
    )}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data = await response.json();
    console.log("SMS inbox list:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

// ======================================================== Notifications ========================================================
async function getVendorInfo() {
  try {
    const url = "https://5sim.net/v1/user/vendor";

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data = await response.json();
    console.log("Vendor info:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

async function getWalletsReserve() {
  try {
    const url = "https://5sim.net/v1/vendor/wallets";

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data = await response.json();
    console.log("Wallets reserve:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

async function getVendorOrdersHistory(category, limit, offset, order, reverse) {
  try {
    const params = new URLSearchParams({
      category: category,
    });

    if (limit) params.append("limit", limit);
    if (offset) params.append("offset", offset);
    if (order) params.append("order", order);
    if (reverse !== undefined) params.append("reverse", reverse);

    const url = `https://5sim.net/v1/vendor/orders?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data = await response.json();
    console.log("Vendor orders history:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

async function getVendorPaymentsHistory(limit, offset, order, reverse) {
  try {
    const params = new URLSearchParams();

    if (limit) params.append("limit", limit);
    if (offset) params.append("offset", offset);
    if (order) params.append("order", order);
    if (reverse !== undefined) params.append("reverse", reverse);

    const url = `https://5sim.net/v1/vendor/payments?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data = await response.json();
    console.log("Vendor payments history:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

async function createPayout(receiver, method, amount, fee) {
  try {
    const url = "https://5sim.net/v1/vendor/withdraw";

    const payload = {
      receiver: receiver,
      method: method,
      amount: amount,
      fee: fee,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data = await response.json();
    console.log("Create payout response:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
}

// ====================================================== Country list ======================================================
export async function getCountriesList() {
  const url = "https://5sim.net/v1/guest/countries";

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
