import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Student } from './model/student';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  public bankAccount = '';
private url = 'http://localhost:8080/home';
private baseUrl = 'http://localhost:8080/home';

 

   private source = new Subject<any>(); //microphone

   message$ = this.source.asObservable();// now ready for broadcasting 

   captureMessage(inputParam: any) {
    this.source.next(inputParam); //speaking into microphone
  }

getWelcomeMessage(): Observable<string> {
    return this.http.get(this.url, { responseType: 'text' });
  }

  /**
   * Save address object to backend POST /home/store
   */
  saveAddress(add: { name: string; address: string }): Observable<string> {
    const endpoint = `${this.baseUrl}/save`;
    return this.http.post(endpoint, add, { responseType: 'text' }).pipe(
      tap(res => {
        // store and broadcast saved response
        try {
          this.setMessage(res as any);
        } catch (e) {}
        this.captureMessage(res);
      })
    );
  }

  setMessage(inputParam: string) {
    this.bankAccount = inputParam;
  }

  getMessage() {
    return this.bankAccount;
  }


  
  totalBill : number = 666777;

  constructor(private http: HttpClient) { }

  /**
   * Call backend welcome endpoint
   * Returns raw text response from the server.
   */
  getWelcome(): Observable<string> {
    // Spring Boot endpoint is mapped to /home/welcome
    return this.http.get('/home/welcome', { responseType: 'text' })
      .pipe(
        tap(res => {
          // store response for other components and broadcast
          try {
            this.setMessage(res as any);
          } catch (e) {
            // ignore
          }
          this.captureMessage(res);
        })
      );
  }

getStudents(): Observable<Student[]> {
  return this.http.get<Student[]>(this.url + "/getAllStudent");
}

getStudent(id: number): Observable<Student> {
  return this.http.get<Student>(this.url + "/getStudnetById/" + id);
}

saveStudent(student: Student): Observable<Student> {
  return this.http.post<Student>(this.url + "/student", student);
}

updateStudent(student: Student): Observable<Student> {
  return this.http.put<Student>(this.url + "/student", student);
}

}
