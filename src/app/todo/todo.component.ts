import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo } from '../models/todo';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})

export class TodoComponent implements OnInit {
  todoForm: FormGroup;
  tasks: Todo[] = []; 

  constructor(
    private db: AngularFireDatabase,
    private formBuilder: FormBuilder 
  ) {
    this.todoForm = this.formBuilder.group({ 
      id : [''],
      title: ['', Validators.required],
      description: ['', Validators.required],
      done: [false],
      created: [new Date()],
    });
  }

  ngOnInit(): void {
    this.db
      .list<Todo>('/todos')
      .valueChanges()
      .subscribe((data: Todo[]) => {
        console.log(data)
        this.tasks = data;
      });
  }

  addTask() {
    if (this.todoForm.valid) {
      console.log(this.todoForm.value)
      const newTodo: Todo = this.todoForm.getRawValue();
      newTodo.id = uuidv4();
      this.db.list<Todo>('/todos').push(newTodo);
      this.todoForm.reset(); 
    }
  }

  deleteTask(task: Todo) {
    const { id } = task;
    this.db.object(`/todos/${id}`).remove(); 
  }
}