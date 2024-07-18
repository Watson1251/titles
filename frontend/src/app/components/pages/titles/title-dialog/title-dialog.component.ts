import { Component, Inject } from '@angular/core';
import { AngularMaterialModule } from '../../../../angular-material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { UsersService } from '../../../../services/users.services';
import { Role } from '../../../../models/role.model';
import { TitleDialogInterface } from './title-dialog-interface';
import { Category } from '../../../../models/category.model';
import { Title } from '../../../../models/title.model';
import { TitlesService } from '../../../../services/titles.services';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
  selector: 'app-title-dialog',
  templateUrl: './title-dialog.component.html',
  styleUrls: ['./title-dialog.component.css'],
})
export class TitleDialogComponent {

  rarityList: string[] = ["شائع - (Common)", "غير شائع - (Uncommon)", "نادر - (Rare)", "مميز - (Hero)"];

  title = '';
  errorMessage = '';

  isDelete: boolean = false;
  isTitleFound: boolean = false;
  isCategoryFound: boolean = false;
  showCategoryField: boolean = false;

  submitButton = '';
  cancelButton = 'إلغاء';


  categoryArLabel = 'الفئة (بالعربية)';
  categoryEnLabel = 'الفئة (بالإنجليزية)';
  categoryArError = 'الرجاء كتابة الفئة بالعربية';

  indexLabel = 'رقم اللقب';
  nameArLabel = 'اللقب (بالعربية)';
  nameEnLabel = 'اللقب (بالإنجليزية)';
  categoryLabel = 'الفئة';
  rarityLabel = 'الندرة';
  pointsLabel = 'عدد النقاط';
  outofLabel = 'المطلوب لإتمام اللقب';
  descriptionArLabel = 'الوصف  (بالعربية)';
  descriptionEnLabel = 'الوصف  (بالإنجليزية)';
  notesLabel = 'الملاحظات';

  indexError = 'الرجاء كتابة رقم اللقب';
  nameArError = 'الرجاء كتابة اسم اللقب بالعربية';
  // nameEnError = 'الرجاء كتابة اسم اللقب بالإنجليزية';
  categoryError = 'الرجاء اختيار فئة اللقب';
  rarityError = 'الرجاء اختيار ندرة اللقب';
  pointsError = 'الرجاء ادخال عدد النقاط للقب';
  outofError = 'الرجاء تحديد العدد المطلوب لاتمام اللقب';
  descriptionArError = 'الرجاء كتابة وصف اللقب بالعربية';
  // descriptionEnError = 'الرجاء كتابة وصف اللقب بالإنجليزية';
  // notesError = 'الرجاء كتابة الملاحظات';

  formValidator: FormGroup = new FormGroup({
    index: new FormControl('', [Validators.required, Validators.min(0)]),
    nameAr: new FormControl('', [Validators.required ]),
    nameEn: new FormControl('', []),
    category: new FormControl('', [Validators.required ]),
    rarity: new FormControl('', [Validators.required ]),
    points: new FormControl('', [Validators.required ]),
    outof: new FormControl('', [Validators.required ]),
    descriptionAr: new FormControl('', [Validators.required ]),
    descriptionEn: new FormControl('', []),
    notes: new FormControl('', []),
  });

