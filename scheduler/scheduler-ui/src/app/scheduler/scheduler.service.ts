import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'
import {catchError, map, tap, take} from 'rxjs/operators'
import {GetJobs, Job, AvailableJobs, Logs, ConfiguredJobs, Token} from './respose.interfaces'
import {Observable, throwError, Subject, BehaviorSubject} from 'rxjs'
import {User} from "../authenticate/authenticate.model";
import {Router} from "@angular/router";


@Injectable({providedIn: "root"})
// This is a singleton class used to provide the data for the ui from rest
export class SchedulerService {
  authenticateUrl = "http://localhost:7080/scheduler/authenticate"
  getJobsUrl = "http://localhost:7080/scheduler/jobs";
  scheduleJobUrl = "http://localhost:7080/scheduler/schedule";
  pauseJobUrl = "http://localhost:7080/scheduler/pause";
  resumeJobUrl = "http://localhost:7080/scheduler/resume";
  deleteJobUrl = "http://localhost:7080/scheduler/delete";
  updateJobUrl = "http://localhost:7080/scheduler/update";
  isJobWithNamePresentUrl = "http://localhost:7080/scheduler/checkJobName";
  stopJobUrl = "http://localhost:7080/scheduler/stop";
  startJobNowUrl = "http://localhost:7080/scheduler/start";
  AvailableJobs = 'http://localhost:7080/scheduler/getAvailableJobs';
  logsUrl = 'http://localhost:7080/scheduler/getLogs';
  addHttpJobUrl = 'http://localhost:7080/scheduler/addHttpJob';
  postClassJobUrl = 'http://localhost:7080/scheduler/addClassJob';
  configuredJobsUrl = 'http://localhost:7080/scheduler/getConfiguredJobs';
  deleteConfiguredJobUrl = "http://localhost:7080/scheduler/deleteConfiguredJob";
  updateHttpJobUrl = "http://localhost:7080/scheduler/updateHttpJob";
  updateClassJobUrl = "http://localhost:7080/scheduler/updateClassJob";


  //
  // getJobsUrl = "http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/jobs";
  // scheduleJobUrl = "http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/schedule";
  // pauseJobUrl = "http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/pause";
  // resumeJobUrl = "http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/resume";
  // deleteJobUrl = "http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/delete";
  // updateJobUrl = "http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/update";
  // isJobWithNamePresentUrl = "http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/checkJobName";
  // stopJobUrl = "http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/stop";
  // startJobNowUrl = "http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/start";
  // AvailableJobs = 'http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/getAvailableJobs';
  // logsUrl = 'http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/getLogs';
  // addHttpJobUrl = 'http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/addHttpJob';
  // postClassJobUrl = 'http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/addClassJob';
  // configuredJobsUrl ='http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/getConfiguredJobs';
  // deleteConfiguredJobUrl = "http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/deleteConfiguredJob"
  // updateHttpJobUrl = "http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/updateHttpJob";
  // updateClassJobUrl = "http://ec2-34-201-165-44.compute-1.amazonaws.com:7080/scheduler/updateClassJob";

  user: BehaviorSubject<User>;


  constructor(private _http: HttpClient,private _router : Router) {
    this.user = new BehaviorSubject<User>(null);
  }

  isJobWithNamePresent(jobName): Observable<Job> {
    console.log(jobName);
    const params = new HttpParams().append("jobName", jobName.jobName)


    return this._http.get<Job>(this.isJobWithNamePresentUrl, {params: params, observe: 'response'}).pipe(
      tap(response => console.log(response)),
      map(response => response.body));
  }


  getJobs(): Observable<GetJobs> {

    return this._http.get<GetJobs>(this.getJobsUrl);
  }


  scheduleJob(data): Observable<GetJobs> {
    let params = new HttpParams();
    for (let key in data) {
      params = params.append(key, data[key]);
    }


    console.log(params);


    return this._http.get<GetJobs>(this.scheduleJobUrl, {params: params});
  }


  startJobNow(data): Observable<Job> {
    const params = new HttpParams().append("jobName", data.jobName)
    return this._http.get<Job>(this.startJobNowUrl, {params: params});
  }


  pauseJob(data): Observable<Job> {
    const params = new HttpParams().append("jobName", data.jobName)
    return this._http.get<Job>(this.pauseJobUrl, {params: params})
  }


  deleteJob(data): Observable<Job> {
    const params = new HttpParams().append("jobName", data.jobName)

    return this._http.get<Job>(this.deleteJobUrl, {params: params});
  }


  updateJob(data): Observable<GetJobs> {
    let params = new HttpParams();
    for (let key in data) {
      params = params.append(key, data[key]);
    }


    return this._http.get<GetJobs>(this.updateJobUrl, {params: params})

  }

  resumeJob(data): Observable<Job> {

    const params = new HttpParams().append("jobName", data.jobName)


    return this._http.get<Job>(this.resumeJobUrl, {params: params})

  }


  stopJob(data): Observable<Job> {
    const params = new HttpParams().append("jobName", data.jobName)

    return this._http.get<Job>(this.stopJobUrl, {params: params});

  }


  getAvailableJobs(): Observable<AvailableJobs> {
    return this._http.get<AvailableJobs>(this.AvailableJobs, {observe: 'response'}).pipe(map(response => response.body));

  }

  getLogs(): Observable<Logs> {
    return this._http.get<Logs>(this.logsUrl);
  }

  postHttpJob(httpJob): Observable<Job> {


    return this._http.post<Job>(this.addHttpJobUrl, httpJob)
  }


  postClassJob(classJob): Observable<Job> {
    return this._http.post<Job>(this.postClassJobUrl, classJob)
  }


  getConfiguredJobs(): Observable<ConfiguredJobs> {
    return this._http.get<ConfiguredJobs>(this.configuredJobsUrl);
  }

  deleteConfiguredJob(jobName): Observable<ConfiguredJobs> {
    let params = new HttpParams().append('jobName', jobName)

    return this._http.delete<ConfiguredJobs>(this.deleteConfiguredJobUrl, {params: params})
  }

  updateHttpJob(jobData: { startUrl: String, stopUrl: String, jobName: String }): Observable<Job> {
    return this._http.put<Job>(this.updateHttpJobUrl, jobData);
  }

  updateClassJob(jobData): Observable<Job> {
    return this._http.put<Job>(this.updateClassJobUrl, jobData);
  }

  authenticate(credetials: { username: string, password: string }): Observable<Token> {

    return this._http.post<Token>(this.authenticateUrl, credetials).pipe(catchError(error => {
      if (error) {
        if (error.error.message == "Access Denied")
          return throwError("Please Enter Valid Details ");
      }
    }), tap(response => {
      //  Using tap operator when a response comes if it is valid then we need to push to emit a subject and let all of the subscribe ones will know about it
      const curr_user = new User(response.jwtToken);
      this.user.next(curr_user);

      localStorage.setItem('userData', curr_user.token);
    }));
  }

  autoLogin() {

    //if the userdata exists in cache and it is not expired then automatically login
    if (localStorage.getItem('userData')) {
      const user = new User(localStorage.getItem('userData'));

      if (user.token) {
        console.log(user);
        this.user.next(user);
      } else {

        this._router.navigate(['/login']);
      }

    }else{
      this._router.navigate(['/login'])
    }
  }


}
