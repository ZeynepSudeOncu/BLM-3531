namespace Auth.Application.Services;
using Auth.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface ITruckService
{
    Task<IReadOnlyList<Truck>> GetAllTrucksAsync();
}
