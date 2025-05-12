namespace JobHuntMate.Api.Helpers
{
    public static class EmailTemplateHelper
    {
        public static string GetEmailBody(string templatePath, Dictionary<string, string> placeholders)
        {
            var body = File.ReadAllText(templatePath);
            foreach (var placeholder in placeholders)
            {
                body = body.Replace($"{{{{{placeholder.Key}}}}}", placeholder.Value);
            }
            return body;
        }
    }

}
