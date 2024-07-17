import { SelectionModel } from '@angular/cdk/collections';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { SnackbarService } from '../../../services/snackbar.service';
import { Helper } from '../../shared/helpers';
import { NbDialogService } from '@nebular/theme';
import { TitleDialogInterface } from './title-dialog/title-dialog-interface';
import { TitleDialogComponent } from './title-dialog/title-dialog.component';
import { CategoriesService } from '../../../services/categories.services';
import { TitlesService } from '../../../services/titles.services';
import { Category } from '../../../models/category.model';
import { Title } from '../../../models/title.model';

interface RowData {
  id: number;
  title: Title;
  category: Category;
}

@Component({
  selector: 'ngx-titles',
  templateUrl: './titles.component.html',
  styleUrls: ['./titles.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ar'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class TitlesComponent {
  
  Helper = Helper;

  shownRows: RowData[] = [];

  displayedColumns: string[] = ['select', 'index', 'title', 'category', 'rarity', 'points', 'description'];

  dataSource: MatTableDataSource<RowData>;
  selection = new SelectionModel<RowData>(true, []);

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatSort, { static: false }) set setSort(content: any) {
    if (content) {
      setTimeout(() => {
        this.sort = content;
        this.dataSource.sort = this.sort as MatSort;
      });
    }
  }

  private categoriesSub?: Subscription;
  private titlesSub?: Subscription;

  searchValue: string = "";

  categories: Category[] = [];
  titles: Title[] = [];
  sortedTitles: Title[] = [];
  selectedTitle: Title = {
    id: '',
    index: 0,
    categoryId: '',
    nameAr: '',
    nameEn: '',
    rarity: '',
    points: 0,
    outof: 0,
    descriptionAr: '',
    descriptionEn: '',
    notes: ''
  };

  constructor(
    public dialog: MatDialog,
    public categoriesService: CategoriesService,
    public titlesService: TitlesService,
    private snackbarService: SnackbarService,
    private dialogService: NbDialogService
  ) {
    this.shownRows = this.generateRows();
    this.dataSource = new MatTableDataSource(this.shownRows);
    this.dataSource.sort = this.sort as MatSort;
  }

  ngOnInit() {
    this.categoriesService.getCategories();
    this.categoriesSub = this.categoriesService.getCategoriesUpdateListener().subscribe((categoriesData: any) => {
      this.categories = categoriesData;

      this.titlesService.getTitles();
      this.titlesSub = this.titlesService.getTitlesUpdateListener().subscribe((titlesData: any) => {
        this.titles = titlesData;
        this.sortedTitles = this.titles.slice();
  
        this.shownRows = this.generateRows();
        this.dataSource = new MatTableDataSource(this.shownRows);
        this.dataSource.sort = this.sort as MatSort;
      });

    });
  }

  ngOnDestroy() {
    this.categoriesSub?.unsubscribe();
    this.titlesSub?.unsubscribe();
  }

  generateRows() {
    var rowData: RowData[] = [];

    for (let i = 1; i <= this.sortedTitles.length; i++) {
      const title = this.sortedTitles[i-1];
      const category: Category = this.categories.find(object => object.id == title.categoryId) as Category;
      

      const data: RowData = {
        id: i,
        title: title,
        category: category
      };

      rowData.push(data);
    }

    return rowData;
  }

  sortData(sort: Sort) {
    Helper.sortData(sort, this.titles, this.sortedTitles)
  }

  openDialog(status: string) {

    const dialogData: TitleDialogInterface = {
      status: status,
      selectedTitle: this.selectedTitle,
      titles: this.titles,
      categories: this.categories,
    }

    const dialogRef = this.dialog.open(TitleDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'success') {
        this.selectedTitle = {
          id: '',
          index: 0,
          categoryId: '',
          nameAr: '',
          nameEn: '',
          rarity: '',
          points: 0,
          outof: 0,
          descriptionAr: '',
          descriptionEn: '',
          notes: ''
        };

        if (status == "add") {
          this.snackbarService.openSnackBar('تم إضافة مستخدم جديد بنجاح.', 'success');
        } else if (status == "edit") {
          this.snackbarService.openSnackBar('تم تعديل المستخدم بنجاح.', 'success');
        } else if (status == "delete") {
          this.snackbarService.openSnackBar('تم حذف المستخدم بنجاح.', 'success');
        }
      }
    });
  }

  isSelected(row: any) {
    var isSelected = this.selection.isSelected(row);
    this.selection.clear();

    if (isSelected) {
      this.selection.deselect(row);
      this.selectedTitle = {
        id: '',
        index: 0,
        categoryId: '',
        nameAr: '',
        nameEn: '',
        rarity: '',
        points: 0,
        outof: 0,
        descriptionAr: '',
        descriptionEn: '',
        notes: ''
      };
    } else {
      this.selection.select(row);

      var title = this.titles.find(a => a.id == row.title.titleId);

      if (title) {
        this.selectedTitle = title;
      }
    }
  }

  applyFilter(event: Event) {
    if (!this.dataSource) {
      return;
    }

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllowed(action: string): boolean {
    switch (action) {
      case "add-empty":
        return this.titles.length == 0;

      case "add":
        return this.titles.length > 0;

      case "edit":
        return (this.titles.length > 0) && (this.selectedTitle.id != "");

      case "delete":
        return (this.titles.length > 0) && (this.selectedTitle.id != "");

      case "view":
        return this.titles.length > 0;

      default:
        return false;
    }
  }
}
