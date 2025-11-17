namespace Auth.Domain.Entities;

public class Truck
{
    public Guid Id { get; set; } 
    public string Plate { get; set; }
    public string Model { get; set; }
    public string Status { get; set; } 
    public int Capacity { get; set; } 
}
