namespace Auth.Domain.Entities;

public class Depot
{
    public string Id { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string Address { get; set; } = default!;
    public int Capacity { get; set; }
    public bool IsActive { get; set; } = true;
}
