#
# Function that creates property definitions for the PropertyGrid input control
#
function CreateSamplePropertySettings()
{
    $version = $PSVersionTable
    return @(
        (New-Object PSObject -Property @{ Name = "Version"; Type = "String"; Category = "Versions"; Description = "Version of the currently running PowerShell"; Default = $version.PSVersion.ToString(); }),
        (New-Object PSObject -Property @{ Name = "BuildVersion"; Type = "String"; Category = "Versions"; Description = "Build version of the PowerShell"; Default = $version.GitCommitId.ToString(); }),
        (New-Object PSObject -Property @{ Name = "OS"; Type = "String"; Category = "Versions"; Description = "OS version"; Default = $version.OS.ToString(); }),
        (New-Object PSObject -Property @{ Name = "Platform"; Type = "String"; Category = "Versions"; Description = "OS version"; Default = $version.Platform.ToString(); }),
        (New-Object PSObject -Property @{ Name = "WSManStackVersion"; Type = "String"; Category = "Versions"; Description = "WS Man Stack version of the PowerShell"; Default = $version.WSManStackVersion.ToString(); }),
        (New-Object PSObject -Property @{ Name = "RemotingProtocolVersion"; Type = "String"; Category = "Versions"; Description = "PS remoting protocol version of the PowerShell"; Default = $version.PSRemotingProtocolVersion.ToString(); }),
        (New-Object PSObject -Property @{ Name = "SerializationVersion"; Type = "String"; Category = "Versions"; Description = "Serialization version of the PowerShell"; Default = $version.SerializationVersion.ToString(); }),
        (New-Object PSObject -Property @{ Name = "Edition"; Type = "String"; Category = "Versions"; Description = "Edition of the PowerShell"; Default = $version.PSEdition }),
        (New-Object PSObject -Property @{ Label = "Caption for listview"; Name = "StringValue"; Type = "String"; Category = "Others"; Description = "A string property created from PowerShell script" }),
        (New-Object PSObject -Property @{ Label = "Boolean from code"; Name = "BooleanValue"; Type = "Boolean"; Category = "Others"; Description = "A booleab property created from PowerShell script" }),
        (New-Object PSObject -Property @{ Label = "LongString from code"; Name = "LongStringValue"; Type = "LongString"; Category = "Others"; Description = "A long string property created from PowerShell script" })
    )
}

#
# Following lines are needed for any PowerShell script reference to tell LSB that the loading is completed
#
$sig1 = "990303"
$sig2 = "040616"
Write-Host "$sig1$sig2"
