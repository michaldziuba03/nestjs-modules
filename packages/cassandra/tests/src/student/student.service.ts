import { Injectable } from '@nestjs/common';
import { InjectCassandra } from '../../../lib';
import { Client } from 'cassandra-driver';
import { clientName } from '../options';

@Injectable()
export class StudentService {
  constructor(
    @InjectCassandra()
    private readonly client1: Client,
    @InjectCassandra(clientName)
    private readonly client2: Client,
  ) {}

  async createStudent() {
    const query = "INSERT INTO students (name) VALUES ('Michał')";
    await this.client1.execute(query);
    await this.client2.execute(query);

    return await this.getStudent();
  }

  async getStudent() {
    const query = 'SELECT * FROM students';
    await this.client2.execute(query);
    const result = await this.client1.execute(query);

    return result.rows[0];
  }

  async deleteStudents() {
    const query = 'TRUNCATE students';
    await this.client1.execute(query);
    await this.client2.execute(query);
  }
}
