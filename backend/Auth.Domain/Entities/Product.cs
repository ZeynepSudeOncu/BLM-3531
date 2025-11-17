namespace Auth.Domain.Entities;

public class Product
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; }
    public string SKU { get; set; }
    public string Category { get; set; }
    public int Stock { get; set; }
    public int MinStock { get; set; }
    public string DepotId { get; set; }
}
