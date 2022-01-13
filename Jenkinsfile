pipeline {
    agent any
    
    environment
    {
        ON_SUCCESS_SEND_EMAIL=true
        ON_FAILURE_SEND_EMAIL=true
    }
    
    parameters
    { 
        booleanParam(name:'CLEAN_WORKSPACE',
        defaultValue:true,
        description:'Trebuie de sters mapa pentru buld-ul curent?'
        )
        booleanParam(name:'TESTING_FRONTEND',
        defaultValue:false,
        description:'Trebuie de testat frontend-ul?'
        )
    }
    
    tools {

        nodejs "NodeJS"


    }

    stages {
        stage('Build') {
            steps {
                echo 'Building the application'
                // Get some code from a GitHub repository
                git 'https://github.com/Annnia20/TIDPP_Lab3.git'
                bat 'npm install'

            }
        }
        stage('Test backend')
        {
            steps{
                echo 'Testarea backend'
                bat "npm test"
            }  
            /*post {
                // If Maven was able to run the tests, even if some of the test
                // failed, record the test results and archive the jar file.
               success {
                    junit 'output/coverage/junit/junit.xml'
               }
            } */
        }
        stage('Test front end')
        {
            when
            {
                expression
                {
                    params.TESTING_FRONTEND==true
                }
            }
            steps{
                echo "Testarea frontend ${params.TESTING_FRONTEND}"
            }    
        }
        
    }
    post
    {
        always 
        {
            script
            {
                if(params.CLEAN_WORKSPACE==true)
                {
                    echo 'Stergerea mapei create'
                    cleanWs()
                }
                
            }
        }
        success
        {

            script
            {
                if(env.ON_SUCCESS_SEND_EMAIL)
                {
                    echo "Send email success job name: ${JOB_NAME}, build number: ${BUILD_NUMBER}, build url: ${BUILD_URL} "
                    emailext ( body: "Success! job name: ${JOB_NAME}, build number: ${BUILD_NUMBER}, build url: ${BUILD_URL}", subject: 'Build', to: 'ecaterinaciobanu49@gmail.com')
                    echo 'Email sent'
                }
            }
        }
        failure
        {

            script
            {
                if(env.ON_FAILURE_SEND_EMAIL)
                {
                    echo "Send email fail job name: ${JOB_NAME}, build number: ${BUILD_NUMBER}, build url: ${BUILD_URL} "
                    emailext ( body: "Fail! job name: ${JOB_NAME}, build number: ${BUILD_NUMBER}, build url: ${BUILD_URL}", subject: 'Build', to: 'ecaterinaciobanu49@gmail.com')
                    echo 'Email sent'
                }
            }
        }
    }
}
