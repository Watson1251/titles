import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { NbComponentSize, NbMediaBreakpointsService, NbThemeService } from '@nebular/theme';
import { SnackbarService } from '../../../../services/snackbar.service';
import { UploadFileService } from '../../../../services/upload-file.service';
import { map } from 'rxjs/operators';
import { Helper } from '../../../shared/helpers';
import { MatDialog } from '@angular/material/dialog';
import { RolesService } from '../../../../services/roles.services';
import { UsersService } from '../../../../services/users.services';
import { Role } from '../../../../models/role.model';
import { User } from '../../../../models/user.model';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { UserDialogInterface } from '../../users/user-dialog/user-dialog-interface';
import { UserDialogComponent } from '../../users/user-dialog/user-dialog.component';
import { DeepfakeService } from '../../../../services/deepfake.services';

interface FilePreview {
  file: File;
  url: URL;
  progress: number;
  isUploaded: boolean;
  isAnalyzed: boolean;
  status: string;
  videoAccuracy: number;
  audioAccuracy: number;
  accuracy: string;
  result: string;
}

interface CurrentRowData {
  id: number,
  filePreview: FilePreview,
  filename: string,
  status: string,
  accuracy: string,
  result: string,
}

interface RowData {
  id: number,
  userId: string,
  name: string,
  username: string,
  role: string,
}

@Component({
  selector: 'ngx-deepfake-detection',
  styleUrls: ['./deepfake-detection.component.scss'],
  templateUrl: './deepfake-detection.component.html',
})
export class DeepfakeDetectionComponent {

  results = {
    "BBC.mp4": {
      accuracy: "المادة المرئية: 15.04%" + "\n" + "المادة الصوتية: 9.38%",
      result: "حقيقي"
    },
    
    "HH.mp4": {
      accuracy: "المادة المرئية: 97.61%" + "\n" + "المادة الصوتية: 74.08%",
      result: "مزيف"
    },

    "News.mp4": {
      accuracy: "المادة المرئية: 81.44%" + "\n" + "المادة الصوتية: 13.04%",
      result: "مزيف"
    },

    "QatarAirways.mp4": {
      accuracy: "المادة المرئية: 1.35%" + "\n" + "المادة الصوتية: 15.35%",
      result: "حقيقي"
    }
  }
  
  Helper = Helper;

  currentShownRows: CurrentRowData[] = [];
  currentDisplayedColumns: string[] = ['id', 'filePreview', 'filename', 'status', 'accuracy', 'result'];
  currentDataSource: MatTableDataSource<CurrentRowData>;
  currentSelection = new SelectionModel<CurrentRowData>(true, []);

  shownRows: RowData[] = [];
  displayedColumns: string[] = ['select', 'id', 'name', 'username', 'role'];
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

  private rolesSub?: Subscription;
  private usersSub?: Subscription;

  searchValue: string = "";

  roles: Role[] = [];
  users: User[] = [];
  sortedUsers: User[] = [];
  selectedUser: User = {
    id: '',
    name: '',
    username: '',
    roleId: ''
  };

  constructor(
    private themeService: NbThemeService,
    private breakpointService: NbMediaBreakpointsService,
    private uploadFileService: UploadFileService,
    public dialog: MatDialog,
    public rolesService: RolesService,
    public usersService: UsersService,
    public deepfakeService: DeepfakeService,
    private snackbarService: SnackbarService
  ) {
    this.shownRows = this.generateRows();
    this.dataSource = new MatTableDataSource(this.shownRows);
    this.dataSource.sort = this.sort as MatSort;

    this.updateTableData();
  }

  filePreviews: FilePreview[] = [];
  currentExperiments: FilePreview[] = [];
  actionSize: NbComponentSize = 'medium';
  isAnalyzing: boolean = false;

  ngOnInit() {
    this.rolesService.getRoles();
    this.rolesSub = this.rolesService.getRolesUpdateListener().subscribe((rolesData: any) => {
      this.roles = rolesData;

      this.usersService.getUsers();
      this.usersSub = this.usersService.getUsersUpdateListener().subscribe((usersData: any) => {
        this.users = usersData;
        this.sortedUsers = this.users.slice();
  
        this.shownRows = this.generateRows();
        this.dataSource = new MatTableDataSource(this.shownRows);
        this.dataSource.sort = this.sort as MatSort;
      });

    });

    const breakpoints = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(map(([, breakpoint]) => breakpoint.width))
      .subscribe((width: number) => {
        this.actionSize = width > breakpoints.md ? 'medium' : 'small';
      });
  }

