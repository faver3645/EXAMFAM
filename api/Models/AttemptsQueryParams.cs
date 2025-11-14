using System;

namespace api.Models
{
    public class AttemptsQueryParams
    {
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }

        public int? MinScore { get; set; }
        public int? MaxScore { get; set; }

        // sortBy: "score" | "submittedAt"
        public string SortBy { get; set; } = "submittedAt";
        // sortOrder: "asc" | "desc"
        public string SortOrder { get; set; } = "desc";

        // paging
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 50; // default - tune as needed
    }
}
