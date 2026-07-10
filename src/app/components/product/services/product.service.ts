import { Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

const STORAGE_KEY = 'pm_products';

const SEED_DATA: Product[] = [
  {
    id: 1,
    name: 'เสื้อยืดคอกลม',
    category: 'เสื้อผ้า',
    price: 199,
    quantity: 120,
    unit: 'ตัว',
    description: 'เสื้อยืดผ้าคอตตอน 100%',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'กาแฟคั่วกลาง',
    category: 'เครื่องดื่ม',
    price: 150,
    quantity: 45,
    unit: 'ถุง',
    description: 'เมล็ดกาแฟอาราบิก้าคั่วกลาง 250 กรัม',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'สมุดโน้ต A5',
    category: 'เครื่องเขียน',
    price: 45,
    quantity: 300,
    unit: 'เล่ม',
    description: 'สมุดปกแข็ง 100 แผ่น',
    updatedAt: new Date().toISOString(),
  },
];

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // ใช้ signal เพื่อให้ template อัปเดตอัตโนมัติเมื่อข้อมูลเปลี่ยน
  private productsSignal = signal<Product[]>(this.loadFromStorage());

  readonly products = this.productsSignal.asReadonly();

  private loadFromStorage(): Product[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as Product[];
      }
    } catch {
      // ถ้าอ่านข้อมูลผิดพลาด ให้ใช้ข้อมูลตั้งต้นแทน
    }
    this.saveToStorage(SEED_DATA);
    return SEED_DATA;
  }

  private saveToStorage(products: Product[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }

  private commit(products: Product[]): void {
    this.productsSignal.set(products);
    this.saveToStorage(products);
  }

  getAll(): Product[] {
    return this.productsSignal();
  }

  getById(id: number): Product | undefined {
    return this.productsSignal().find((p) => p.id === id);
  }

  add(product: Omit<Product, 'id' | 'updatedAt'>): void {
    const current = this.productsSignal();
    const nextId = current.length > 0 ? Math.max(...current.map((p) => p.id)) + 1 : 1;
    const newProduct: Product = {
      ...product,
      id: nextId,
      updatedAt: new Date().toISOString(),
    };
    this.commit([...current, newProduct]);
  }

  update(id: number, changes: Omit<Product, 'id' | 'updatedAt'>): void {
    const current = this.productsSignal();
    const updated = current.map((p) =>
      p.id === id ? { ...p, ...changes, updatedAt: new Date().toISOString() } : p
    );
    this.commit(updated);
  }

  delete(id: number): void {
    const current = this.productsSignal();
    this.commit(current.filter((p) => p.id !== id));
  }

  search(term: string): Product[] {
    const lower = term.trim().toLowerCase();
    if (!lower) return this.productsSignal();
    return this.productsSignal().filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );
  }
}
