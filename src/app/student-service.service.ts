import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { shareReplay, catchError, tap } from 'rxjs/operators';
import { Student } from './model/student';

@Injectable({
  providedIn: 'root'
})
export class StudentServiceService {


  constructor(private http: HttpClient) { }

  // Local backend (when running Spring locally):
  // url = 'http://localhost:8080';

  // Use empty base URL in development so Angular dev server proxy handles calls.
  // In production replace with the real backend URL or use environment variables.
  url = 'https://siliconpracticebactch-2026backend.onrender.com';

  // simple in-memory cache for GET /home/getAllStudent
  private studentsCache$: Observable<Student[]> | null = null;

  getAllStudents(): Observable<Student[]> {
    if (!this.studentsCache$) {
      this.studentsCache$ = this.http.get<Student[]>(this.url + '/home/getAllStudent')
        .pipe(
          // keep one cached value
          shareReplay(1),
          // clear cache on error so subsequent calls will retry
          catchError(err => {
            this.studentsCache$ = null;
            return throwError(() => err);
          })
        );
    }
    return this.studentsCache$;
  }

  saveStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.url + '/home/save', student)
      .pipe(
        tap(() => this.invalidateCache())
      );
  }

  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(this.url + '/home/update', student)
      .pipe(
        tap(() => this.invalidateCache())
      );
  }

  deleteStudent(studentId: number): Observable<void> {
    return this.http.delete<void>(this.url + '/home/delete/' + studentId)
      .pipe(
        tap(() => this.invalidateCache())
      );
  }

  private invalidateCache() {
    this.studentsCache$ = null;
  }

}
