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
        (New-Object PSObject -Property @{ Name = "Caption string for listview"; Type = "String"; Category = "Others"; Description = "String input" }),
        (New-Object PSObject -Property @{ Name = "Boolean"; Type = "Boolean"; Category = "Others"; Description = "Boolean input" }),
        (New-Object PSObject -Property @{ Name = "LongString"; Type = "LongString"; Category = "Others"; Description = "Long string input" })
    )
}

#
# Following lines are needed for any PowerShell script reference to tell LSB that the loading is completed
#
$sig1 = "990303"
$sig2 = "040616"
Write-Host "$sig1$sig2"
