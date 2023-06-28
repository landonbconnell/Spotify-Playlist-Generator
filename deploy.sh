az group create --name SPGResources --location "East US" && az appservice plan create --name SPGPlan --resource-group SPGResources --sku S1 --is-linux && az webapp create --resource-group SPGResources --plan SPGPlan --name SPG-WebApp --multicontainer-config-type compose --multicontainer-config-file docker-compose.yml