  categoryValidator: FormGroup = new FormGroup({
    categoryAr: new FormControl('', [Validators.required ]),
    categoryEn: new FormControl('', [Validators.required ]),
  });

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<TitleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TitleDialogInterface,
    public snackbarService: SnackbarService,
    public titlesService: TitlesService,
  ) {}

  ngOnInit() {
    
    const titleStr = `${this.data.selectedTitle.nameAr} (${this.data.selectedTitle.nameEn})`;

    if (this.data.status == "add") {
      this.title = 'إضافة لقب جديد';
      this.submitButton = 'إضافة';

      if (this.data.titles.length == 0) {
        this.formValidator.get('index')?.setValue(0);
      } else {
        const lastTitle = this.data.titles.reduce((max, title) => title.index > max.index ? title : max);
        this.formValidator.get('index')?.setValue(lastTitle.index + 1);
      }
      
    } else if (this.data.status == "edit") {
      this.title = `تعديل اللقب "${titleStr}"`;
      
      const category: Category = this.data.categories.find(object => object.id == this.data.selectedTitle.categoryId) as Category;
      const categoryStr = `${category.categoryAr} (${category.categoryEn})`;
      
      this.formValidator.get('index')?.setValue(this.data.selectedTitle.index);
      this.formValidator.get('nameAr')?.setValue(this.data.selectedTitle.nameAr);
      this.formValidator.get('nameEn')?.setValue(this.data.selectedTitle.nameEn);
      this.formValidator.get('category')?.setValue(categoryStr);
      this.formValidator.get('rarity')?.setValue(this.data.selectedTitle.rarity);
      this.formValidator.get('points')?.setValue(this.data.selectedTitle.points);
      this.formValidator.get('outof')?.setValue(this.data.selectedTitle.outof);
      this.formValidator.get('descriptionAr')?.setValue(this.data.selectedTitle.descriptionAr);
      this.formValidator.get('descriptionEn')?.setValue(this.data.selectedTitle.descriptionEn);
      this.formValidator.get('notes')?.setValue(this.data.selectedTitle.notes);

      this.submitButton = 'تعديل';
    } else if (this.data.status == "delete") {
      this.title = `هل أنت متأكد من حذف "${titleStr}"`;
      this.isDelete = true;
      this.submitButton = 'حذف';
    }
  }

  preventDecimal(event: KeyboardEvent) {
    if (event.key === '.' || event.key === ',' || event.key === '-') {
      event.preventDefault();
    }
  }

  newCategory() {
    this.showCategoryField = true;
    this.formValidator.get('index')?.disable();
    this.formValidator.get('nameAr')?.disable();
    this.formValidator.get('nameEn')?.disable();
    this.formValidator.get('category')?.disable();
    this.formValidator.get('rarity')?.disable();
    this.formValidator.get('points')?.disable();
    this.formValidator.get('outof')?.disable();
    this.formValidator.get('descriptionAr')?.disable();
    this.formValidator.get('descriptionEn')?.disable();
    this.formValidator.get('notes')?.disable();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick() {

    if (this.data.status == 'delete') {

      const index = this.data.titles.indexOf(this.data.selectedTitle);
      if (index > -1) {
        // this.usersService.deleteUser(this.data.selectedUser).subscribe(response => {
        //   if (response.status == 200 || response.status == 201) {
        //     this.usersService.getUsers();
        //     this.dialogRef.close('success');
        //   }
        // });
      }

    } else {

      if (this.isInvalid('all') || this.formValidator.value == null) {
        this.snackbarService.openSnackBar("الرجاء تعبئة الحقول الأساسية.", "failure");
        return;
      }

      const category: Category = this.data.categories.find(object => `${object.categoryAr} (${object.categoryEn})` == this.formValidator.get('category')?.value) as Category;
      const title: Title = {
        id: '',
        index: Number(this.formValidator.get('index')?.value),
        categoryId: category.id,
        nameAr: this.formValidator.get('nameAr')?.value,
        nameEn: this.formValidator.get('nameEn')?.value,
        rarity: this.formValidator.get('rarity')?.value,
        points: this.formValidator.get('points')?.value,
        outof: this.formValidator.get('outof')?.value,
        descriptionAr: this.formValidator.get('descriptionAr')?.value,
        descriptionEn: this.formValidator.get('descriptionEn')?.value,
        notes: this.formValidator.get('notes')?.value,
      }

      if (this.data.status == 'add') {

        this.titlesService.createTitle(title).subscribe(response => {
          if (response.status == 200 || response.status == 201) {
            this.titlesService.getTitles();
            this.dialogRef.close('success');
          }
        });

      } else if (this.data.status == 'edit') {

        const index = this.data.titles.indexOf(this.data.selectedTitle);

        if (index > -1) {

          title.id = this.data.selectedTitle.id;

          // this.usersService.updateUser(user).subscribe(response => {
          //   if (response.status == 200 || response.status == 201) {
          //     this.usersService.getUsers();
          //     this.dialogRef.close('success');
          //   }
          // });
        }

      }

    }

  }

  isInvalid(formName: string) {
    this.formValidator.updateValueAndValidity();


    if (formName == 'all') {

      if (this.formValidator.invalid || this.formValidator.value == null) {
        return true;
      }

    } else {

      if (this.formValidator.get(formName)?.invalid || this.formValidator.get(formName)?.value == null) {

        if (this.data.status != 'edit') {
          switch (formName) {
            case 'indexError':
              this.indexError = 'الرجاء كتابة رقم اللقب';
              break;
            case 'nameArError':
              this.nameArError = 'الرجاء كتابة اسم اللقب بالعربية';
              break;
            case 'categoryError':
              this.categoryError = 'الرجاء اختيار فئة اللقب';
              break;
            case 'rarityError':
              this.rarityError = 'الرجاء اختيار ندرة اللقب';
              break;
            case 'pointsError':
              this.pointsError = 'الرجاء ادخال عدد النقاط للقب';
              break;
            case 'outofError':
              this.outofError = 'الرجاء تحديد العدد المطلوب لاتمام اللقب';
              break;
            case 'descriptionArError':
              this.descriptionArError = 'الرجاء كتابة وصف اللقب بالعربية';
              break;
          }
        }

        return true;
      }

      if (formName == "index" && this.data.status != 'edit') {

        if (this.data.titles.some(object => object.index == this.formValidator.get(formName)?.value)) {
          this.formValidator.get(formName)?.setErrors({ isInList: true });
          this.isTitleFound = true;
          return true;
        } else {
          this.isTitleFound = false;
        }
      }

      if (formName == "password") {
        const value = this.formValidator.get(formName)?.value;
        if (value != '' && value.length < 6) {
          this.formValidator.get(formName)?.setErrors({ isInvalid: true });
          return true;
        }
      }

    }

    return false;
  }
}

