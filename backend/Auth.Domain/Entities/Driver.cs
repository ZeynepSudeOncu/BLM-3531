namespace Auth.Domain.Entities;

public class Driver
{
    public string Id { get; set; } 
    public string FullName { get; set; }
    public string Phone { get; set; }
    public string License { get; set; } 
    public string? AssignedTruckId { get; set; }
    public string Status { get; set; } 
}
