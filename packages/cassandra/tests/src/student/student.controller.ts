import { Controller, Delete, Get, Post } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  createStudent() {
    return this.studentService.createStudent();
  }

  @Get()
  getStudent() {
    return this.studentService.getStudent();
  }

  @Delete()
  async deleteStudents() {
    await this.studentService.deleteStudents();
    return { success: true };
  }
}
