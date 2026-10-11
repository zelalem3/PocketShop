using System.Security.Claims;
using PocketShop.Api.Services;

namespace PocketShop.Api.Middleware;

public class FirebaseAuthMiddleware
{
    private readonly RequestDelegate _next;

    public FirebaseAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
{
    var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
    Console.WriteLine($"Auth header length: {authHeader?.Length}");

    if (!string.IsNullOrEmpty(authHeader))
    {
        string token;

        if (authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
            token = authHeader["Bearer ".Length..].Trim();
        else
            token = authHeader.Trim();

        // Debug info
        var segments = token.Split('.');
        Console.WriteLine($"Token length: {token.Length}");
        Console.WriteLine($"Number of segments: {segments.Length}");
        Console.WriteLine($"First 30 chars: {token.Substring(0, Math.Min(30, token.Length))}");
        Console.WriteLine($"Last 30 chars: {token.Substring(Math.Max(0, token.Length - 30))}");

        var firebaseToken = await FirebaseAuthService.VerifyIdTokenAsync(token);

        if (firebaseToken != null)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, firebaseToken.Uid),
                new Claim("firebase_uid", firebaseToken.Uid)
            };

            if (firebaseToken.Claims.TryGetValue("email", out var email))
                claims.Add(new Claim(ClaimTypes.Email, email.ToString()!));

            context.User = new ClaimsPrincipal(new ClaimsIdentity(claims, "Firebase"));
        }
    }

    await _next(context);
}
}