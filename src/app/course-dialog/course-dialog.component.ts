import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { CoursesService } from '../services/courses.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit {

  form: FormGroup;
  description: string;
  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course,
    private coursesService: CoursesService,
    private storage: AngularFireStorage) {

    this.course = course;

    const titles = course.titles;

    this.form = fb.group({
      description: [titles.description, Validators.required],
      longDescription: [titles.longDescription, Validators.required]
    });

  }

  uploadFile(event) {

    // Get a reference of the uploaded file from the event (Access the array of uploaded files).
    const file: File = event.target.files[0];

    // Define it's ditination target path.
    const filePath = `courses/${this.course.id}/${file.name}`;

    // Trigger the upload using the AngularFireStorage service .
    const task = this.storage.upload(filePath, file);
    task.snapshotChanges().subscribe(console.log);
    
  }

  ngOnInit() {

  }

  save() {

    const changes = this.form.value;

    this.coursesService.saveCourse(this.course.id, { titles: changes })
      .subscribe(
        () => this.dialogRef.close(this.form.value) // we are passing a value in case of clicking the save button
      );

  }

  close() {
    this.dialogRef.close(); // we are not passing a value in case of clicking the close button
  }

}