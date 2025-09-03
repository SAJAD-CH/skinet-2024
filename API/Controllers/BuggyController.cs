using System;
using API.DTOs;
using Core.Entities;
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


  

}
