import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, finalize, shareReplay } from 'rxjs/operators';
import { Student } from './model/student';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentServiceService {


  constructor(private http: HttpClient) { }

  // Local backend (when running Spring locally):
  // url = 'http://localhost:8080';

  // Use base URL from environment. In development `environment.apiUrl` is empty so
  // relative paths work with the dev proxy. In production it points at the deployed backend.
  url = environment.apiUrl || '';

  // simple in-memory value cache for GET /home/getAllStudent
  private studentsCache: Student[] | null = null;
  // in-flight observable for pending request to avoid duplicate calls
  private studentsInFlight$: Observable<Student[]> | null = null;

  getAllStudents(): Observable<Student[]> {
    // return cached value if present
    if (this.studentsCache) {
      return of(this.studentsCache);
    }

    // if a request is already in-flight, return it so subscribers share the same HTTP call
    if (this.studentsInFlight$) {
      return this.studentsInFlight$;
    }

    this.studentsInFlight$ = this.http.get<Student[]>(this.url + '/home/getAllStudent')
      .pipe(
        // store the received data in the value cache
        tap(data => this.studentsCache = data),
        // on error, keep existing cache (don't overwrite with null), but clear in-flight
        catchError(err => {
          this.studentsInFlight$ = null;
          return throwError(() => err);
        }),
        // ensure inFlight cleared when observable completes
        finalize(() => this.studentsInFlight$ = null),
        // multicast the in-flight observable to multiple subscribers
        shareReplay(1)
      );

    return this.studentsInFlight$;
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
    this.studentsCache = null;
  }

}
