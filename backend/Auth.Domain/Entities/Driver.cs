namespace Auth.Domain.Entities;

public class Driver
{
    public string Id { get; set; }
    public string FullName { get; set; }
    public string Phone { get; set; }
    public string License { get; set; }
    public string Status { get; set; }

    // 👇 KAMYON ATAMASI
    public Guid? AssignedTruckId { get; set; }
}
