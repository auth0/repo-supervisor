# AWS Lambda Deployment

It's required to deploy repo supervisor on AWS Lambda if you want to use the HTML reports and Pull Requests scanning feature.

**Pre-requisites:**

- AWS Account
- Understanding on how to use AWS Lambda (read: [Lambda intro](https://aws.amazon.com/lambda/) and [Lambda + Webhooks](https://aws.amazon.com/quickstart/architecture/git-to-s3-using-webhooks/)])

## Lambda configuration

It's the simplest form of deploying an application on AWS Lambda. There needs to be a URL that invokes Lambda function and returns a result. You need to have API Gateway configured in front of Lambda to receive Github webhook calls.

- Lambda -> Functions -> Create function
  - Function name: repoSupervisor
  - Runtime: Node.js 10.x
- Lamba -> Functions -> repoSupervisor
  - Add trigger: API Gateway
  - API: Create a new API of HTTP API type

After clicking on the API Gateway icon, you should see a URL of your Lambda function that you can use as a webhook URL for your repository. Since deploying this function is not different than a standard deployment in case of issues, the [official documentation from AWS](https://docs.aws.amazon.com/lambda/latest/dg/getting-started-create-function.html) is a recommended reading.
