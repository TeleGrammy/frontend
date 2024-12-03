pipeline{
    agent any
    tools{
        nodejs 'node23'
    }
    environment{
        SONAR_TOKEN = credentials('SONAR_TOKEN')
    }
    stages{
        stage('Paving environment...'){
            steps{
                dir('telegrammy') {
                    script{
                        sh """
                        echo "VITE_API_URL=http://localhost:8080/api" > .env
                        npm install
                        """
                    }
                }
            }
        }
        stage('Run tests...'){
            steps{
                dir('telegrammy') {
                    script{
                        timeout(time: 5, unit: 'MINUTES'){
                            sh "npm run test"
                        }
                    }
                }
                dir('telegrammy') {
                    script{
                        if(env.CHANGE_ID){
                           sh 'docker build -t telegrammy/frontend --build-arg VITE_API_URL=http://localhost:8080/api .'
                        }
                    }
                }
            }
        }
        stage('Building...'){
            when{
                expression{
                    return !env.CHANGE_ID
                }
            }
            steps{
                dir('telegrammy') {
                    script{
                        def tag
                        if(env.BRANCH_NAME.startsWith('module/')){
                            tag = env.BRANCH_NAME.replace('module/','')
                            docker.withRegistry('https://index.docker.io/v1/','dockerhub-cred'){
                                sh 'docker build -t telegrammy/frontend --build-arg VITE_API_URL=http://localhost:8080/api .'
                                docker.image('telegrammy/frontend').push("${tag}")
                            }
                        } else if(env.BRANCH_NAME== 'main'){
                            tag = env.BUILD_NUMBER
                            sh 'docker build -t telegrammy/frontend --build-arg VITE_API_URL=http://telegrammy.tech/api .'
                            docker.withRegistry('https://index.docker.io/v1/','dockerhub-cred'){
                                docker.image('telegrammy/frontend').push("${tag}")
                            }
                        } else {
                            currentBuild.result = 'SUCCESS'
                            return
                        }
                        sh """
                            /var/lib/jenkins/.sonar/sonar-scanner-6.2.1.4610-linux-x64/bin/sonar-scanner \
                            -Dsonar.organization=telegrammy \
                            -Dsonar.projectKey=TeleGrammy_frontend \
                            -Dsonar.sources=. \
                            -Dsonar.exclusions=node_modules/**,dist/** \
                            -Dsonar.branch.name=${env.BRANCH_NAME} \
                            -Dsonar.login=${SONAR_TOKEN} \
                            -Dsonar.host.url=https://sonarcloud.io
                        """
                    }
                }
            }
        }
        stage('Updating manifests...'){
            when{
                expression{
                    return !env.CHANGE_ID && env.BRANCH_NAME == 'main'
                }
            }
            steps{
                cleanWs()
                withCredentials([string(credentialsId:'gh-pat',variable:'TOKEN'), string(credentialsId: 'manifest-email', variable:'EMAIL')]){
                    sh """
                            git clone "https://x-access-token:${TOKEN}@github.com/telegrammy/devops.git" manifests
                            cd manifests
                            git config user.email "${EMAIL}"
                            git config user.name "mohamedselbohy"
                            sed -i "s+telegrammy/frontend.*+telegrammy/frontend:${env.BUILD_NUMBER}+g" ./kubernetes/frontend/frontend-deployment.yml
                            git add .
                            git commit -m "Automated manifest update #${env.BUILD_NUMBER}"
                            git push "https://x-access-token:${TOKEN}@github.com/telegrammy/devops.git" HEAD:main
                        """
                }
            }
        }
    }
    post{
        always{
            cleanWs()
        }
    }
}
