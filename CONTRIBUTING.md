# Contributing Guidelines

The following is the suggested workflow to be followed to contribute code to this repository:

### Step 1: Fork the repository

Fork the repository [from here](https://github.com/aashreyj/data-visitation-etl) to your own namespace.

### Step 2: Clone your fork to your local machine

Clone your own fork to your local machine using HTTPS or SSH.  

For SSH, you would need to generate a SSH public-private key pair and upload the public key to GitHub. You can refer to [this GitHub article](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) for instructions, which also contains a sub-article with instructions on how to generate the keys. For HTTPS, the link can be copied right away from the GitHub page.

Run the following command from the desired directory to clone the repo:  
`git clone <repo-clone-link>`

### Step 3: Add upstream to the local repo

Run the following command:

```
git remote add upstream https://github.com/aashreyj/data-visitation-etl.git
```

### Step 4: Create a local branch

Create a branch with a meaningful name for your contribution using the command:  
`git checkout -b <branch-name>`

### Step 5: Install the necessary dependencies

Change to the desired folder and install the necessary dependencies using `npm install`

### Step 6: Commit your changes with a meaningful commit message using 
```git commit -m "<message>"```

### Step 7: Push your changes to the local fork using 
```git push origin main```

### Step 8: Create a new Pull Request

Create a new Pull Request with source as your local branch and the target as the upstream repo. In the PR make sure to add a description and test results. Also add screenshots if you are contributing UI related changes.

### Step 9: Once the PR is reviewed by the team members, it will be merged to  the main repo.

### Step 10: Pull changes from upstream

Run the command to pull the latest changes from upstream:
```
git pull upstream main
```
