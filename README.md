# Amplify Demo

This repository contains the Amplify 'Getting Started' application with some additions to make
it a bit more interesting. You should be able to deploy this app in your own account using the
following steps:

## 1. Install Amplify CLI

If you have not installed the Amplify CLI, you need to install that first:

```
npm install -g @aws-amplify/cli
```

Make sure you have recent enough version of NodeJS and NPM.

## 2. Configure Amplify CLI (optional)

If you have not used the AWS CLI before and did not configure any profiles, you can do that
through the AWS Amplify CLI:

```
amplify configure
```

This will ask you to log in and create an IAM user in your account, so Amplify can access
your cloud resources on your behalf. Because using root user credentials is considered a
no-go, Amplify will use the IAM user way. If you already have an IAM user with access keys
for your day-to-day work, and have configured this in a profile in `~/.aws/config`, you can
skip this step.

## 3. Initialize repo

Because the current environment is pinned to the Amplify app deployed in my account, you
will run into authorization issues if you try to deploy now using Amplify. What you need
to do is re-initialize the Amplify project and add an environment of your own, that uses
your AWS profile:

```
npm install
amplify init
```

When asked if you want to reuse an existing environment, select 'No'. This will ask you a
few questions about your new environment.

## 4. Publish app!

That's it! The rest should be ready to go:

```
amplify publish
```

Answer all the promps with 'Yes'. After some time, you will be presented with a GraphQL
endpoint and a URL where your frontend is hosted. The rest is magic.
