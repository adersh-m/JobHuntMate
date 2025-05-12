namespace JobHuntMate.Api.Models
{
    public class Result
    {
        public bool IsSuccess { get; }
        public string Message { get; }
        public object? Data { get; }

        private Result(bool isSuccess, string message, object? data = null)
        {
            IsSuccess = isSuccess;
            Message = message;
            Data = data;
        }

        public static Result Success(string message, object? data = null) => new(true, message, data);
        public static Result Failure(string message) => new(false, message);
    }
}
