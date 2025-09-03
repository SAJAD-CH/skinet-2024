using System;
using System.Net;
using System.Text.Json;
using API.Errors;

namespace API.Middleware;

public class ExceptionMiddleware(IHostEnvironment env, RequestDelegate next) //next represents the next middlware
{
    public async Task InvokeAsync(HttpContext context) //InvokeAsync enna name thanne middlewareil use aakennam illenki work aakilla
    {
            try
            {
            await next(context);
            }
            catch (Exception ex)
            {

            await HandleExceptionAsync(context, ex, env);//if error happens catch it 
            }
    }

    //internal server error
    private static Task HandleExceptionAsync(HttpContext context, Exception ex, IHostEnvironment env)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;//500

        var response = env.IsDevelopment()
        ? new ApiErrorResponse(context.Response.StatusCode, ex.Message, ex.StackTrace) //devil detailed info kanikkennam 
        : new ApiErrorResponse(context.Response.StatusCode, ex.Message, "Internal server error");//prodil internal server error mathram kanichadi

        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        var json = JsonSerializer.Serialize(response, options);

        return context.Response.WriteAsync(json);


    }
}
