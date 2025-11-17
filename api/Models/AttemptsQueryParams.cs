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
        public int PageSize { get; set; } = 6; // default
        public string? Search { get; set; }

        // Map frontend felter til backend
        public static AttemptsQueryParams FromFrontend(dynamic request)
        {
            var query = new AttemptsQueryParams
            {
                Page = request.page,
                PageSize = request.pageSize,
                Search = request.searchSentToBackend,
                SortBy = request.sortSentToBackend.Contains("score") ? "score" : "submittedAt",
                SortOrder = request.sortSentToBackend.EndsWith("_asc") ? "asc" : "desc"
            };

            if (request.fromDate != null) query.FromDate = request.fromDate;
            if (request.toDate != null) query.ToDate = request.toDate;
            if (request.minScore != null) query.MinScore = request.minScore;
            if (request.maxScore != null) query.MaxScore = request.maxScore;

            return query;
        }
    }
}