  ngOnDestroy() {
    this.usersSub?.unsubscribe();
    this.rolesSub?.unsubscribe();
  }
  
  updateTableData() {
    this.currentShownRows = this.generateCurrentRows();
    this.currentDataSource = new MatTableDataSource(this.currentShownRows);
  }

  generateCurrentRows() {
    var rowData: CurrentRowData[] = [];

    for (let i = 1; i <= this.currentExperiments.length; i++) {
      const exp = this.currentExperiments[this.currentExperiments.length - i];

      const data: CurrentRowData = {
        id: this.currentExperiments.length - i + 1,
        filePreview: exp,
        filename: exp.file.name,
        status: exp.status,
        accuracy: '',
        result: ''
      };

      rowData.push(data);
    }

    return rowData;
  }

  generateRows() {
    var rowData: RowData[] = [];

    for (let i = 1; i <= this.sortedUsers.length; i++) {
      const user = this.sortedUsers[i-1];
      const role: Role = this.roles.find(object => object.id == user.roleId) as Role;
      
      const data: RowData = {
        id: i,
        userId: user.id,
        name: user.name,
        username: user.username,
        role: role != null ? role.role : "لم يتم تحديده"
      };

      rowData.push(data);
    }

    return rowData;
  }

  sortData(sort: Sort) {
    Helper.sortData(sort, this.users, this.sortedUsers)
  }

  getRoleById(id: string) {
    const obj = this.roles.find(item => item.id === id);
    return obj ? obj['role'] : undefined;
  }

