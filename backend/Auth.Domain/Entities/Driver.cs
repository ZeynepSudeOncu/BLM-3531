namespace Auth.Domain.Entities;

public class Driver
{
    public Guid Id { get; set; }

    public string FullName { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string License { get; set; } = null!;
    public string Status { get; set; } = null!;

    // 🚚 Kamyon ataması (1–1)
    public Guid? TruckId { get; set; }   // FK burada
    public Truck? Truck { get; set; }
}
