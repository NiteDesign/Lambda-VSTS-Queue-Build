# Lambda-VSTS-Queue-Build
Queues a VSTS build

### Create new AWS Lambda
Choose runtime Node.js 6.10

Provide Lamda Environment variables
* **defintionID** - The VSTS defintion ID of the build to queue, this can be found by value of the **system.definitionId**
 within the Build Defintion Variables
* **vsts_key** - The VSTS Personal Access Token (PAT) with sufficient permissions to queue the build.  The Lambda expects the key to be encrypted using KMS.
* **sourceBranch** - The Branch to use for the build, typically Master
* **VSTShostname** - The VSTS hotname for your team, can be derived as **company.visualstudio.com** from the URL: https://company.visualstudio.com
* **VSTSprojectname** - The VSTS project name, this can be derived as **projectName** from the URL: https://company.visualstudio.com/projectName
 
### Modify Lambda code for user-specific Build Definition Varialbes
User defined variables to be passed to the queued build definition.

Provide in the format of "{\"variableName1\": \"variableValue1\", \"variableName2\": \"variableValue2\"}"
