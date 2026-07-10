import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-form'
  , standalone: true
  , imports: [CommonModule, ReactiveFormsModule, RouterLink]
  , templateUrl: './product-form.component.html'
  , styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  private productId: number | null = null;

  public form: FormGroup;
  public isEditMode = false;
  public categories = ['เสื้อผ้า', 'เครื่องดื่ม', 'เครื่องเขียน', 'อาหาร', 'อิเล็กทรอนิกส์', 'อื่นๆ'];
  public units = ['ชิ้น', 'ตัว', 'กล่อง', 'ถุง', 'เล่ม', 'กก.', 'ลิตร'];

  public constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      unit: ['', Validators.required],
      description: [''],
    });
  }

  public ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.productId = Number(idParam);
      const product = this.productService.getById(this.productId);
      if (product) {
        this.form.patchValue(product);
      } else {
        this.router.navigate(['/products']);
      }
    }
  }

  public get f() {
    return this.form.controls;
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;

    if (this.isEditMode && this.productId !== null) {
      this.productService.update(this.productId, value);
    } else {
      this.productService.add(value);
    }

    this.router.navigate(['/products']);
  }

  public onCancel(): void {
    this.router.navigate(['/products']);
  }
}
