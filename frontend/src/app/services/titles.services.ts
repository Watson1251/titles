import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Subject, throwError } from "rxjs";

import { environment } from "../../environments/environment";
import { catchError } from "rxjs/operators";
import { SnackbarService } from "./snackbar.service";
import { Title } from "../models/title.model";

const BACKEND_URL = environment.apiUrl + '/titles/';

@Injectable({ providedIn: "root" })
export class TitlesService {

  private titles: Title[] = [];
  private titlesUpdated = new Subject<any>();

  constructor(
    private http: HttpClient,
    private snackbarService: SnackbarService
  ) {}

  getTitles() {
    this.http
      .get<{message: string, titles: any}>(
        BACKEND_URL,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      )
      .subscribe(response => {
        if (response.status == 200 || response.status == 201) {
            if (response.body == null) {
                return;
            }

            var fetchedTitles = response.body.titles;
            var tempTitles: Title[] = [];

            fetchedTitles.forEach((item: any) => {
                const title: Title = {
                  id: item._id,
                  index: item.index,
                  categoryId: item.categoryId,
                  nameAr: item.nameAr,
                  nameEn: item.nameEn,
                  rarity: item.rarity,
                  points: item.points,
                  outof: item.outof,
                  descriptionAr: item.descriptionAr,
                  descriptionEn: item.descriptionEn,
                  notes: item.notes,
                };
                tempTitles.push(title);
            });

            this.titles = tempTitles;
            this.titlesUpdated.next(this.titles);
        }
      });
  }

  getTitle(id: string) {
    return this.http
      .get<any>(
        BACKEND_URL + id,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  createTitle(title: Title) {
    return this.http
      .post<any>(
        BACKEND_URL + 'create/',
        title,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  updateTitle(title: Title) {
    return this.http
      .post<any>(
        BACKEND_URL + 'update/',
        title,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  deleteTitle(title: Title) {
    return this.http
      .post<any>(
        BACKEND_URL + 'delete/',
        title,
        {observe: 'response'}
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
            return this.handleError(error);
        })
      );
  }

  handleError(error: HttpErrorResponse) {
    var message = '';
    
    // Client-side error occurred
    if (error.error instanceof ErrorEvent) {
      message = 'حدث خطأ في العميل.';
    
    // Server-side error occurred
    } else {
      message = 'حدث خطأ في المزود.';
    }

    if (error.error.message) {
      message += "\n";
      message += error.error.message;
    }

    this.snackbarService.openSnackBar(message, 'failure');
    return throwError(message);
  }

  getTitlesUpdateListener() {
    return this.titlesUpdated.asObservable();
  }

}
