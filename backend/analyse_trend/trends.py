import os

def get_reddit_trend(subreddits, keywords):
    import praw

    reddit = praw.Reddit(
        client_id=os.environ.get("REDDIT_CLIENT_ID"),
        client_secret=os.environ.get("REDDIT_CLIENT_SECRET"),
        user_agent="AnalyseTrend"
    )

    try:
        keyword_count = {}
        for keyword in keywords:
            keyword_count[keyword] = 0
            for subreddit in subreddits:
                keyword_count[keyword] += sum(1 for _ in reddit.subreddit(subreddit).search(keyword, sort="new", time_filter="week"))
            
        return ' '.join(map(lambda x: f'Keyword "{x}" appeared in reddit {keyword_count[x]} times in the past week.', keyword_count.keys()))
    except Exception as e:
        return ''

def get_google_trends(keywords):
    from pytrends.request import TrendReq

    pytrends = TrendReq(hl='en-US', tz=360)
    try:
        pytrends.build_payload(keywords, timeframe='now 7-d')
        df = pytrends.interest_over_time()
        return ' '.join(map(lambda x: f'Keyword "{x}" was searched in google with mean={df[x].mean()}, median={df[x].median()} over the week.', keywords))
    except Exception as e:
        return ''