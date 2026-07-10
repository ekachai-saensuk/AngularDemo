export interface Product {
  id: number;
  name: string;        // ชื่อสินค้า
  category: string;    // หมวดหมู่
  price: number;       // ราคา
  quantity: number;     // จำนวนคงคลัง
  unit: string;         // หน่วยนับ (ชิ้น, กล่อง, กก. ฯลฯ)
  description?: string; // รายละเอียดเพิ่มเติม
  updatedAt: string;    // วันที่แก้ไขล่าสุด (ISO string)
}
