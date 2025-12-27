using Auth.Application.Abstractions.Repositories;
using Auth.Application.Abstractions.Security;
using Auth.Application.Abstractions.Services;
using Auth.Domain.Entities;

namespace Auth.Infrastructure.Services.Auth;

public class AuthService(
    IUserRepository users,
    IPasswordHasher hasher,
    IJwtTokenGenerator jwt,
    IUnitOfWork uow) : IAuthService
{
    public async Task<(bool ok, string? token, string? error)> RegisterAsync(string email, string password, string role, CancellationToken ct = default)
    {
        var existing = await users.GetByEmailAsync(email, ct);
        if (existing is not null)
            return (false, null, "Email already exists.");

        var user = new AppUser
        {
            Email = email,
            PasswordHash = hasher.Hash(password),
            Role = role

        };

        await users.AddAsync(user, ct);
        await uow.SaveChangesAsync(ct);

        var token = jwt.CreateToken(user.Id, user.Email, user.Role, user.DepotId, user.StoreId);
        return (true, token, null);
    }

    public async Task<(bool ok, string? token, string? error)> LoginAsync(string email, string password, CancellationToken ct = default)
    {
        var user = await users.GetByEmailAsync(email, ct);
        if (user is null) return (false, null, "Invalid credentials.");

        if (!hasher.Verify(password, user.PasswordHash))
            return (false, null, "Invalid credentials.");

        // Depot kullanıcısı ise DepotId claim'i ekleyerek token üret
        var token = jwt.CreateToken(
            user.Id,
            user.Email,
            user.Role,
            user.DepotId,
            user.StoreId);
        return (true, token, null);
    }
}
