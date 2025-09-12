using System;
using System.Security.Claims;
using API.DTOs;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{

    [HttpGet("unauthorized")]
    public IActionResult GetUnauthorized()
    {
        return Unauthorized();
    }

    [HttpGet("badrequest")]
    public IActionResult GetBadRequest()
    {
        return BadRequest();
    }

    [HttpGet("notfound")]
    public IActionResult GetNotFound()
    {
        return NotFound();
    }

    [HttpGet("internalerror")]
    public IActionResult GetInternalError()
    {
        throw new Exception("This is a test exception");
    }


    [HttpPost("validationerror")]
    public IActionResult GetValidationError(CreateProductDto product)
    {
        //ivde nammakk Porduct clss direct use akan potilla athil required angane kodthad konnd so ath maati createproductdto pole kodthal work aakum
        return Ok();
    }

    [Authorize]
    [HttpGet("secret")]
    public IActionResult GetSecret()
    {
        //login cheyd cookie undenkil mathre ee api authorize aakullu (UserIL check aakum authenticated annonne )
        //frst check loginastom-getcookie and then u will get cokki then getsecretbybuggycontroller from postman
        var name = User.FindFirst(ClaimTypes.Name)?.Value;
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //user reg akumbol thanne id create aakum and login cheyyumbol claims aa idine edkum then here agin check aakum
        // So the timeline is:
        // Register → DB row created → Id generated.
        // Login → Identity fetches that DB row → puts the same Id into claims.
        // Controller → You read it back using User.FindFirst(...).
        return Ok("Hello " + name + " with the id of " + id);
    }

    


  

}
