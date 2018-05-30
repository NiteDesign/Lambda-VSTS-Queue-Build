# Script to update Octopus Variable via Octopus API
param(
[string]$VarName, # Variable name to update. Passed via Build definition
[string]$AMIID, # New value for variable. Passed via Build definition
[string]$APIKey, # Octopus APIKey passed as encrypted build variable
[string]$projectName, # Octopus Project Name passed as build variable,
[string]$sourceBranch #Source branch for Prod AMI copy
)

Function UpdateOctopusVariable($amiID)
{
    # Load required assemblied
    Add-Type -Path "C:\Program Files (x86)\Octopus\Newtonsoft.Json.dll"
    Add-Type -Path "C:\Program Files (x86)\Octopus\Octopus.Client.dll"

    # Connection data
    $OctopusURL = "http://octopus-hostname/octopus/"
    $endpoint = new-object Octopus.Client.OctopusServerEndpoint ($OctopusURL, $APIKey)
    $repository = new-object Octopus.Client.OctopusRepository $endpoint

    # Get Project
    $project = $repository.Projects.FindByName($projectName)

    # Get Project's variable set
    $variableset = $repository.VariableSets.Get($project.links.variables)

    $variable = $variableset.Variables | ?{$_.Name -eq $VarName}

    # Update variable
    $variable.Value = $amiID

    # Save variable set
    $repository.VariableSets.Modify($variableset)
}
Try
{
    write-host "Updating variable: $VarName value:$AMIID "
    UpdateOctopusVariable $AMIID
}
Catch
{
    $result += $actionFailed
    $result += "`r`n   Exception Type: $($_.Exception.GetType().FullName)"
    $result += "`r`n   Exception Message: $($_.Exception.Message)"
    Write-Host $result
    Write-Error "Updating Octopus Variable Failed"
}
