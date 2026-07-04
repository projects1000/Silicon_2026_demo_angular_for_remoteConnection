import { Component } from '@angular/core';
import { SharedService } from './shared.service';
import { Student } from './model/student';
import { StudentServiceService } from './student-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'DemoTest';
 message: string = '';




  constructor(public sharedService: SharedService,  public studentService: StudentServiceService)   { 

  }
 
student: Student = new Student();
students: Student[] = [];

isEdit: boolean = false;
ngOnInit() {    

   this.getAllDataFromDb();
}
getAllDataFromDb(): void {

  this.studentService.getAllStudents().subscribe({

    next: (data: Student[]) => {
      this.students = data;
      console.log(this.students);
    },

    error: (err) => {
      console.error(err);
    }

  });
}

saveStudent(): void {

  this.studentService.saveStudent(this.student).subscribe({

    next: (data: Student) => {
      this.student = data;
      console.log(this.students);

      this.getAllDataFromDb();
    },

    error: (err) => {
      console.error(err);
    }

  });
}

updateStudent(): void {

  this.studentService.updateStudent(this.student).subscribe({

    next: (data: Student) => {
      this.student = data;
      console.log(this.students);

      this.getAllDataFromDb();
    },

    error: (err) => {
      console.error(err);
    }

  });
}

  cancelEdit() {

    this.student = new Student();

    this.isEdit = false;

  }

    editStudent(student: Student) {

    this.student = { ...student };   // Copy selected row

    this.isEdit = true;
  }

deleteStudent(studentId: number): void {

  if (confirm("Are you sure you want to delete this student?")) {

    this.studentService.deleteStudent(studentId).subscribe({

      next: () => {
        alert("Student Deleted Successfully");
        this.getAllDataFromDb();
      },

      error: (err) => {
        console.error(err);
        alert("Failed to delete student");
      }

    });

  }

}

}