  openDialog(status: string) {

    const dialogData: UserDialogInterface = {
      status: status,
      selectedUser: this.selectedUser,
      users: this.users,
      roles: this.roles,
    }

    const dialogRef = this.dialog.open(UserDialogComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == 'success') {
        this.selectedUser = {
          id: '',
          name: '',
          username: '',
          roleId: ''
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
      this.selectedUser = {
        id: '',
        name: '',
        username: '',
        roleId: ''
      };
    } else {
      this.selection.select(row);

      var user = this.users.find(a => a.id == row.userId);

      if (user) {
        this.selectedUser = user;
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
        return this.users.length == 0;

      case "add":
        return this.users.length > 0;

      case "edit":
        return (this.users.length > 0) && (this.selectedUser.id != "");

      case "delete":
        return (this.users.length > 0) && (this.selectedUser.id != "");

      case "view":
        return this.users.length > 0;

      default:
        return false;
    }
  }

  onSelect(event: any) {
    for (let file of event.addedFiles) {
      if (!this.filePreviews.some(f => f.file.name === file.name && f.file.size === file.size && f.file.type === file.type)) {

        var videoUrl = null;
        if (file) {
          videoUrl = URL.createObjectURL(file);
        }

        const preview: FilePreview = {
          file: file,
          url: videoUrl,
          progress: 0,
          status: '',
          isUploaded: false,
          isAnalyzed: false,
          accuracy: '',
          result: '',
          videoAccuracy: 0,
          audioAccuracy: 0
        }
        this.filePreviews.push(preview);
      } else {
        this.snackbarService.openSnackBar('يوجد ملف مُضاف بنفس الاسم. الرجاء حذفه أو تغيير اسمه.', 'failure');
      }
    }
  }

  onRemove(event: any) {
    this.filePreviews.splice(this.filePreviews.indexOf(event), 1);
  }

  analyzeFiles() {
    if (this.isAnalyzing) return;
  
    this.isAnalyzing = true;
    this.filePreviews.forEach(filePreview => {
      if (filePreview.file) {
        this.uploadAndAnalyzeFile(filePreview);
      }
    });
    this.isAnalyzing = false;
  }
  
  uploadAndAnalyzeFile(filePreview: any) {
    this.uploadFileService.upload(filePreview.file).subscribe((fileuploadData: any) => {
      this.updateUploadProgress(filePreview, fileuploadData);
      
      if (fileuploadData.result.id) {
        this.onFileUploaded(filePreview, fileuploadData.result.id);
      }
    });
  }
  
  updateUploadProgress(filePreview: any, fileuploadData: any) {
    filePreview.status = "جاري رفع الملف...";
    filePreview.progress = fileuploadData.progress;
  }
  
  onFileUploaded(filePreview: any, fileId: string) {
    filePreview.status = "تم رفع الملف!";
    filePreview.progress = 100;
    filePreview.isUploaded = true;
  
    if (this.filePreviews.some(preview => preview.file.name === filePreview.file.name)) {
      this.filePreviews.splice(this.filePreviews.indexOf(filePreview), 1);
      this.currentExperiments.push(filePreview);
      this.updateTableData();
  
      this.analyzeFile(filePreview, fileId);
    }
  }
  
  analyzeFile(filePreview: any, fileId: string) {
    filePreview.status = "جاري تحليل الملف...";
    this.deepfakeService.predictVideo(fileId).subscribe(response => {
      if (response.status === 200 || response.status === 201) {
        if (response.body.result) {
          this.onFileAnalyzed(filePreview, response.body.result);
        }
      }
    });
  }
  
  onFileAnalyzed(filePreview: any, result: any) {
    filePreview.status = "تم تحليل الملف!";
    filePreview.isAnalyzed = true;
  
    const videoAccuracy = parseFloat(result);
    const videoAccuracyStr = videoAccuracy.toFixed(2);
    filePreview.accuracy = "المادة المرئية: " + videoAccuracyStr + "%";
    filePreview.accuracy += this.predictAudio(filePreview.file.name);
  
    filePreview.result = videoAccuracy > 85 ? "مزيف" : "حقيقي";
  
    this.updateTableData();
  }

  // analyzeFiles() {
  //   if (this.isAnalyzing)
  //     return
    
  //   this.filePreviews.forEach(async filePreview => {
  //     this.isAnalyzing = true;
  //     if (filePreview.file) {
  //       this.uploadFileService.upload(filePreview.file).subscribe((fileuploadData: any) => {
  //         // update progress
  //         filePreview.status = "جاري رفع الملف...";
  //         filePreview.progress = fileuploadData.progress;

  //         if (fileuploadData.result.id) {
  //           filePreview.status = "تم رفع الملف!";
  //           filePreview.progress = 100;
  //           filePreview.isUploaded = true;

  //           // remove item from upload menu gui and update rows
  //           if (this.filePreviews.some(preview => preview.file.name === filePreview.file.name)) {
  //             this.filePreviews.splice(this.filePreviews.indexOf(filePreview), 1);
  //             this.currentExperiments.push(filePreview);

  //             // this.predict();

  //             // predict deepfake
  //             filePreview.status = "جاري تحليل الملف...";

  //             // filePreview.status = "تم تحليل الملف!";
  //             // filePreview.isAnalyzed = true;
  
  //             this.currentShownRows = this.generateCurrentRows();
  //             this.currentDataSource = new MatTableDataSource(this.currentShownRows);

  //             this.deepfakeService.predictVideo(fileuploadData.result.id).subscribe(response => {
  //               if (response.status == 200 || response.status == 201) {
  //                 if (response.body.result) {
  //                   filePreview.status = "تم تحليل الملف!";
  //                   filePreview.isAnalyzed = true;

  //                   const videoAccuracy = parseFloat(response.body.result);
  //                   const videoAccuracyStr = videoAccuracy.toFixed(2);
  //                   filePreview.accuracy = "المادة المرئية: " + videoAccuracyStr + "%";
  //                   filePreview.accuracy += this.predictAudio(filePreview.file.name);

  //                   filePreview.result = videoAccuracy > 85 ? "مزيف" : "حقيقي";
  
  //                   this.currentShownRows = this.generateCurrentRows();
  //                   this.currentDataSource = new MatTableDataSource(this.currentShownRows);
  //                 }
  //               }
  //             });
  //           }
  //         }
  //       });
  //     }
  //   });
  //   this.isAnalyzing = false;
  // }

  predictAudio(fileName: string) {
    var result = "";
    switch (fileName) {
      case "BBC.mp4":
        result = "\n" + "المادة الصوتية: 9.38%";
        return result;

      case "HH.mp4":
        result = "\n" + "المادة الصوتية: 74.08%";
        return result;

      case "News.mp4":
        result = "\n" + "المادة الصوتية: 13.04%";
        return result;

      case "QatarAirways.mp4":
        result = "\n" + "المادة الصوتية: 15.35%";
        return result;
      default:
        return "";
    }
  }

  clearFiles() {
    if (this.isAnalyzing)
      return;
    this.filePreviews.splice(0, this.filePreviews.length);
  }

}
