using FirebaseAdmin;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;

namespace PocketShop.Api.Services;

public class FirebaseAuthService
{
    private static bool _initialized;

    public static void Initialize(IConfiguration configuration)
{
    if (_initialized) return;

    var credentialPath = configuration["Firebase:CredentialPath"];
    Console.WriteLine($"Looking for Firebase credentials at: {credentialPath}");

    if (!string.IsNullOrEmpty(credentialPath) && File.Exists(credentialPath))
    {
        FirebaseApp.Create(new AppOptions
        {
            Credential = GoogleCredential.FromFile(credentialPath)
        });
        Console.WriteLine("✅ Firebase Admin initialized successfully");
        _initialized = true;
    }
    else if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS")))
    {
        FirebaseApp.Create(new AppOptions
        {
            Credential = GoogleCredential.GetApplicationDefault()
        });
        Console.WriteLine("✅ Firebase Admin initialized from environment variable");
        _initialized = true;
    }
    else
    {
        Console.WriteLine("❌ Firebase credentials not found. Auth will not work.");
    }
}

   public static async Task<FirebaseToken?> VerifyIdTokenAsync(string idToken)
{
    if (!_initialized)
    {
        Console.WriteLine("❌ Firebase is NOT initialized");
        return null;
    }

    try
    {
        var decoded = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
        Console.WriteLine($"✅ Token verified. UID = {decoded.Uid}");
        return decoded;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Token verification failed: {ex.Message}");
        return null;
    }
}
}