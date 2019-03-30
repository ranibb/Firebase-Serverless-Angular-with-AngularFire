import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../model/course';
import { Lesson } from '../model/lesson';
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  course: Course;

  lessons: Lesson[];

  displayedColumns = ['seqNo', 'description', 'duration'];

  constructor(
    private route: ActivatedRoute,
    private courseService: CoursesService) {

  }

  ngOnInit() {

    this.course = this.route.snapshot.data['course'];

    this.courseService.findLessons(this.course.id).subscribe(lessons => this.lessons = lessons)

  }

  loadMore() {

  }

}