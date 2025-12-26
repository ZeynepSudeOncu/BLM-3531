namespace Auth.Application.DTOs
{
    public class TruckListResponse
    {
        public Guid Id { get; set; }
        public string Plate { get; set; } = null!;
        public bool IsAssigned { get; set; }
    }
}
