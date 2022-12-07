using DatingApp.API.Data;
using Microsoft.EntityFrameworkCore.SqlServer;
using Microsoft.EntityFrameworkCore;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        builder.Services.AddControllers();
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();


        builder.Services.AddDbContext<DataContext>(options =>
            options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

        //adding cors
        // builder.Services.AddMvc();
        // builder.Services.AddCors();//options =>
        // // {
        // //     options.AddPolicy(name: MyAllowSpecificOrigins,
        // //                         builder =>
        // //                         {
        // //                             builder.WithOrigins("http://localhost:4200");
        // //                         });
        // // });

        var app = builder.Build();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();

        //adding cors
        // app.UseCors(MyAllowSpecificOrigins);
        app.UseCors(x => x
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowAnyOrigin());

        app.UseAuthorization();

        app.MapControllers();

        app.Run();


    }
}