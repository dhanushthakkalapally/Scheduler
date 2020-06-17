import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {SchedulerService} from "../scheduler/scheduler.service";

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {

@ViewChild('lform',{static:true}) form : NgForm;

error : string = null ;

  constructor(private _service : SchedulerService) { }

  ngOnInit(): void {
  }

  onClick(){
    //when the user clicks login go and get the jwt token

    this._service.authenticate({username:this.form.value.username,password:this.form.value.password}).subscribe(value=>{
      console.log(value.jwtToken)
      this.error = null;
    },error=>{
      this.error = error;
    })
// console.log(this.form)
      // this.form.reset()

  }

}
