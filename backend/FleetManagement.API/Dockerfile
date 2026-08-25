FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# copy entire repository (build context should be the repo root)
COPY . .

# restore and publish the API project
RUN dotnet restore "backend/FleetManagement.API/FleetManagement.API.csproj"
RUN dotnet publish "backend/FleetManagement.API/FleetManagement.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80
COPY --from=build /app/publish ./
ENTRYPOINT ["dotnet", "FleetManagement.API.dll"]
