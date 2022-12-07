Steps for .net core 

1) Create Models folder and create the relevant fields to be in the table
2) Get the Microsoft Entity frameWork
    a) dotnet tool install --global dotnet-ef
    b) dotnet add package Microsoft.EntityFrameworkCore
    c) dotnet add package Microsoft.EntityFrameworkCore.tools
    d) dotnet add package Microsoft.EntityFrameworkCore.SqlServer
    e) dotnet add package Microsoft.EntityFrameworkCore.Sqlite

3) Create a data folder and create a DataContext.cs file
4) Add the name of the table as in the DataContext.cs file as a property
5) Go to program.cs file and create a service builder as shown
    a) Also create ConnectionStrings Field in appsettings.json
6) Create migration folder - dotnet ef migrations add InitialCreate
7) Create the database - dotnet ef database update
8) Create a Controller in the Controllers folder. In the controller file
    a) add the route and api controller 
    b) Add a constructor(ctor) and inject the DataContext class and name a parameter
    c) To make the parameter visible throughout the file, press ctrl+. and initialize field from parameter
