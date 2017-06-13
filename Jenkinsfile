pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                echo 'Building site'
                sh 'docker-compose build build_server'
                sh 'docker-compose run build_server'
            }
        }
        stage('Deploy: Production') {
            when {
                branch 'master'
            }
            steps {
                withCredentials([string(credentialsId: 'AWS_S3_BUCKET', variable: 'AWS_S3_BUCKET')]) {
                    echo "Uploading files to S3"
                    sh '''
                        set +x
                        cd _site
                        aws s3 sync . s3://$AWS_S3_BUCKET/
                    '''
                }

                withCredentials([string(credentialsId: 'AWS_CLOUDFRONT_DISTRIBUTION', variable: 'AWS_CLOUDFRONT_DISTRIBUTION')]) {
                    echo "Invalidating CloudFront..."
                    sh '''
                        set +x
                        aws cloudfront create-invalidation --distribution-id $AWS_CLOUDFRONT_DISTRIBUTION --paths '/*'
                    '''
                }
            }
        }
        stage('Deploy: Staging') {
                    when {
                        branch 'develop'
                    }
                    steps {
                        withCredentials([
                            string(credentialsId: 'STAGING_AWS_S3_BUCKET', variable: 'AWS_S3_BUCKET'),
                            string(credentialsId: 'STAGING_AWS_S3_REGION', variable: 'AWS_S3_REGION')
                        ]) {
                            echo "Uploading files to S3"
                            sh '''
                                set +x
                                cd _site
                                aws s3 sync --region $AWS_S3_REGION . s3://$AWS_S3_BUCKET/
                            '''
                        }
                    }
                }
    }
}
