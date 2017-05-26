pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building..'
                sh 'docker-compose build build_server'
                sh 'docker-compose run build_server'
            }
        }
        stage('Deploy') {
            steps {
                withCredentials([string(credentialsId: 'AWS_S3_BUCKET', variable: 'AWS_S3_BUCKET')]) {
                    echo "Uploading files to S3"
                    sh '''
                        set +x
                        aws s3 sync _site/* s3://$AWS_S3_BUCKET/
                    '''
                }

                withCredentials([string(credentialsId: 'AWS_CLOUDFRONT_DISTRIBUTION', variable: 'AWS_CLOUDFRONT_DISTRIBUTION')]) {
                    echo "Invalidating CloudFront..."
                    sh '''
                        set +x
                        aws cloudfront create-invalidation --distribution-id AWS_CLOUDFRONT_DISTRIBUTION --paths /*
                    '''
                }
            }
        }
    }
}