// readCountryNameAndWriteToTxt.mjs
import { countryDataMap } from '../assets/data/adjusted/countryDataIndex.js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Danh sách quốc gia lấy trực tiếp từ countryDataMap
const countryNames = Object.keys(countryDataMap);

// Thư mục lưu dữ liệu JSON
const dataDir = path.join(__dirname, '../assets/data/updated');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  for (const country of countryNames) {
    const url = `https://5sim.net/v1/guest/prices?country=${country}`;
    console.log(`🔄 Đang lấy dữ liệu từ: ${country}`);

    try {
      const response = await axios.get(url, {
        headers: { 'Accept': 'application/json' }
      });

      const outputPath = path.join(dataDir, `${country}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(response.data, null, 2), 'utf8');
      console.log(`✅ Dữ liệu ${country} đã được lưu vào ${outputPath}`);
    } catch (error) {
      console.error(`❌ Lỗi với ${country}:`, error.response?.status || error.message);
    }

    // 👉 Delay 5 giây giữa các request để tránh bị chặn
    await delay(5000);
  }
})();
