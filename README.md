**Technical Test V3**

**Test 1**

This exercise aims to create an application(NodeJS) on a Docker container (multistage) which displays the version, last commit of code and Description. 
This application code will be deployed using TravisCI (CICD Tool). 
Synk has also been used for quality and security assurance for the code. 
The code has been checked in the GitHub repository - /https://github/com/SCK59/scktestv3 for version control. 
The repository has 'Public access' as per the instructions provided. 


**Pre-Requisites**
* Download and install NodeJS from node downloads. The current LTS version is 12.18.2. 
* Download and install Docker Desktop.
* A GitHub account
* A TravisCi account
* A Snyk account.
* A Dockerhub account (Optional) 
* Note: TravisCI, Synk both require a GitHub account and the one created above can be used. 


**Application Version**

3 part versioning approach (X.X.X) is followed for application. 'Version' in package.json controls the versioning in node package. 

  * Patch release -- Increments the third digit for security patches etc [backward compatible].
    ``` 
    npm version patch 
    ```
  * Minor release -- Increments the second digit for bug fixes and small enhancements [backward compatible].
    ```
    npm version minor  
    ```    
  * Major relase -- Increments the first digit (sets second and third digit to zero) for major upgrades, new features which may not have backward compatibility.
    ```
    npm version major 
    ``` 


**Deployment Steps**
1. Clone the git repo
    - Login to local machine and directory where repo should be downloaded.
    - Execute the following command: 
    ```git clone https://github.com/SCK59/scktestv3.git```

2. Start the application
    This steps ensures that application is created and running as expected (without Docker)
    - Install necessary packages
    - Start the application 
      ```
      npm install
      npm start 
      ```
    - Check application
      Login to any browser and go to URL: http://localhost:8081/version 

    This will display 3 application reqiurements as follows

        * Version          : Read from package.json file as version.
        * Last commit SHA  : Read from the metadata file during runtime as sha.
        * Description      : Read from package.json as description.


    To run a Unit Test
      - Execute the follwoing command to run a unit test after the application is started. 
        ```
        npm test
        ```
      - To run security tests we need to install and authenticate snyk : https://snyk.io/test/
    

3. Docker Build 

  To build a Docker Image execute the following: 

  ```
  docker build -t local-build-tag --build-arg COMMIT_SHA=test1234 --build-arg PORT_ARG=8080 . 
  ```

    where, 
          -t = tag (for easy identification of the image built) 
          --build args = the arguments supplied for the build, 
    that is, 
          COMMIT_SHA which is last git commit.
          PORT_ARG set the port number (8080 in this case).

  _Please note: A .dockerignore file and .gitignore file have been created and are placed in the repo. These files specify which files and directories in the project directory should not be copied over to the docker container._

  Run the following command to list the images built: 
  ```
  docker images 
  ```

  For Unit test, execute:
  ```
  docker build -t run_tests --target tester .
  ```

