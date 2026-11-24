// Canary fixture: an infrastructure change. Synthetic; never deployed.
targetScope = 'resourceGroup'

@description('Where the canary would live. Nothing is deployed from this repository.')
param location string = resourceGroup().location

output canaryLocation string = location
