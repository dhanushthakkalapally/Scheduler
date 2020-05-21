package com.fhir.scheduler.job;


import com.fhir.scheduler.entity.Available_jobs;
import com.fhir.scheduler.repo.Jobs_repo;
import org.quartz.InterruptableJob;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.UnableToInterruptJobException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.QuartzJobBean;

import com.fhir.scheduler.service.JobService;
import org.springframework.web.client.RestTemplate;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class SimpleJob extends QuartzJobBean implements InterruptableJob {

    JobExecutionContext jobExecutionContext_;

    ClassLoader classLoader = ClassLoader.getSystemClassLoader();

    Object instance;
    Class myClass;

    @Autowired
    Jobs_repo repo;

    Available_jobs job;

    String jobName;

    String jobType;

    @Autowired
    JobService jobService;


    @Override
    protected void executeInternal(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        /**
         * **/
         __init__(jobExecutionContext);


        

        if (jobType.equalsIgnoreCase("CLASS") || jobType == "CLASS") {

            /**
             * Call the class dynamically
             * if the methods has parameters call execute from class with parameters else call execute from class 
             * */
            if (job.getParameters()==null){
                executeFromClass();    
            }else if(job.getParameters()!=null){
                executeFromClassWithParameters();
            }
         


        } else if (jobType.equalsIgnoreCase("HTTP") || jobType == "HTTP") {
            /**
             * CALL THE HTTP METHOD GET URL
             * */
            RestTemplate rest = new RestTemplate();
            String url = job.getStart_url();
            rest.getForObject(url,String.class);


        }


        System.out.println("Initiated Stop successful for " + Thread.currentThread().getName());

//         new Scratch().getJobs();
        repo.updateStatus(false, jobExecutionContext.getJobDetail().getKey().getName());
    }



   /**This method will be executed when there are parameters in the method */
    private void executeFromClassWithParameters() {
        try {
        if (job.getDelimitedby()!=null){


                myClass = classLoader.loadClass(job.getClass_path());
                instance = myClass.newInstance();

                Method method = myClass.getMethod(job.getStart_method(),new Class[]{String.class,String.class});


                method.invoke(instance,new Object[]{job.getParameters(),job.getDelimitedby()});

        }else if (job.getDelimitedby()==null){

            myClass = classLoader.loadClass(job.getClass_path());
            instance = myClass.newInstance();

            Method method = myClass.getMethod(job.getStart_method(),new Class[]{String.class});


            method.invoke(instance,new Object[]{job.getParameters()});
        }



        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
    }


    /**
     * This method initailizes the required parameters for the class
     *
     * */
    private void __init__(JobExecutionContext jobExecutionContext) {
        jobExecutionContext_ = jobExecutionContext;
        jobType = jobExecutionContext.getJobDetail().getJobDataMap().getString("jobType");
        jobName = jobExecutionContext.getJobDetail().getKey().getName();
        job = repo.findAvailable_jobsByJob_name(jobName);
    }

   
   
   
    private void executeFromClass() {

        try {
            
            myClass = classLoader.loadClass(job.getClass_path());
            instance = myClass.newInstance();

            Method method = myClass.getMethod(job.getStart_method());


            method.invoke(instance);


        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (InstantiationException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void interrupt() throws UnableToInterruptJobException {
        if (jobType.equalsIgnoreCase("CLASS") || jobType == "CLASS") {
            classStop();
        } else if (jobType.equalsIgnoreCase("HTTP") || jobType == "HTTP") {
        }
    }

    private void classStop() {
        try {
            Method method = myClass.getMethod(job.getStop_method());
            method.invoke(instance);
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            e.printStackTrace();

        }
    }

}