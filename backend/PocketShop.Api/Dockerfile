# Stage 1: Build the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["PocketShop.Api.csproj", "./"]
RUN dotnet restore "PocketShop.Api.csproj"

# Copy everything else and build
COPY . .
RUN dotnet publish "PocketShop.Api.csproj" -c Release -o /app/publish

# Stage 2: Serve the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "PocketShop.Api.dll"]