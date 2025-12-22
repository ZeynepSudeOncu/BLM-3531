using Auth.Application.DTOs;
using Auth.Domain.Entities;

namespace Auth.Application.Services;

public interface ITruckService
{
    Task<List<Truck>> GetAllTrucksAsync();
    Task<Truck> CreateTruckAsync(CreateTruckDto dto);
    Task<bool> DeactivateTruckAsync(Guid id);
    Task<bool> UpdateTruckAsync(Guid id, UpdateTruckDto dto);


}