4.  Run Docker Container (with application)  
    If build stage is successful and the built image has beeb listed, then run the container. 
    [A docker container can be used to run any OS for the application. For this exercise, the default aka vanila flavor OS has been used- Linux Apline. 

    ```
    docker run --name v3test1 -p 80:8080 -d local-build-tag 
    ```
    where, 

        -p is specified for port binding, i.e., redirects a public port to a private port inside the container.    Port 80 of the machine is mapped to 8080 of the docker image.

        -d is for detached mode, i.e, leave the container running in the background. 

        --name is the image of the Docker Container. 
        local-build-tag is the image built in step above. 


    Run the following command to check the status of the docker image , i.e., if it is running or not. 
    ```
    docker ps 
    ```

    Check Application is up and running. Open any browser and type: 
    http://localhost/version


    To run snyk tests on docker container use
    ```snyk test --docker local-build-tag```

5.  Push image to DockerHub
    By pushing the image to DockerHub, it will be available for subsequent use. Execute the following commands to push the image: 
    ```     
    docker login -u <dockerhub_username>
    docker push <dockerhub_username/v3test1> 
    ```

6. Setup and usage of CI tool (Travis CI) 

    Pre-req for Travis CI: 

    Follow the steps mentioned here to setup Travis CI with your git repo. 

    https://docs.travis-ci.com/user/tutorial/#to-get-started-with-travis-ci-using-github

    Set the below variables for our repository

    [refer link: https://docs.travis-ci.com/user/environment-variables/#defining-variables-in-repository-settings]

    1. DOCKER_PASSWORD
    2. DOCKER_USER 
    3. PORT_ARG 
    4. PROJECT 
    5. SNYK_TOKEN 

    This repo contains a .travis.yml file which is must for the deployment. The file contains:
    
      * First section, which set the language(nodejs) and service (docker) used.

      * Second section, to setup pre-steps and environment which include install packages, run a unit test for docker and snyk. 

      * Third section, includes env setup, execute scripts to build docker image and tag using commit sha followed by synk tests. 

      * Final section, tags and pushes the image to dockerhub.


    To trigger a build we need to commit and push to this repo. Travis-CI will automatically trigger a build and push the image to docker hub using the login credentials provided in env variables. 
    
    ** Build status **
    [![Build Status](https://travis-ci.com/SCK59/scktestv3.svg?branch=master)](https://travis-ci.com/SCK59/scktestv3)

    Docker image versioning is handled by CI pipeline which tags the images using the first 6 characters of the git commit sha. It can be changed to use the pipeline build number by making some changes to travis.yml file. To acheive this replace $COMMIT in the file with $TRAVIS_BUILD_NUMBER.

7. Subsequent use of Docker Image. 
    Execute the follwings steps to extract the image from docker hub and run app on local machine: 
      ```
      docker pull SCK59/scktestv3
      docker run -p 80:8080 -d --name v3test1 SCK59/scktestv3
      ```
    Test on browser using: http://localhost/version


**Risks and Future enhancements**

    1. The CI pipeline has unencrypte password being stored in the home directory. The encrypted keys for DOCKER_PASSWORD and DOCKER_USER should be used.
    2. The docker container can potentially run more than just the nodejs application. To prevent this we can use dumb-init which always uses PID 1 for the application it starts. This can avoid multiple processes in a single container.
    3. The application is not secure and once deployed anybody can access the api /version. 
    4. The application is run as non-root user. This prevents risks associated with root user access,however, a secure service account should be used for deployment. 



**Test 2**

This exercise aims to create a Kubernetes (k8s) manifest for application to be deployable on K8s.

_Using Docker Desktop,_

  The files in repo for this deployment are

      * k8test2_nmspc.yaml - This YAML file creats a new namespace 'technical-test'. 
      * k8test2.yaml       - This YAML file will deploy application in namespace created. 


  Pre-Requisites:

  * Docker Desktop is installed on the laptop or local machine. 
  [use URL: https://docs.docker.com/desktop/]

  * Enable Kubernetees in your local Docker Desktop. 
  [Refer URL if required: https://www.techrepublic.com/article/how-to-add-kubernetes-support-to-docker-desktop]

  * Ensure that Docker conatiner is up and running from Test 1 above. Use command, 
    ```
    docker ps ---to list conatiners running. 
    docker start <name> ---to start the docker container if shutdown.
    ``` 
  [Please note that this deplyment is using docker image created in test1 and should be available] 


  Deployment:

  1. Check kubernetes cluster to check all is running fine.
      ```
      kubectl cluster-info
      ```

      Check and list namespaces [in case running in existing cluster, to check there are no name clashes]
      ```
      kubectl get namespaces
      ```
      ---this will list the existing namespaces. 


  2. Deploy YAML files
      To deploy files use,
      ```
      kubectl apply -f k8test2_nmspc.yaml -f k8test2.yaml --recursive
      ```
      where,
          -f          = the file names to be deployed or created.
          --recursive = to ensure the files created in that order. 
          [Namespace should be created prior to being used in Deployment & Service]

      If successful, list the deployment and services using commands in namespace "technical-test" below:

        ```      
        kubectl get deployments --namespace=technical-test
        kubectl get services --namespace=technical-test
        ```

  3. Check application
      Open any browser and visit application on Port listed in services above as 'localhost:portnumber'.



_Using Google Cloud with Kubernetes_

  Pre-requisites:

    - GCP Login
    - A functional setup, i.e., Cluster exists and IAM is setup. 
    - Github account (created in test 1 to use files from repository)

  Files in repo for the same:

    1. cloudbuild.yaml
    2. cloudbuild-delivery.yaml
    3. v3test2k82.yaml

  These files will be used in google cloud for cloud build, deplyment.
