pipeline {
     agent {
         label 'mean2'
     }
     stages {
        stage("Build") {
            steps {
                sh "sudo npm i"
               
            }
        }
        stage("Deploy") {
            steps {
                sh "sudo pm2 restart blockchainsamad-1832"
                sh "echo node-solidityexpert.mobiloitte.io"
                
            }
        }
    }
}
